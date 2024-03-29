import constants from "../constants";
import {mapDeep, clone} from "../utils/common";
import {drawLine} from "../engraver";
import {getMeasureNumber, getTime, getTimeFromSignatures} from "../utils/timeUtils";
import {isPitched} from "../types";
import _ from "lodash";

const TYPE = constants.type.line;

// Generate an id for a line.
let idNum = 0;
function genID () {
	const id = `line_${idNum}`;
	idNum++;
	return id;
}

/*
 * @param voices - Object mapping voice names to an array describing when they are to be rendered on the line.
 */
function Line ({voices={}}, children=[]) {

	this.id = genID();

	const types = _.groupBy(children, child => child.type);

	this.children = children;

	// Create link from children back to the line they are on.
	this.children.map(child => child.line = this);

	this.timeSignatures = types[constants.type.timeSig];

	// collect all marking arrays into one and sort them by time
	this.markings = _.sortBy(
		_.reduce(
			_.omit(types, constants.type.measure),
			(arr, v) => {
				return arr.concat(v);
			}, []
		),
		(marking) => getTimeFromSignatures(this.timeSignatures, marking).time
		// "measure",
		// (marking) => marking.beat ? marking.beat : 0
	); // if no beat on the marking then default to 0

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

Line.prototype.render = function (length) {
	// FIXME: A line gets rendered multiple times, so not safe to use this.group.
	const group = this.group = drawLine(length);
	// group.name = TYPE;
	group.name = this.id;
	group.strokeColor = "black";
	return group;
};

/*
 * Returns the clef, time signature and accidentals at the given time.
 */
Line.prototype.contextAt = function (time) {
	const getMarking = _.curry((time, marking) => {
		const markingTime = getTimeFromSignatures(this.timeSignatures, marking);
		const populatedTime = getTimeFromSignatures(this.timeSignatures, time);
		return markingTime.time <= populatedTime.time;
	});

	const getMarkingAtTime = (markings, type, time) => {
		// Reverse mutates the array. Filtering first give a new array so no need to worry about mutating markings.
		let markingsOfType = _.filter(markings, (marking) => marking.type === type).reverse();
		return _.find(markingsOfType, getMarking(time));
	};

	const clef = getMarkingAtTime(this.markings, constants.type.clef, time) || {};
	const timeSig = getMarkingAtTime(this.markings, constants.type.timeSig, time) || {};
	const key = getMarkingAtTime(this.markings, constants.type.key, time) || {};

	return {clef: clone(clef), timeSig: clone(timeSig), key: clone(key)};
};

export default Line;
