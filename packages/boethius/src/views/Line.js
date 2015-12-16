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

/*
 * @param voices - Object mapping voice names to an array describing when they are to be rendered on the line.
 */
function Line ({voices={}}, children=[]) {

	const types = _.groupBy(children, child => child.type);

	this.children = children;

	// collect all marking arrays into one and sort them by time
	this.markings = _.sortByAll(_.reduce(_.omit(types, constants.type.measure), (arr, v) => {
		return arr.concat(v);
	}, []), "measure", (marking) => marking.beat ? marking.beat : 0); // if no beat on the marking then default to 0

	this.voices = voices;
}

Line.prototype.addMarkings = function (markings) {
	// FIXME: overwrites markings already on the line.
	this.markings = _.sortBy(this.markings.concat(markings), m => m.measure);
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
		shortestDuration = 0.125; // need function to calculate this.

	// group and sort voice items by time.
	let times = lineUtils.getTimeContexts(line, measures, _.reduce(voices, (acc, voice) => {
		return acc.concat(voice.children);
	}, []));

	let accidentals = getAccidentalContexts(times);
	// add accidentals to times
	_.each(times, (time, i) => time.context.accidentals = accidentals[i]);

	// render all items
	line.renderItems(times);

	// calculating measure lengths
	const measureLengths = lineUtils.calculateMeasureLengths(measures, times, noteHeadWidth, shortestDuration);

	// render measures.
	const measureGroups = line.renderMeasures(measures, measureLengths, lineGroup, length);

	lineGroup.addChildren(measureGroups);

	// place all items
	const b = lineUtils.b(lineGroup);
	_.reduce(times, (cursor, ctx, i) => {
		const previousMeasureNumber = times[i-1] ? times[i-1].time.measure : 0;
		// update cursor if it's a new measure
		if (ctx.time.measure !== previousMeasureNumber) {
			let measure = measures[ctx.time.measure];
			cursor = placement.calculateCursor(measure);
		}

		return lineUtils.renderTimeContext(b, cursor, ctx);
	}, noteHeadWidth);

	_.each(voices, voice => {
		voice.renderDecorations(line, measures);
	});

	return lineGroup;
}

Line.prototype.render = function (length) {
	const group = this.group = engraver.drawLine(length);
	group.name = TYPE;
	group.strokeColor = "black";
	return group;
}

Line.prototype.renderItems = function (times) {
	_.each(times, ({time, items, context}) => {
		let groups = _.map(items, item => renderItem(item, context));
		this.group.addChildren(groups);
	});
}

/*
 * @param lineGroup - the group returned by line.render
 */
Line.prototype.renderMeasures = function (measures, lengths, lineGroup, lineLength) {
	let averageMeasureLength = Line.calculateAverageMeasureLength(1, lineLength, measures.length);

	let measureGroups = _.reduce(measures, (groups, measure, i, children) => {
		let measureLength = lengths[i] || averageMeasureLength,
			previousGroup = _.last(groups),
			leftBarline;

		leftBarline = previousGroup ? previousGroup.children.barline : null;
		let measureGroup = measure.render([lineGroup], leftBarline, measureLength);

		groups.push(measureGroup);
		return groups;
	}, []);
	return measureGroups;
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
