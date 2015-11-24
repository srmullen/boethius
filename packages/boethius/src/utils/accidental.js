import _ from "lodash";
import {parsePitch} from "./note";

/*
 * @param {name, accidental, octave} - parsed representation of the pitches accidental.
 * @param accidentals - list of parsed accidentals already in the context.
 * @return - String representation of accidental that needs to be rendered.
 */
function getAccidental ({name, accidental, octave}, accidentals) {
	let returnAccidental;

	// get the accidentals on the diatonic pitch.
	let affects = _.filter(accidentals, (a) => a.name === name && a.octave === octave);

	if (affects.length) {
		let realizedAccidental = affects[0].accidental;
		if (realizedAccidental === accidental) {
			returnAccidental = "";
		} else if (realizedAccidental === "n" && accidental === "") {
			returnAccidental = "";
		} else if (realizedAccidental && accidental === "") {
			returnAccidental = "n";
		} else {
			returnAccidental = accidental;
		}
	} else {
		returnAccidental = accidental;
	}

	return returnAccidental;
}

/*
 * @param ...contexts - variable number of accidental contexts.
 * @return accidental context created as a combination of contexts with rightmost contexts taking precedence.
 */
function createAccidentalContext (...contexts) {

}

/*
 * @param times - array describing the rendering context as returned from getTimeContexts.
 * @return String[] - Array with the notes for which accidentals already exist in the measure.
 */
function getAccidentalContexts (times) {
	let accidentals = _.reduce(times, (acc, {time, items, context}) => {
		let {note: notes} = _.groupBy(items, item => item.type),
			previousAccidentals = _.last(acc);

        return createAccidentalContext();
	}, []);

	return accidentals;
}

export {
    getAccidental,
    getAccidentalContexts
}
