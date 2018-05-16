// @flow
import {parser} from "../lang/lang";
import {easyOctave} from './processing';
import {scale, pitch} from "./palestrina/src/palestrina";
import NumberNode from './NumberNode';
import NoteNode from "./NoteNode";
import RestNode from "./RestNode";
import ScopeNode from "./ScopeNode";
import ChordNode from "./ChordNode";
import Keyword from './Keyword';
import Layout from './Layout';
import Voice from './Voice';
import BUILTINS from './builtins';
import { NOTE, REST, CHORD, CHORDSYMBOL } from './constants';

function compile (program: string, opts: {}) {
    const defaults = {
        // easyOctave option allows octave to automatically be assigned to notes
        // based on proximity of previous notes.
        easyOctave: false
    };
    const options = Object.assign({}, defaults, opts);
    parser.yy.voices = {};
    parser.yy.chordSymbols = [];
    parser.yy.layout = new Layout();
    parser.yy.vars = {};
    parser.yy.BUILTINS = BUILTINS;
    parser.yy.NumberNode = NumberNode;
    parser.yy.NoteNode = NoteNode;
    parser.yy.RestNode = RestNode;
    parser.yy.ScopeNode = ScopeNode;
    parser.yy.ChordNode = ChordNode;
    parser.yy.Keyword = Keyword;
    parser.yy.Voice = Voice;
    parser.yy.parsePitch = pitch.parsePitch;

    const parsed = parser.parse(program);

    for (let voice in parser.yy.voices) {
        if (parser.yy.voices.hasOwnProperty(voice)) {
            if (options.easyOctave) {
                easyOctave(parser.yy.voices[voice]);
            }
        }
    }

    const layout = parser.yy.layout.serialize();
    
    return {
        voices: parser.yy.voices,
        chordSymbols: parser.yy.chordSymbols,
        layout
    };
}

export const TYPES = { NOTE, REST, CHORD, CHORDSYMBOL };

export default compile;
