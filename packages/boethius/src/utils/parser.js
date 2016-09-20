import {map} from "lodash";

import Voice from "../views/Voice";
import Note from "../views/Note";
import Rest from "../views/Rest";
import Chord from "../views/Chord";
import System from "../views/System";
import Line from "../views/Line";
import Measure from "../views/Measure";
import Clef from "../views/Clef";
import Key from "../views/Key";
import TimeSignature from "../views/TimeSignature";
import Dynamic from "../views/Dynamic";
import ChordSymbol from "../views/ChordSymbol";
import Score from "../views/Score";

const typeToConstructor = {
    voice: (props, children) => new Voice(props, children),
    note: (props, children) => new Note(props, children),
    rest: (props, children) => new Rest(props, children),
    chord: (props, children) => new Chord(props, children),
    system: (props, children) => new System(props, children),
    line: (props, children) => new Line(props, children),
    measure: (props, children) => new Measure(props, children),
    clef: (props, children) => new Clef(props, children),
    key: (props, children) => new Key(props, children),
    timeSig: (props, children) => new TimeSignature(props, children),
    dynamic: (props, children) => new Dynamic(props, children),
    score: (props, children) => new Score(props, children)
};

export function parse (element) {
    const children = map(element.children, parse);
    return typeToConstructor[element.type](element.props, children);
}
