import constants from "../constants";
import {drawLine} from "../engraver";
// import Measure from "./Measure";
import {createMeasures} from "../utils/measure";
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
 * @param voices - voices to render on the line.
 * @param startMeasure - the index of the measure is measure at which to start rendering.
 * @param numMeasures - the number of measures to render on the line.
 */
Line.render = function (line, {length, measures, voices=[], startMeasure=0, numMeasures=1}) {
	// Steps for rendering a Line.
	// 1. Find the minimum width of each measure given the items that need to be renderred in it.
	// 2. Warn if there's not enough room on the line.
	// 3. Stretch the measures to accomodate the line length.
	// 4. Place items with the same stretch factor.

	// create the measures if they wern't passed in
	measures = measures || createMeasures(numMeasures, line.children);

	const endMeasure = startMeasure + numMeasures;

	// position voice children
	const noteHeadWidth = Scored.config.note.head.width,
		shortestDuration = 0.125; // need function to calculate this.

	// group and sort voice items by time.
	const times = lineUtils.getTimeContexts(line, measures, _.reduce(voices, (acc, voice) => {
		return acc.concat(voice.children);
	}, []));
	// const times = voices.map(voice => lineUtils.getTimeContexts(line, measures, voice.children));

	// get the times that are to be rendered on the line.
	const timesToRender = _.filter(times, (time) => {
		return time.time.measure >= startMeasure && time.time.measure < endMeasure
	});
	const measuresToRender = _.slice(measures, startMeasure, endMeasure);

	let accidentals = getAccidentalContexts(timesToRender);
	// add accidentals to times
	_.each(timesToRender, (time, i) => time.context.accidentals = accidentals[i]);

	// render the items. needed for calculating the measureLengths
	const lineItems = line.renderItems(timesToRender);

	// calculating minimum measure lengths
	const minMeasureLengths = lineUtils.calculateMeasureLengths(measuresToRender, timesToRender, noteHeadWidth, shortestDuration);

	const minLineLength = _.sum(minMeasureLengths);

	let lineGroup, noteScale, cursorFn;

	if (!length) { // no scaling needed
		lineGroup = line.render(minLineLength);

		const measureGroups = line.renderMeasures(measuresToRender, minMeasureLengths, lineGroup, length);

		lineGroup.addChildren(measureGroups);

		cursorFn = lineUtils.renderTimeContext;

	} else { // scaling needed
		const timeLengths = _.map(timesToRender, ({items}) => placement.calculateTimeLength(items, shortestDuration));

		const totalMarkingLength = _.sum(timeLengths, ([markingLength,]) => markingLength);

		const measureScale = length / minLineLength; // TODO: Should each measure have it's own scale depending on if it has markings?

		noteScale = (length - totalMarkingLength) / (minLineLength - totalMarkingLength);

		lineGroup = line.render(length);

		const measureGroups = line.renderMeasures(measuresToRender, _.map(minMeasureLengths, length => length * measureScale), lineGroup, length);

		lineGroup.addChildren(measureGroups);

		cursorFn = (b, cursor, ctx) => {
			return placement.scaleCursor(noteScale, cursor, lineUtils.renderTimeContext(b, cursor, ctx));
		}
	}

	// add items to the line
	lineGroup.addChildren(lineItems);

	// place all items
	const b = lineUtils.b(lineGroup);
	placeTimes(timesToRender, measures, b, cursorFn);

	_.each(voices, voice => {
		const children = voice.renderDecorations(line, b, measuresToRender);
		lineGroup.addChildren(children);
	});

	return lineGroup;
}

/*
 * @param timesToRender times[] - Array of time contexts to place on the line.
 * @param curosrFn - function for updating the cursor.
 */
function placeTimes (timesToRender, measures, b, cursorFn) {
	_.reduce(timesToRender, (cursor, ctx, i) => {
		const previousMeasureNumber = timesToRender[i-1] ? timesToRender[i-1].time.measure : 0;
		// update cursor if it's a new measure
		if (ctx.time.measure !== previousMeasureNumber) {
			let measure = measures[ctx.time.measure];
			cursor = placement.calculateCursor(measure);
		}

		// place markings
		cursor = lineUtils.positionMarkings(b, cursor, ctx);

		// renderTimeContext returns the next cursor position.
		// return placement.scaleCursor(noteScale, cursor, lineUtils.renderTimeContext(b, cursor, ctx));
		// return lineUtils.renderTimeContext(b, cursor, ctx);
		return cursorFn(b, cursor, ctx);
	}, Scored.config.note.head.width);
}

Line.prototype.render = function (length) {
	const group = drawLine(length);
	group.name = TYPE;
	group.strokeColor = "black";
	return group;
}

Line.prototype.renderItems = function (times) {
	return _.reduce(times, (acc, {time, items, context}) => {
		let groups = _.map(items, item => renderItem(item, context));
		return acc.concat(groups);
	}, []);
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
 * Returns the clef, time signature and accidentals at the given time.
 * Currently requires that all measures starting from time 0 are given.
 */
Line.prototype.contextAt = function (measures, time) {
	let measure = measures[time.measure];
	// const measure = _.find(measures, measure => measure.value = time.measure);

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
	return group;
}

export default Line;
