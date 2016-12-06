import {parser} from "../lang/lang";

function compile (program) {
    parser.yy.voices = {};
    parser.yy.chordSymbols = [];
    parser.yy.vars = {};

    const parsed = parser.parse(program);

    return {voices: parser.yy.voices, chordSymbols: parser.yy.chordSymbols};
}

export default compile;
