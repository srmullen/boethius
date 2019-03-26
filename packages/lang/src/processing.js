// @flow
import type { Sequencable, Chord, Note } from './types';
import {NOTE, CHORD} from './constants';
import memoize from 'lodash.memoize';
import minBy from 'lodash.minby';
import teoria from 'teoria';

/*
 * Given a pitch {p1}, that pitches octave {octave} and a pitch without an octave {p2}
 * returns the octave for pitch p2 which is closest to p1.
 */
const octaveDirection = memoize((p1: string, octave: number, p2: string): string | number => {
    if (!p1) {
        return octave;
    }
    const n1 = teoria.note(p1 + octave);

    return minBy([octave, octave + 1, octave - 1], (oct) => {
        return Math.abs(teoria.interval(n1, teoria.note(p2 + oct)).semitones());
    });

}, (p1: string, octave: number, p2: string): string => {
    return p1 + octave + p2;
});



export function easyOctave (voice: Array<Sequencable>) {
    let pitchClass;
    let octave = 4;
    const updateNote = (note) => {
        if (!note.props.octave) {
            const newOctave = octaveDirection(pitchClass, octave, note.props.pitchClass);
            note.props.octave = newOctave;
            octave = newOctave;
        } else {
            octave = note.props.octave;
        }
        pitchClass = note.props.pitchClass
    }
    const updateChord = (chord) => {
        for (let j = 0; j < chord.children.length; j++) {
            if (chord.children[j].type === NOTE) {
                const note = chord.children[j];
                updateNote(note);
            }
        }
    }
    for (let i = 0; i < voice.length; i++) {
        if (voice[i].type === NOTE) {
            const note = voice[i];
            updateNote(note);
        } else if (voice[i].type === CHORD) {
            const chord = voice[i];
            updateChord(chord);
        }
    }
}
