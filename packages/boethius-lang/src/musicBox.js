const NOTE = "note";
const REST = "rest";
const CHORD = "chord";
const CHORDSYMBOL = "chordSymbol";

const NOTES = {
    "C":  0,  "c":  0,  "b#":  0,   "B#":  0,  "Dbb": 0,   "DBB": 0, "dbb": 0, "dBB": 0,
    "C#": 1,  "c#": 1,  "Db":  1,   "db":  1,  "DB":  1,   "dB":  1,
    "D":  2,  "d":  2,  "c##": 2,   "C##": 2,  "ebb": 2,   "Ebb": 2, "eBB": 2, "EBB": 2,
    "D#": 3,  "d#": 3,  "Eb":  3,   "eb":  3,  "EB":  3,   "eB":  3,
    "E":  4,  "e":  4,  "d##": 4,   "D##": 4,  "fb":  4,   "Fb":  4, "Fb":  4, "FB":  4,
    "E#": 5,  "e#": 5,  "F":   5,   "f":   5,  "gbb": 5,   "Gbb": 5, "gBB": 5, "GBB": 5,
    "F#": 6,  "f#": 6,  "Gb":  6,   "gb":  6,  "GB":  6,   "gB":  6,
    "G":  7,  "g":  7,  "f##": 7,   "F##": 7,  "abb": 7,   "Abb": 7, "aBB": 7, "ABB": 7,
    "G#": 8,  "g#": 8,  "Ab":  8,   "ab":  8,  "AB":  8,   "aB":  8,
    "A":  9,  "a":  9,  "g##": 9,   "G##": 9,  "bbb": 9,   "Bbb": 9, "Bbb": 9, "BBB": 9,
    "A#": 10, "a#": 10, "Bb":  10,  "bb":  10, "BB":  10,  "bB":  10,
    "B":  11, "b":  11, "a##" :11,  "A##": 11, "Cb":  11,  "cb":  11, "CB": 11, "cB": 11
};

const NOTE_RE = /([a-gA-g][#bB]*?)([0-9]+)/;

/*
 * @param noteString - string representing a note.
 * @return [noteString, pitchClass, octave]
 */
function validateNoteString (noteString) {
    return noteString.match(NOTE_RE);
}

/*
 * @param octave - number
 * @param interval - number
 * @return midi number
 */
function octaveNoteToMidi (octave, interval) {
    return (octave * 12) + interval + 12;
}

export function noteInfo (noteString) {
    var validated = validateNoteString(noteString);
    var pitchClass = validated[1];
    var octave = validated[2];
    var interval = NOTES[pitchClass];
    var midi = octaveNoteToMidi(octave, interval);
    return {
        pitch: validated[0],
        pitchClass: pitchClass,
        octave: Number(octave),
        interval: interval,
        midi: midi,
        frequency: midiToHz(midi)
    }
}

function noteToMidi (note) {
    return noteInfo(note).midi;
}

function midiToHz (midi) {
    return Math.pow(2, (midi - 69) / 12) * 440;
}

function noteToHz (note) {
    return midiToHz(noteInfo(note).midi);
}

export function toMusic (parsed) {
    return parsed.reduce((acc, item) => {
        if (item && item.type === CHORDSYMBOL) {
            // acc.chordSymbols.push(item);
        } else if (acc.voices[item.props.voice]) {
            acc.voices[item.props.voice].push(item);
        } else {
            acc.voices[item.props.voice] = [item];
        }

        return acc;
    }, {chordSymbols: [], voices: {}});
}
