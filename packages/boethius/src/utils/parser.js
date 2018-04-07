import {map} from "lodash";

import {clone} from "./common";
import Voice from "../views/Voice";
import Note from "../views/Note";
import Rest from "../views/Rest";
import Repeat from "../views/Repeat";
import Chord from "../views/Chord";
import ChordSymbol from "../views/ChordSymbol";
import System from "../views/System";
import Line from "../views/Line";
import Measure from "../views/Measure";
import Clef from "../views/Clef";
import Key from "../views/Key";
import TimeSignature from "../views/TimeSignature";
import Dynamic from "../views/Dynamic";
import Score from "../views/Score";
import Page from "../views/Page";

const typeToConstructor = {
    voice: (props, children) => new Voice(props, children),
    note: (props, children) => new Note(props, children),
    rest: (props, children) => new Rest(props, children),
    repeat: (props, children) => new Repeat(props,children),
    chord: (props, children) => new Chord(props, children),
    chordSymbol: (props, children) => new ChordSymbol(props, children),
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

export function parseLayout (layout) {
    const timeSigs = [...layout.timeSignatures].map(timeSig => {
        return new TimeSignature({value: convertTimeSig(timeSig.value), measure: timeSig.measure});
    });

    const lines = layout.lines.map(makeLine.bind(null, timeSigs));

    const pages = makePages(layout.pages);

    const systems = makeSystems(layout.pages, layout.systems);

    return new Score({title: layout.title}, [...timeSigs, ...pages, ...systems, ...lines]);
}

const roots = [
    "Ab" ,"A", "A#", "Bb", "B", "B#", "Cb", "C", "C#", "Db", "D",
    "D#", "Eb", "E", "E#", "Fb", "F", "F#", "Gb", "G", "G#"
];

const modes = ["major", "minor"];

const keys = roots.reduce((acc, root) => {
    acc[root] = modes.reduce((modeAcc, mode) => {
        modeAcc[mode] = (mode === "minor") ? root.toLowerCase() : root;
        return modeAcc;
    }, {});
    return acc;
}, {});

/*
 * @param pages - {List}
 * @param systems - {List}
 */
function makeSystems (pages, systems) {
    let page = 0;
    let count = 1;
    return systems.map((s) => {
        const system = new System(Object.assign({}, s, {lineHeights: s.lineSpacing, page}));
        if (!pages[page]) {
            page++;
        } else if (count === pages[page].systems) {
            page++;
            count = 1;
        } else {
            count++;
        }
        return system;
    });
}

function makePages (pages) {
    return pages.map(page => new Page(page));
}

/*
 * @param root - the tonic of the scale.
 * @param mode - the mode of the scale.
 * @return - String representation of the key.
 */
function convertKey ({root, mode}) {
    return keys[root][mode];
}

function makeLine (timeSigs, line) {
    return new Line({voices: line.voices}, [
        ...line.clefs.map((context={}) => new Clef(context)),
        ...line.keys.map(key => new Key(Object.assign({}, key, {value: convertKey(key)}))),
        ...timeSigs.map(clone)
    ]);
};

/*
 * @param numerator - the top time signature number.
 * @param denominator - the bottom time signature number.
 * @return String representation of the time signature.
 */
function convertTimeSig ([numerator, denominator]) {
    return `${numerator}/${denominator}`;
}

/*
 * Create an object capable of being parsed.
 */
function createElement (type, props, children) {
    return {type, props, children};
}

function parseVoices (voices) {
    return map(voices, (v, k) => {
        return parse(createElement("voice", {name: k}, v));
    });
}

export function parseMusic (music) {
    const voices = music.voices || {};
    const chordSymbols = music.chordSymbols || [];
    return {
        voices: parseVoices(voices),
        // pages: [layout.currentPage],
        chordSymbols: chordSymbols.map(parse)
    };
}
