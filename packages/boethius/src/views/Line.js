import constants from "../constants";
import engraver from "../engraver";
import Measure from "./Measure";
import {getMeasureNumber, getMeasureByTime} from "../utils/timeUtils";
import * as placement from "../utils/placement";
import {isMarking, concat} from "../utils/common";
import * as lineUtils from "../utils/line";
import {getAccidentalContexts} from "../utils/accidental";
import {isNote, isChord} from "../types";
import Note from "./Note";
import Rest from "./Rest";
import Chord from "./Chord";
import _ from "lodash";

const TYPE = constants.type.line;

function Line ({voices=[]}, children=[]) {

	const types = _.groupBy(children, child => child.type);

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
		// create the measures
		measures = Measure.createMeasures(numMeasures, line.children);

	// position voice children
	const noteHeadWidth = Scored.config.note.head.width,
		b = lineUtils.b(lineGroup),
		shortestDuration = 0.125; // need function to calculate this.

	// group and sort voice items by time.
	let times = lineUtils.getTimeContexts(line, measures, voices);

	let accidentals = getAccidentalContexts(times);
	// add accidentals to times
	_.each(times, (time, i) => time.context.accidentals = accidentals[i]);

	// render all items
	line.renderItems(times);

	// calculating measure lengths
	calculateAndSetMeasureLengths(measures, times, noteHeadWidth, shortestDuration);

	// render measures.
	let measureGroups = line.renderMeasures(measures, lineGroup, length);

	// place all items
	let cursor = noteHeadWidth,
		previousMeasureNumber = 0;
	_.each(times, ({time, items, context}) => {
		let leftBarline = measures[time.measure].barlines[0];
		let {
			clef: clefs,
			key: keys,
			timeSig: timeSigs,
			note: notes,
			rest: rests,
			chord: chords
		} = _.groupBy(items, item => item.type);

		// update cursor if its a new measure.
		if (time.measure !== previousMeasureNumber) {
			let measure = measures[time.measure];
			cursor = placement.calculateCursor(measure);
		}

		let placeMarking = marking => {
			marking.group.translate(b.add([0, placement.getYOffset(marking)]));
			placement.placeAt(cursor, marking);
			// since keys of C and a have no children calculateCursor return undefined.
			cursor = placement.calculateCursor(marking) || cursor;
		};

		// place the markings
		_.each(clefs, placeMarking);
		_.each(keys, placeMarking);
		_.each(timeSigs, placeMarking);

		let possibleNextPositions = [];

		const pitchedItems = _.compact([].concat(notes, chords));

		if (pitchedItems.length) {
			// get widest note. that will be placed first.
			let widestItem = _.max(pitchedItems, item => item.group.bounds.width),
				placeY = (item) => {
					let note = isNote(item) ? item : item.children[0];
					let yPos = placement.calculateNoteYpos(note, Scored.config.lineSpacing/2, placement.getClefBase(context.clef.value));
					item.group.translate(b.add([0, yPos]));
				},
				placeX = (item) => {
					placement.placeAt(cursor, item);
				},
				place = (item) => {
					placeY(item);
					placeX(item);
					return placement.calculateCursor(item);
				};


			possibleNextPositions = possibleNextPositions.concat(place(widestItem));

			_.remove(pitchedItems, item => item === widestItem); // mutation of notes array

			_.each(pitchedItems, placeY);

			const alignToNoteHead = isNote(widestItem) ? widestItem.noteHead : widestItem.children[0].noteHead;
			placement.alignNoteHeads(alignToNoteHead.bounds.center.x, notes);

			possibleNextPositions = possibleNextPositions.concat(_.map(pitchedItems, placement.calculateCursor));
		}

		possibleNextPositions = possibleNextPositions.concat(_.map(rests, rest => {
			let pos = placement.getYOffset(rest.group);

			rest.group.translate(b.add(0, pos));
			placement.placeAt(cursor, rest);

			return placement.calculateCursor(rest);
		}));

		// next time is at smallest distance
		cursor = _.min(possibleNextPositions);

		previousMeasureNumber = time.measure;
	});

	_.each(voices, voice => {
		voice.renderNoteDecorations(line, measures);
	});

	return lineGroup;
}

// TODO: will need to be able to handle when overlapping of items require more space. ex. two voice with same note at same time.
function calculateAndSetMeasureLengths (measures, times, noteHeadWidth, shortestDuration) {
	// group items by measure.
	let itemsInMeasure = _.groupBy(times, (item) => {
		return item.time.measure;
	});

	let measureLengths = _.map(measures, (measure, i) => {
		let measureLength = _.sum(_.map(itemsInMeasure[i], ({items}) => {
			let [markings, voiceItems] = _.partition(items, isMarking),
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

Line.prototype.renderItems = function (times) {
	_.each(times, ({time, items, accidentals, context}) => {
		// let groups = _.map(items, item => renderItem(item, _.assign({}, {accidentals}, context)));
		let groups = _.map(items, item => renderItem(item, context));
		this.group.addChildren(groups);
	});
}

/*
 * @param lineGroup - the group returned by line.render
 */
Line.prototype.renderMeasures = function (measures, lineGroup, lineLength) {
	let averageMeasureLength = Line.calculateAverageMeasureLength(1, lineLength, measures.length);

	let measureGroups = _.reduce(measures, (groups, measure, i, children) => {
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

function renderItem (item, context) {
	if (item.type === constants.type.note) {
		return Line.renderNote(item, context);
	} else if (item.type === constants.type.chord) {
		return Line.renderChord(item, context);
	} else {
		return item.render(context);
	}
}

/*
 * @param note - Note
 * @param context - {key, timeSig, time, clef, accidentals}
 * @return paper.Group
 */
Line.renderNote = function (note, context) {
	let group = note.render(context);
	Note.renderAccidental(note, context.accidentals, context.key);
	return group;
}

/*
 * @param Chord - Chord
 * @param context - {key, timeSig, time, clef, accidentals}
 * @return Paper.Group
 */
Line.renderChord = function (chord, context) {
	let group = chord.render();
	Chord.renderAccidentals(chord, context);
	// Chord.renderStem(chord);
	return group;
}

export default Line;
