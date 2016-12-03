import {parser} from "../lang/lang";
import {noteInfo, toMusic} from "./musicBox";

function compile (program) {
    parser.yy.noteInfo = noteInfo;
    parser.yy.toMusic = toMusic;
    const parsed = parser.parse(program);

    return parsed;
}

export default compile;
