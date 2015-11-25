import _ from "lodash";
import {parsePitch} from "./note";
import {concat} from "./common";

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

const dropAccidental = _.memoize(parsedPitch => {
	const {name, octave} = parsedPitch;
	return Object.freeze({name, octave});
}, ({name, octave}) => "" + name + octave);

/*
 * @param c1 - first context, lower precedence.
 * @param c2 - second context, higher precedence.
 * @return - accidental context. combination of c1 and c2. unordered.
 */
function createAccidentalContext (c1, c2) {
	const diatonics1 = _.map(c1, dropAccidental),
		diatonics2 = _.map(c2, dropAccidental);

	// 1. union of diatonics1 diatonics2 - intersection of diatonics1 diatonics2
	return _.union(_.map(_.difference(_.union(diatonics1, diatonics2),
				 	_.intersection(diatonics1, diatonics2)),
			 (diatonic) => {
				 let accidental = _.findWhere(c2, diatonic);
				 if (accidental) {
					return accidental;
				 } else {
					return _.findWhere(c1, diatonic);
				 }
			 }), c2);

}

/*
 * @param times - array describing the rendering context as returned from getTimeContexts.
 * @return String[] - Array with the notes for which accidentals already exist in the measure.
 */
function getAccidentalContexts (times) {
	let accidentals = _.reduce(times, (acc, {time, items, context}) => {
		let {note: notes} = _.groupBy(items, item => item.type),
			previousAccidentals = _.last(acc);

        return concat(acc, createAccidentalContext(previousAccidentals, _.map(notes, ({pitch}) => parsePitch(pitch))));
	}, [[]]);

	return accidentals;
}

export {
    getAccidental,
	createAccidentalContext,
    getAccidentalContexts
}
