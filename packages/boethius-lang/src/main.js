import {parser} from "../lang/lang";
import {calculateAndSetTimes} from "./time.js";
import {scale, pitch} from "./palestrina/src/palestrina";
import NoteNode from "./NoteNode";
import RestNode from "./RestNode";
import ChordNode from "./ChordNode";
import Keyword from './Keyword';
import Layout from './Layout';
import BUILTINS from './builtins';
import { NOTE, REST, CHORD, CHORDSYMBOL } from './constants';

function compile (program) {
    parser.yy.voices = {};
    parser.yy.chordSymbols = [];
    parser.yy.layout = new Layout();
    parser.yy.vars = {};
    parser.yy.BUILTINS = BUILTINS;
    parser.yy.NoteNode = NoteNode;
    parser.yy.RestNode = RestNode;
    parser.yy.ChordNode = ChordNode;
    parser.yy.Keyword = Keyword;
    parser.yy.parsePitch = pitch.parsePitch;

    const parsed = parser.parse(program);

    for (let voice in parser.yy.voices) {
        if (parser.yy.voices.hasOwnProperty(voice)) {
            calculateAndSetTimes(parser.yy.voices[voice]);
        }
    }

    return {
        voices: parser.yy.voices,
        chordSymbols: parser.yy.chordSymbols,
        layout: parser.yy.layout.serialize()
    };
}

export const TYPES = { NOTE, REST, CHORD, CHORDSYMBOL };

export default compile;
