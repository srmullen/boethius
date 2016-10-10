import constants from "../constants";
import {mapDeep} from "../utils/common";
import {drawLine} from "../engraver";
import {getMeasureNumber} from "../utils/timeUtils";
import {createMeasures} from "../utils/measure";
import * as placement from "../utils/placement";
import * as lineUtils from "../utils/line";
import {getAccidentalContexts} from "../utils/accidental";
import {isNote, isChord, isPitched} from "../types";
import Note from "./Note";
import Chord from "./Chord";
import Voice from "./Voice";
import {getCenterLineValue} from "./Clef";
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
};

function renderLedgerLines (items, centerLine) {
	const pitched = _.filter(items, isPitched);
    pitched.map(note => note.drawLegerLines(centerLine, Scored.config.lineSpacing));
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
		return cursorFn(b, cursor, ctx);
	}, Scored.config.note.head.width);
}

Line.prototype.render = function (length) {
	const group = drawLine(length);
	group.name = TYPE;
	group.strokeColor = "black";
	return group;
};

// FIXME: doesn't need to be on the prototype.
Line.prototype.renderTime = function ({items, context}) {
	return _.map(items, item => renderItem(item, context));
};

Line.prototype.renderItems = function (times) {
	return _.reduce(times, (acc, time) => {
		const groups = this.renderTime(time);
		return acc.concat(groups);
	}, []);
};

/*
 * Returns the clef, time signature and accidentals at the given time.
 */
Line.prototype.contextAt = function (time) {
	const getMarking = _.curry((time, marking) => marking.measure <= time.measure && (marking.beat || 0) <= (time.beat || 0));
	const getMarkingAtTime = (markings, type, time) => {
		// Reverse mutates the array. Filtering first give a new array so no need to worry about mutating markings.
		let markingsOfType = _.filter(markings, (marking) => marking.type === type).reverse();
		return _.find(markingsOfType, getMarking(time));
	};

	const clef = getMarkingAtTime(this.markings, constants.type.clef, time) || {};
	const timeSig = getMarkingAtTime(this.markings, constants.type.timeSig, time) || {};
	const key = getMarkingAtTime(this.markings, constants.type.key, time) || {};

	return {clef, timeSig, key};
};

function renderItem (item, context) {
	if (isNote(item)) {
		return Line.renderNote(item, context);
	} else if (isChord(item)) {
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
	Note.renderDots(note, context.clef);
	return group;
};

/*
 * @param Chord - Chord
 * @param context - {key, timeSig, time, clef, accidentals}
 * @return Paper.Group
 */
Line.renderChord = function (chord, context) {
	let group = chord.render(context);
	Chord.renderAccidentals(chord, context);
	return group;
};

export default Line;
