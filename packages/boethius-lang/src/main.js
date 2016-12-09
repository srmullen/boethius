import {parser} from "../lang/lang";
import {calculateAndSetTimes} from "./time.js";

function compile (program) {
    parser.yy.voices = {};
    parser.yy.chordSymbols = [];
    parser.yy.vars = {};

    const parsed = parser.parse(program);

    for (let voice in parser.yy.voices) {
        if (parser.yy.voices.hasOwnProperty(voice)) {
            calculateAndSetTimes(parser.yy.voices[voice]);
        }
    }

    return {voices: parser.yy.voices, chordSymbols: parser.yy.chordSymbols};
}

export default compile;
