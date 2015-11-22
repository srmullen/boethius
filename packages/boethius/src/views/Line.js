import constants from "../constants";
import engraver from "../engraver";
import Measure from "./Measure";
import {getTime, getMeasureNumber, getMeasureByTime} from "../utils/timeUtils";
import * as placement from "../utils/placement";
import * as common from "../utils/common";
import * as lineUtils from "../utils/line";
import Note from "../views/Note";
import Rest from "../views/Rest";
import _ from "lodash";

const TYPE = constants.type.line;

function Line ({voices=[]}, children=[]) {

	const types = _.groupBy(children, child => child.type);

	// this.children = parseChildren(children, measures);
	this.children = children;

	// collect all marking arrays into one and sort them by time
	this.markings = _.sortByAll(_.reduce(_.omit(types, constants.type.measure), (arr, v) => {
		return arr.concat(v);
	}, []), "measure", (marking) => marking.beat ? marking.beat : 0); // if no beat on the marking then default to 0

	this.voices = voices;

}

Line.prototype.type = TYPE;

/*
 * @param staves - the number of staves
 * @param lineLength - the length of each line
 * @param measures - the number of measures
 */
Line.calculateAverageMeasureLength = function (staves, lineLength, measures) {
	return lineLength * (staves / measures);
}

/*
 * Static render is a self-contained render method. Handles all render method calls but provids less flexability.
 * @param line - instance of Line.
 * @param length - the length of the line.
 */
Line.render = function (line, length, voices, numMeasures=1) {
	// Steps for rendering a Line.
	// 1. Find the minimum width of each measure given the items that need to be renderred in it.
	// 2. Warn if there's not enough room on the line.
	// 3. Stretch the measures to accomodate the line length.
	// 4. Place items with the same stretch factor.

	let lineGroup = line.render(length), // draw the line
		voiceGroups = line.renderVoices(voices),
		// create the measures
		measures = Measure.createMeasures(numMeasures, line.children);

	// position voice children
	const noteHeadWidth = Scored.config.note.head.width,
		b = lineUtils.b(lineGroup),
		shortestDuration = 0.125; // need function to calculate this.

	// render markings
	_.each(line.markings, (marking) => {
		let markingGroup = marking.render(b)
		lineGroup.addChild(markingGroup);
	});

	// group and sort voice items by time.
	let allItems = line.markings.concat(_.reduce(voices, (acc, voice) => {
		return acc.concat(voice.children);
	}, []));
	let times = _.sortBy(_.map(_.groupBy(allItems, (item) => {
		return getTime(measures, item).time;
	}), (v, k) => {
		return {time: Number.parseFloat(k), items: v};
	}), v => v.time);

	// calculating measure lengths
	calculateAndSetMeasureLengths(measures, times, noteHeadWidth, shortestDuration);

	// render measures.
	let measureGroups = line.renderMeasures(measures, lineGroup, length);

	let cursor = noteHeadWidth,
	// let cursor = 0,
		previousMeasureNumber = 0;
	_.each(times, ({time, items}) => {
		let measureNumber = getMeasureNumber(measures, time), // get the measure the items belongs to
			context = line.contextAt(measures, {measure: measureNumber}),
			leftBarline = measures[measureNumber].barlines[0],
			{clef: clefs, timeSig: timeSigs, note: notes, rest: rests} = _.groupBy(items, item => item.type);

		// update cursor if its a new measure.
		if (measureNumber !== previousMeasureNumber) {
			let measure = measures[measureNumber];
			cursor = placement.calculateCursor(measure);
		}

		_.map(clefs, marking => {
			marking.group.translate([0, placement.getYOffset(marking)]);
			placement.placeAt(cursor, marking);
			cursor += placement.calculateCursor(marking);
		});

		_.map(timeSigs, marking => {
			marking.group.translate([0, placement.getYOffset(marking)]);
			placement.placeAt(cursor, marking);
			cursor += placement.calculateCursor(marking);
		});

		let possibleNextPositions = _.map(notes, note => {
			let yPos = placement.calculateNoteYpos(note, Scored.config.lineSpacing/2, placement.getClefBase(context.clef.value));

			note.group.translate(b.add([0, yPos]));
			placement.placeAt(cursor, note);

			return placement.calculateCursor(note);
		});

		possibleNextPositions.concat(_.map(rests, rest => {
			let pos = placement.getYOffset(rest.group);

			rest.group.translate(b.add(0, pos));
			placement.placeAt(cursor, rest);

			return placement.calculateCursor(rest);
		}));

		// next time is at smallest distance
		cursor += _.min(possibleNextPositions);

		previousMeasureNumber = measureNumber;
	});

	_.each(voiceGroups, voiceItemGroup => lineGroup.addChildren(voiceItemGroup));

	// now that all the note heads are rendered the rest of the note can be drawn
	if (voices.length === 1) {
		voices[0].renderNoteDecorations(line, measures);
	} else {
		_.each(voices, (voice, voiceNum) => {
			voice.renderNoteDecorations(line, measures, voiceNum);
		});
	}

	return lineGroup;
}

