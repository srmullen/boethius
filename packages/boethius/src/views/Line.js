import constants from "../constants";
import engraver from "../engraver";
import Measure from "./Measure";
import * as timeUtils from "../utils/timeUtils";
import * as placement from "../utils/placement";
import * as common from "../utils/common";
import noteUtils from "../utils/note";
import line from "../utils/line";
import Note from "../views/Note";
import Rest from "../views/Rest";
import measureUtils from "../utils/measure";
import _ from "lodash";

const TYPE = constants.type.line;

function parseChildren (children, numMeasures) {
	let measures = new Array(numMeasures);

	// get the Measures from children and add them to the measures array
	let [explicitMeasures, markings] = _.partition(_.filter(children, c => !!c), (child) => child.type === constants.type.measure),
		// measureMarkings = _.groupBy(markings, marking => marking.context.measure || 0);
		measureMarkings = _.groupBy(markings, marking => marking.measure || 0);

	{ // Put each measure in the right position in the measures array.
	  // If a measure does not have an index property put it in the next available location.
		let cur = 0;
		_.each(explicitMeasures, (measure) => {
			if (_.isNumber(measure.index)) {
				measures[measure.index] = measure;
				cur = measure.index + 1;
			} else {
				measures[cur] = measure;
				cur++;
			}
		});
	}

	_.each(measures, (measure, i) => {
		var previousMeasure = measures[i-1],
			startsAt = previousMeasure ? previousMeasure.startsAt + timeUtils.getMeasureDuration(previousMeasure) : 0;

		if (!measure) {
			measure = new Measure(_.extend({}, {startsAt: startsAt}), measureMarkings[i]);
		} else {
			measure.startsAt = startsAt;
		}

		measures[i] = measure;
	});

	return measures;
}

function Line ({measures=1, voices=[]}, children=[]) {

	const types = _.groupBy(children, child => child.type);

	this.children = parseChildren(children, measures);

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
Line.render = function (line, length, voices) {
	let lineGroup = line.render(length),
		// measureGroups = line.renderMeasures(lineGroup, length);
		voiceGroups = line.renderVoices(voices);

	_.each(voiceGroups, voiceItemGroup => lineGroup.addChildren(voiceItemGroup));

	return lineGroup;
}

Line.prototype.render = function (length) {

	const group = engraver.drawLine(length);
	group.name = TYPE;
	group.strokeColor = "black";
	return group;
}

Line.prototype.renderVoices = function (voices) {
	const noteHeadWidth = Scored.config.note.head.width;
	let voiceGroups = [];
	_.each(voices, (voice) => {
		let childGroups = voice.renderChildren();
		voiceGroups.push(childGroups);
		childGroups.map((group, i) => group.translate([noteHeadWidth * i, 0]));
	});

	return voiceGroups;
}

/*
 * @param lineGroup - the group returned by line.render
 */
Line.prototype.renderMeasures = function (lineGroup, lineLength) {
	let measureGroups = _.reduce(this.children, (groups, measure, i, children) => {
		// let measureLength = measure.measureLength || constants.measure.defaultLength, // + markingLength,
		let measureLength = Line.calculateAverageMeasureLength(1, lineLength, this.children.length),
			previousGroup = _.last(groups),
			leftBarline;

		leftBarline = previousGroup ? previousGroup.children.barline : null; //{position: line.b(staves[stave])};
		let measureGroup = measure.render(lineGroup, leftBarline, measureLength);

		let childGroups = measure.renderChildren(lineGroup, measure.barlines[0]);

		lineGroup.addChildren(childGroups);

		// Measure.addGroupEvents(measureGroup);
		groups.push(measureGroup);
		lineGroup.addChild(measureGroup); // add the measure to the line
		return groups;
	}, []);
}

Line.prototype.note = function (note) {
	let measure = _.find(this.children, (measure) => {
		let measureEndsAt = measure.startsAt + timeUtils.getMeasureDuration(measure);
		return note.time >= measure.startsAt && note.time < measureEndsAt;
	});
	if (measure) {
		measure.note(note);
	}
}

Line.prototype.rest = function (rest) {
	let measure = _.find(this.children, (measure) => {
		let measureEndsAt = measure.startsAt + timeUtils.getMeasureDuration(measure);
		return note.time >= measure.startsAt && note.time < measureEndsAt;
	});
	if (measure) {
		measure.rest(rest);
	}
}

Line.prototype.voice = function (voice) {
	voice.children.map(note => this.note(note));
}

// Line.prototype.note = function (context, xPos) {
// 	var noteView = new Note(context),
// 		measure = this.at().measure,
// 		yPos = placement.calculateNoteYpos(noteView, Scored.config.lineSpacing/2, placement.getClefBase(this.context.clef)),
// 		position = this.measures[measure].barlines[0].position.add(xPos, yPos);
//
// 	this.addToMeasure(measure, noteView);
// 	noteView.render(position);
//
// 	if (noteView.note.duration.value > 1) {
// 		let stemPoint = noteUtils.defaultStemPoint(noteView, noteUtils.getStemLength(noteView), "up");
// 		noteView.drawStem(stemPoint, "up");
// 	}
//
// 	this.incrementTime(noteView.context.duration, this.context.timeSig);
//
// 	this.group.addChild(noteView.group);
//
// 	return noteView;
// };
//
// Line.prototype.rest = function (context, cursor) {
// 	var rest = new Rest(context),
// 		measure = this.at().measure;
//
// 	this.addToMeasure(measure, rest);
// 	var position = this.measures[measure].barlines[0].position.add(cursor, 0);
// 	rest.render(position);
//
// 	this.incrementTime(rest.context.duration, this.context.timeSig);
//
// 	this.group.addChild(rest.group);
//
// 	return rest;
// };

/*
 * returns the clef, time signature and accidentals at the given time.
 */
Line.prototype.contextAt = function (time) {
	let measure = this.children[time.measure];

	if (!measure) return null;

	// let [beats,] = timeUtils.sigToNums(measure.timeSig);

	const getMarking = _.curry((time, marking) => marking.measure <= time.measure && (marking.beat || 0) <= (time.beat || 0));
	const getMarkingAtTime = (markings, type, time) => {
		// Reverse mutates the array. Filtering first give a new array so no need to worry about mutating markings.
		let markingsOfType = _.filter(markings, (marking) => marking.type === type).reverse();
		return _.find(markingsOfType, getMarking(time));
	}

	let clef = getMarkingAtTime(this.markings, constants.type.clef, time),
		timeSig = getMarkingAtTime(this.markings, constants.type.timeSig, time),
		key = getMarkingAtTime(this.markings, constants.type.key, time);

	return {clef: clef.value, timeSig: timeSig.value, key: key.value};
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
