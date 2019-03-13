import constants from "../constants";
import {mapDeep} from "../utils/common";
import {drawLine} from "../engraver";
import {getMeasureNumber} from "../utils/timeUtils";
import {isPitched} from "../types";
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

Line.prototype.render = function (length) {
	const group = drawLine(length);
	group.name = TYPE;
	group.strokeColor = "black";
	return group;
};

/*
 * Returns the clef, time signature and accidentals at the given time.
 */
Line.prototype.contextAt = function (time) {
	// FIXME: Marking should have time property and not just measure and beat properties.
	const getMarking = _.curry((time, marking) => {
		if (marking.measure < time.measure) {
			return true;
		} else if (marking.measure === time.measure) {
			return (marking.beat || 0) <= (time.beat || 0);
		} else {
			return false;
		}
	});
	// const getMarking = _.curry((time, marking) => marking.time <= time.time);
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

export default Line;
