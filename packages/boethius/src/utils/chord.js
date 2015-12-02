import _ from "lodash";

import {isEven} from "./common";
import * as noteUtils from "./note";

const UP = "up", DOWN = "down";

// /*
//  * @param chord - Chord for which to get the stem direction.
//  * @param centerLineValue - String note pitch of center line.
//  * @return String
//  */
// function getStemDirection (chord, centerLineValue) {
//     if (chord.stemDirection) {
// 		return chord.stemDirection;
// 	} else if (centerLineValue) {
//         if (chord.children.length === 1) {
//             return getSteps(centerLineValue, chord.children[0].pitch) < 0 ? UP : DOWN;
//         }
//         // stem direction will be the the direction of the note that is furthest from the center line. Tie goes down.
//         let firstSteps = noteUtils.getSteps(centerLineValue, chord.children[0].pitch),
//             lastSteps = noteUtils.getSteps(centerLineValue, _.last(chord.children).pitch);
//
//         if (firstSteps < 0 && lastSteps < 0) {
//             return UP;
//         } else if (firstSteps >= 0 && lastSteps >= 0) {
//             return DOWN;
//         } else {
//             return (Math.abs(firstSteps) > Math.abs(lastSteps)) ? UP : DOWN;
//         }
// 	} else {
// 		return UP;
// 	}
// }

function defaultStemPoint (chord, stemDirection, stemLength) {
    let frm, to;
	if (stemDirection === UP) {
        let note = chord.children[0];
		frm = note.noteHead.bounds.rightCenter.add(0, Scored.config.note.head.yOffset);
		to = frm.subtract([0, stemLength]);
	} else {
        let note = _.last(chord.children);
		frm = note.noteHead.bounds.leftCenter.add(0, Scored.config.note.head.yOffset);
		to = frm.add([0, stemLength]);
	}
	return to;
}

/*
 * @param chord - Chord to find the stem length for.
 * @param centerLineValue - String representing note value at the center line.
 */
function getStemLength (chord, centerLineValue, stemDirection) {
	let octaveHeight = Scored.config.lineSpacing * 3.5,
        diff = Math.abs(noteUtils.getSteps(chord.children[0].pitch, _.last(chord.children).pitch) * Scored.config.layout.stepSpacing);

    if (!centerLineValue) return octaveHeight + diff;

    // baseNote is the note that is closes to the stem point
    let baseNote = (stemDirection === UP) ? _.last(chord.children) : chord.children[0];

    let steps = noteUtils.getSteps(centerLineValue, chord.children[0].pitch),
        noteDistance = steps * Scored.config.stepSpacing;

	return Math.max(octaveHeight, Math.abs(noteDistance)) + diff;
}

/*
 * @param chord - Chord. Chord gaurantees that the notes are ordered which is required for this function.
 * @return Note[][] - Array of Note arrays where the the first note is lower than the second note.
 */
function getOverlappingNotes (chord) {
    let notes = chord.children,
        overlaps = [];
    for (let i = 1; i < notes.length; i++) {
        let lower = notes[i-1],
            higher = notes[i],
            steps = noteUtils.getSteps(lower.pitch, higher.pitch);
        if (steps <= 1) {
            overlaps.push([lower, higher]);
        }
    }
    return overlaps;
}

/*
 * @param length - number of notes in the chord
 * @param Number[] - the order in which to place the accidentals.
 */
function getAccidentalOrdering (length) {
    let half = Math.ceil(length / 2),
        low = 0,
        high = length - 1,
        ordering = new Array(length);

    for (let i = 0; i < length; i++) {
        if (isEven(i)) {
            ordering[i] = high;
            high--;
        } else {
            ordering[i] = low;
            low++;
        }
    }

    return ordering;
}

export {
    // getStemDirection,
    defaultStemPoint,
    getStemLength,
    getOverlappingNotes,
    getAccidentalOrdering
}