// TODO: will need to be able to handle when overlapping of items require more space. ex. two voice with same note at same time.
function calculateAndSetMeasureLengths (measures, times, noteHeadWidth, shortestDuration) {
	// group items by measure.
	let itemsInMeasure = _.groupBy(times, (item) => item.measure || getMeasureNumber(measures, item.time));

	let measureLengths = _.map(measures, (measure, i) => {
		let measureLength = _.sum(_.map(itemsInMeasure[i], ({items}) => {
			let [markings, voiceItems] = _.partition(items, common.isMarking),
				markingsLength = _.sum(markings.map(marking => marking.group.bounds.width + noteHeadWidth)),
				voiceItemsLength = _.min(_.map(voiceItems, item => {
					return item.group.bounds.width + (noteHeadWidth * placement.getStaffSpace(shortestDuration, item));
				}));
			return markingsLength + voiceItemsLength
		}));
		measureLength += noteHeadWidth;
		measure.length = measureLength;
		return measureLength;
	});

	return measureLengths;
}

Line.prototype.render = function (length) {
	const group = this.group = engraver.drawLine(length);
	group.name = TYPE;
	group.strokeColor = "black";
	return group;
}

Line.prototype.renderVoices = function (voices) {
	let voiceGroups = [];
	_.each(voices, (voice) => {
		let childGroups = voice.renderChildren();
		voiceGroups.push(childGroups);
	});

	return voiceGroups;
}

/*
 * @param lineGroup - the group returned by line.render
 */
Line.prototype.renderMeasures = function (measures, lineGroup, lineLength) {
	let averageMeasureLength = Line.calculateAverageMeasureLength(1, lineLength, measures.length);

	let measureGroups = _.reduce(measures, (groups, measure, i, children) => {
		// let measureLength = measure.measureLength || constants.measure.defaultLength, // + markingLength,
		let measureLength = measure.length || averageMeasureLength,
			previousGroup = _.last(groups),
			leftBarline;

		leftBarline = previousGroup ? previousGroup.children.barline : null;
		let measureGroup = measure.render(lineGroup, leftBarline, measureLength);

		groups.push(measureGroup);
		lineGroup.addChild(measureGroup); // add the measure to the line
		return groups;
	}, []);
}

Line.prototype.note = function (note, measures) {
	let measure = getMeasureByTime(measures, note.time);
	if (measure) {
		measure.note(note);
	}
}

Line.prototype.rest = function (rest, measures) {
	let measure = getMeasureByTime(measures, rest.time);
	if (measure) {
		measure.rest(rest);
	}
}

Line.prototype.voice = function (voice) {
	voice.children.map(note => this.note(note));
}

/*
 * returns the clef, time signature and accidentals at the given time.
 */
Line.prototype.contextAt = function (measures, time) {
	let measure = measures[time.measure];

	if (!measure) return null;

	const getMarking = _.curry((time, marking) => marking.measure <= time.measure && (marking.beat || 0) <= (time.beat || 0));
	const getMarkingAtTime = (markings, type, time) => {
		// Reverse mutates the array. Filtering first give a new array so no need to worry about mutating markings.
		let markingsOfType = _.filter(markings, (marking) => marking.type === type).reverse();
		return _.find(markingsOfType, getMarking(time));
	}

	let clef = getMarkingAtTime(this.markings, constants.type.clef, time) || {},
		timeSig = getMarkingAtTime(this.markings, constants.type.timeSig, time) || {},
		key = getMarkingAtTime(this.markings, constants.type.key, time) || {};

	// return {clef: clef.value, timeSig: timeSig.value, key: key.value};
	return {clef, timeSig, key};
}

/*
 * @param index {number} - the measure to be adjusted
 * @param length {number} - the new length of the measure
 */
Line.prototype.setMeasureLength = function (index, length) {
	var measure = this.children[index],
		oldLength = measure.getLength(),
		lengthDiff = length - oldLength;

	if (lengthDiff) { // no need to do anything if there's no differnece in the length
		measure.setLength(length);
		for (var i = index + 1; i < this.children.length; i++) {
			this.children[i].translate([lengthDiff, 0]);
		}
	}
};

Line.prototype.addToMeasure = function (measure, item) {
	if (this.measures[measure]) { // measure already exists
		this.measures[measure][item.type](item);
	} else {
		throw new Error("Measure " + measure + " doesn't exist.");
	}
};

export default Line;
