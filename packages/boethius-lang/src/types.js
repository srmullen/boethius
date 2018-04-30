// @flow
import Layout from './Layout';

export type Line = {};
export type System = {};
export type Page = {};

export type Note = {type: string, props: {octave: ?number, pitchClass: ?string, value: number}};
export type Chord = {type: string, props: {value: number}, children: Array<Note>};
export type Rest = {type: string, props: {value: number}};
export type Sequencable = Note | Chord | Rest;

export type YY = {
    layout: Layout,
    chordSymbols: Array<{}>,
    voices: {}
};
