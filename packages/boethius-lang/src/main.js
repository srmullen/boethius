import {parser} from "../lang/lang";
import * as musicBox from "./musicBox";

function compile (program) {
    const parsed = parser.parse(program);
    return parsed.map(musicBox.noteInfo);
}

export default compile;
