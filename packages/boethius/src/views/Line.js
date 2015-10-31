import constants from "../constants";
import engraver from "../engraver";
import Measure from "./Measure";
import * as timeUtils from "../utils/timeUtils";
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
	let lineGroup = line.render(length), // draw the line
		voiceGroups = line.renderVoices(voices),
		// create the measures
		measures = Measure.createMeasures(numMeasures, this.children),
		measureGroups = line.renderMeasures(measures, lineGroup, length);

	// position voice children
	const noteHeadWidth = Scored.config.note.head.width,
		b = lineUtils.b(lineGroup);

	_.each(voices, (voice, i) => voice.children.map((item, j) => {
		let pos = placement.getYOffset(item.group, b),
			measureNumber = Measure.getMeasureNumber(measures, item.time), //get the measure the item belongs to
			context = line.contextAt({measure: measureNumber}),
			yPos = item.type === "note" ?
				placement.calculateNoteYpos(item, Scored.config.lineSpacing/2, placement.getClefBase(context.clef)) : 0;
		item.group.translate(pos.add([noteHeadWidth * j, yPos]));
	}));

	_.each(voiceGroups, voiceItemGroup => lineGroup.addChildren(voiceItemGroup));

	return lineGroup;
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
	let measureGroups = _.reduce(measures, (groups, measure, i, children) => {
		// let measureLength = measure.measureLength || constants.measure.defaultLength, // + markingLength,
		let measureLength = Line.calculateAverageMeasureLength(1, lineLength, measures.length),
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

Line.prototype.note = function (note, measures) {
	let measure = Measure.getByTime(measures, note.time);
	if (measure) {
		measure.note(note);
	}
}

Line.prototype.rest = function (rest, measures) {
	let measure = Measure.getByTime(measures, rest.time);
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

	let clef = getMarkingAtTime(this.markings, constants.type.clef, time) || {},
		timeSig = getMarkingAtTime(this.markings, constants.type.timeSig, time) || {},
		key = getMarkingAtTime(this.markings, constants.type.key, time) || {};

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
