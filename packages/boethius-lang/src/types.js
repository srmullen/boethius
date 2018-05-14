// @flow
import Layout from './Layout';
import { NOTE, CHORD, REST } from './constants';

export type Clef = {value: string};
export type LineProps = {clefs: Array<Clef>, voices: Array<string>};
export type System = {};
export type Page = {};

type Props = {
    octave?: number,
    pitchClass?: string,
    value: number
};

export type Note = {type: typeof NOTE, props: Props, children: Array<Note>};
export type Chord = {type: typeof CHORD, props: Props, children: Array<Note>};
export type Rest = {type: typeof REST, props: Props, children: Array<Note>};
export type Sequencable = Note | Chord | Rest;

export type YY = {
    layout: Layout,
    chordSymbols: Array<{}>,
    voices: {}
};
