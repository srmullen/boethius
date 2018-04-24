import paper from "paper";
import {partitionBy} from "../utils/common";
import {isNote, isChord} from "../types";
import teoria from "teoria";
import _ from "lodash";

// for use in getSteps function
const noteValues = {c: 0, d: 1, e: 2, f: 3, g: 4, a: 5, b: 6};

/*
 * @param n1 - String representing the value of a note.
 * @param n2 - String representing the value of a note.
 * @return - Number of visible steps on a staff as the difference between n1 and n2.
 */
function getSteps (n1, n2) {
	let note1 = teoria.note(n1),
		note2 = teoria.note(n2);

	let octaveDiff = note2.octave() - note1.octave(),
		noteDiff = noteValues[note2.name()] - noteValues[note1.name()];

	return (octaveDiff * 7) + noteDiff;
}

/*
 * @param note - Note to find the stem length for.
 * @param centerLineValue - String representing note value at the center line. (optional)
 * @param stemDirection - String representation of the stem direction. (optional)
 * @return - the length of the stem.
 */
function getStemLength (note, centerLineValue, stemDirection) {
	const octaveHeight = Scored.config.lineSpacing * 3.5;

	if (!centerLineValue) return octaveHeight;

	const steps = getSteps(centerLineValue, note.pitch);

	// handle stem directions for notes that don't have default direction
	if (stemDirection === "up" && steps >= 0) return octaveHeight;
	if (stemDirection === "down" && steps < 0) return octaveHeight;

	const noteDistance = steps * Scored.config.stepSpacing;

	return Math.max(octaveHeight, Math.abs(noteDistance));
}

function defaultStemPoint (note, stemDirection, stemLength) {
	let frm, to;
	if (stemDirection === "up") {
		frm = note.noteHead.bounds.rightCenter.add(0, Scored.config.note.head.yOffset);
		to = frm.subtract([0, stemLength]);
	} else {
		frm = note.noteHead.bounds.leftCenter.add(0, Scored.config.note.head.yOffset);
		to = frm.add([0, stemLength]);
	}
	return to;
}

/*
 * @param items Note[]
 * @param centerLineValue - String representing center line note value
 * @return Number
 */
function sumSteps (notes, centerLineValue) {
	return _.sum(notes.map(note => getSteps(centerLineValue, note.pitch)));
}

/*
 * @param items <Note, Chord>[]
 * @param centerLineValue - String representing center line note value
 */
function getAverageStemDirection (items, centerLineValue) {
	let averageDirection = _.sum(items.map(item => {
		if (isNote(item)) {
			return getSteps(centerLineValue, item.pitch);
		} else if (isChord(item)) {
			return sumSteps(item.children, centerLineValue);
		} else {
			return 0;
		}
	})) < 0 ? "up" : "down";

	return items.map(() => averageDirection);
}

// function slur (items) {
// 	const firstItem = items[0];
// 	const lastItem = _.last(items);
// 	const firstStem = firstItem.getStemDirection();
// 	const begin = getSlurPoint(firstItem, null, firstStem);
// 	const handle = getSlurHandle(firstStem);
// 	const end = getSlurPoint(lastItem, handle);
// 		// center = begin.add(end.subtract(begin).divide(2)).add([0, 4]);
//
// 	const path = new paper.Path({
// 		segments: [begin, end],
// 		strokeColor: "black",
// 		strokeWidth: 2
// 	});
//
// 	path.segments[0].handleOut = handle;
// 	path.segments[1].handleIn = handle;
//
// 	return path;
// }

function tie (begin, end, handle) {

	const path = new paper.Path({
		segments: [begin, end],
		strokeColor: "black",
		strokeWidth: 2
	});

	path.segments[0].handleOut = handle;
	path.segments[1].handleIn = handle;

	return path;
}

const arrayToString = (arr) => _.reduce(arr, (acc, c) => acc + c, "");

/*
 * @param pitch - String representation of note pitch.
 * @return - {name, accidental, octave}
 */
const parsePitch = _.memoize((pitch) => {
	let [nameAndAccidental, octave] = partitionBy(pitch, (c) => !!_.isNaN(Number.parseInt(c)));

	let name = _.first(nameAndAccidental),
		accidental = arrayToString(nameAndAccidental.slice(1));

	return Object.freeze({name, accidental, octave: arrayToString(octave)});
});

/*
 * @param key - Key object.
 * @param pitch - parsed pitch.
 */
function hasPitch(key, {name, accidental}) {
	if (!key) {
		return false;
	}
	let pitches = _.map(key.getPitches(), parsePitch);
	return !!_.find(pitches, {name, accidental});
}

export {
	getStemLength,
	defaultStemPoint,
	tie,
	getSteps,
	getAverageStemDirection,
	parsePitch,
	hasPitch
};
