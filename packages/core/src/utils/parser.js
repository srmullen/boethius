import {map, isArray} from "lodash";

import {clone} from "./common";
import Voice from "../views/Voice";
import Note from "../views/Note";
import Rest from "../views/Rest";
import Repeat from "../views/Repeat";
import Chord from "../views/Chord";
import ChordSymbol from "../views/ChordSymbol";
import System from "../views/System";
import Line from "../views/Line";
import Measure, { createMeasures } from "../views/Measure";
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

    const pages = makePages(layout.pages);

    const systems = makeSystems(layout.pages, layout.systems);

    const lines = layout.lines.map(makeLine.bind(null, timeSigs));

    return {
      score: new Score(layout.score, [...timeSigs, ...pages, ...systems, ...lines]),
      measures: makeMeasures(layout.measures)
    };
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

/**
 * Create a list of measures from measure config objects.
 * @param { {type: 'measure'}[] } measures
 */
function makeMeasures (measures = []) {
  let n = 0;
  return measures.map(measure => {
    const timeSig = new TimeSignature({value: measure.timeSig});
    return new Measure(Object.assign({}, measure, {timeSig}));
  });
}

/**
 * @param {[{}]} pages
 * @param {[{}]} systems
 */
function makeSystems (pages, systems) {
  let page = 0;
  let count = 1;
  let startsAt = _.isNumber(systems[0].startsAt)
    ? systems[0].startsAt
    : {measure: 0, beat: 0};
  const add = _.isNumber(systems[0].startsAt)
    ? (t1, t2) => (t1 + t2.time)
    : (t1, t2) => ({
      measure: t1.measure + (t2.measure || 0),
      beat: t1.beat + (t2.beat || 0)
    });
  return systems.map((s) => {
    const props = {lineHeights: s.lineSpacing, page, startsAt};
    const system = new System(Object.assign({}, props, s));
    startsAt = add(system.props.startsAt, system.props.duration);
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
function convertTimeSig (timeSig) {
  if (isArray(timeSig)) {
    return `${timeSig[0]}/${timeSig[1]}`;
  } else {
    return timeSig;
  }
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
    return Object.assign({}, music, {
        voices: parseVoices(voices),
        chordSymbols: chordSymbols.map(parse)
    });
}
