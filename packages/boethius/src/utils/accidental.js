import _ from "lodash";
import {parsePitch, hasPitch} from "./note";
import {partitionBy} from "./common";

/*
 * Converts accidental representations to a consistent representation.
 * @param accidental - String.
 * @return String
 */
function normalize (accidental) {
	if (accidental === "") {
		return "n";
	}

	if (accidental === "##") {
		return "x";
	}

	return accidental;
}
/*
 * Function for comparison of accidentals with different representation formats. ie. "n" === "".
 * @param a1 - accidental String.
 * @param a2 - accidental String.
 * @return true if accidentals are equal false otherwise.
 */
function equal (a1, a2) {
	return normalize(a1) === normalize(a2);
}

/*
 * @param {name, accidental, octave} - parsed representation of the pitches accidental.
 * @param accidentals - list of parsed accidentals already in the context.
 * @param key - Key object. If no key is passed the hasPitch function treats it as C major.
 * @return - String representation of accidental that needs to be rendered. or undefined if no accidental to be rendered.
 */
function getAccidental ({name, accidental, octave}, accidentals, key) {
	// get the accidentals on the diatonic pitch.
	let [affect] = _.filter(accidentals, (a) => a.name === name && a.octave === octave);

	// Cases
	// - pitch exists in key.
	//		- no affects match = return undefined
	//		- affects match
	//			- affects.accidental === pitch.accidental = return undefined
	//			- affects.accidental !== pitch.accidental = return pitch.accidental
	// - pitch doesn't exist in key.
	//		- no affects match = return pitch.accidental.
	//		- affects match
	//			- affect.accidental === pitch.accidental = return undefined
	//			- affect.accidental !== pitch.accidental = return pitch.accidental.

	if (hasPitch(key, {name, accidental, octave})) {
		if (affect) {
			if (equal(affect.accidental, accidental)) {
				return;
			} else {
				return normalize(accidental);
			}
		} else {
			return;
		}
	} else {
		if (affect) {
			if (equal(affect.accidental, accidental)) {
				return;
			} else {
				return normalize(accidental);
			}
		} else {
			return normalize(accidental);
		}
	}
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
	return _.union(
		_.map(_.difference(_.union(diatonics1, diatonics2), _.intersection(diatonics1, diatonics2)),
			(diatonic) => {
				let accidental = _.findWhere(c2, diatonic);
				if (accidental) {
					return accidental;
				} else {
					return _.findWhere(c1, diatonic);
				}
			}),
		c2);
}

function createAccidentalContexts (times) {
	const contexts = new Array(times.length);
	contexts[0] = [];
	for (let i = 0; i < times.length - 1; i++) {
		let {note: notes=[], chord: chords=[]} = _.groupBy(times[i].items, item => item.type);
		let chordNotes = _.reduce(chords, (acc, chord) => acc.concat(chord.children), []);
		let pitches = _.map(notes.concat(chordNotes), ({pitch}) => parsePitch(pitch));
		contexts[i + 1] = createAccidentalContext(contexts[i], pitches);
	}
	return contexts;
}

/*
 * @param times - array describing the rendering context as returned from getTimeContexts.
 * @return String[] - Array with the notes for which accidentals already exist in the measure.
 */
function getAccidentalContexts (times) {
	let measures = partitionBy(times, ({time}) => time.measure);
	return _.flatten(_.map(measures, createAccidentalContexts));
}

export {
    getAccidental,
	createAccidentalContext,
    getAccidentalContexts
};
