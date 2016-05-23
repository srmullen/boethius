import {parser} from "../lang/lang";

function compile (program) {
    const parsed = parser.parse(program);

    return parsed;
}

export default compile;
