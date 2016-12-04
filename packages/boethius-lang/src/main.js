import {parser} from "../lang/lang";
import {noteInfo, toMusic} from "./musicBox";

function compile (program) {
    parser.yy.noteInfo = noteInfo;
    parser.yy.toMusic = toMusic;
    parser.yy.voices = {};
    parser.yy.chordSymbols = [];

    const parsed = parser.parse(program);

    return {voices: parser.yy.voices, chordSymbols: parser.yy.chordSymbols};
}

export default compile;
