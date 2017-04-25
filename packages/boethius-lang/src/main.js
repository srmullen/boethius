import {parser} from "../lang/lang";
import {calculateAndSetTimes} from "./time.js";
import {scale, pitch} from "./palestrina";
import NoteNode from "./NoteNode";
import RestNode from "./RestNode";
import ChordNode from "./ChordNode";

function compile (program) {
    parser.yy.voices = {};
    parser.yy.chordSymbols = [];
    parser.yy.vars = {};
    parser.yy.NoteNode = NoteNode;
    parser.yy.RestNode = RestNode;
    parser.yy.ChordNode = ChordNode;
    parser.yy.parsePitch = pitch.parsePitch;

    const parsed = parser.parse(program);

    for (let voice in parser.yy.voices) {
        if (parser.yy.voices.hasOwnProperty(voice)) {
            calculateAndSetTimes(parser.yy.voices[voice]);
        }
    }

    return {voices: parser.yy.voices, chordSymbols: parser.yy.chordSymbols};
}

export default compile;
