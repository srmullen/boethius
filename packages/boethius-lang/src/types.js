// @flow
import Layout from './Layout';
import { NOTE, CHORD, REST } from './constants';

export type Line = {};
export type System = {};
export type Page = {};


export type Note = {type: NOTE, props: {octave: ?number, pitchClass: ?string, value: number}};
export type Chord = {type: CHORD, props: {value: number}, children: Array<Note>};
export type Rest = {type: REST, props: {value: number}};
export type Sequencable = Note | Chord | Rest;

// export type Note = {type: NOTE, props: {value: number, octave: ?number}};
// export type Chord = {type: CHORD, props: {value: number}, children: Array<Note>};
// export type Rest = {type: REST, props: {value: number}};
// export type Sequencable = Note | Chord | Rest;

export type YY = {
    layout: Layout,
    chordSymbols: Array<{}>,
    voices: {}
};
