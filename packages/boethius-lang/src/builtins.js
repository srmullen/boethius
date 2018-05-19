// @flow
import uuid from 'uuid/v1';
import Keyword from './Keyword';
import PageNode from './PageNode';
import SystemNode from './SystemNode';
import LineNode from './LineNode';
import ChordSymbol from './ChordSymbol';
import TimeSignature from './TimeSignature';
import Clef from './Clef';
import Key from './Key';
import NumberNode from './NumberNode';
import ScopeNode from './ScopeNode';
import type { YY } from './types';
import { Stringable } from './interfaces/Stringable';
import { Serializable } from './interfaces/Serializable';
import { Executable } from './interfaces/Executable';
import { Node } from './interfaces/Node';

const BUILTINS = {
    csym (yy: YY, args: {}) {
        const value = args[0].serialize();
        const measure = args[1].value;
        const beat = args[2] ? args[2].value : 0;
        const chordSymbol = new ChordSymbol({value, measure, beat});

        return chordSymbol;
    },

    timesig (yy: YY, args: {}) {
        const numerator = args[0].value;
        const denominator = args[1].value;
        const measure = args[2] ? args[2].value : 0;
        const beat = args[3] ? args[3].value : 0;
        const props = {
            value: [numerator, denominator],
            measure,
            beat
        };

        const timeSignature = new TimeSignature(props);

        return timeSignature;
    },

    layout (yy: YY, args: Array<Stringable>) {
        // args to layout must be even length
        if (args.length % 2 !== 0) {
            throw new Error('layout must have even number of arguments.');
        }
        const props = {};
        for (let i = 0; i < args.length; i += 2) {
            props[args[i].toString()] = args[i + 1];
        }

        return yy.layout.set(props);
    },

    page (yy: YY, args: {}) {
        const page = new PageNode({
            systems: args[0].value
        });

        return page;
    },

    system (yy: YY, args: Array<NumberNode>) {
        const [measures, ...lineSpacings] = args;
        const lineSpacing = lineSpacings.length ? lineSpacings.map(num => num.value) : [0];
        const system = new SystemNode({measures: measures.value, lineSpacing});

        return system;
    },

    line (yy: YY, args: Array<Serializable>) {
        const props = args.reduce(function (acc, arg) {
            if (arg instanceof Keyword) {
                acc.voices.push(arg.serialize());
            } else if (arg instanceof Clef) {
                acc.clefs.push(arg.serialize());
            } else if (arg instanceof Key) {
                acc.keys.push(arg.serialize());
            }
            return acc;
        }, {keys: [], clefs: [], voices: []})

        const line = new LineNode(props);

        return line;
    },

    clef (yy: YY, args: Array<Serializable>) {
        const value = args[0].serialize();
        const measure = args[1] ? args[1].value : undefined;
        const beat = args[2] ? args[2].value : undefined;
        return new Clef({value, measure, beat});
    },

    key (yy: YY, args: Array<Serializable>) {
        const root = args[0].serialize();
        const mode = args[1].serialize();
        const measure = args[2] ? args[2].value : undefined;
        const beat = args[3] ? args[3].value : undefined;
        return new Key({root, mode, measure, beat});
    },

    legato (yy: YY, args: Array<Serializable>) {
        return new ScopeNode({legato: uuid()}, args);
    },

    repeat (yy: YY, args: [NumberNode, Node]) {
        const [repeats, ...items] = args;
        let repeated: Array<Executable> = [];
        for (let i = 0; i < repeats.value; i++) {
            repeated = repeated.concat(items.map(clone));
        }
        return new ScopeNode({}, repeated);
    },

    /*
     * in-key! causes any notes coming after it to have accidentals applied
     * to automatically. Returns a Key, so if called mid-voice will also
     * add key to the layout.
     */
    'in-key!': function (yy: YY, args: [Key | string]) {
        const key = args[0];
        if (key instanceof Key) {
            yy.currentKey = key;
            return new ScopeNode({}, [key]);
        } else if (key instanceof Keyword && key.toString() === 'none') {
            yy.currentKey = null;
            return new ScopeNode({}, []);
        } else {
            throw new Error(`Unexpected arguments to in-key! : ${args[0].toString()}`);
        }
    }
};

function clone (item: any) {
    const Constructor = item.constructor;
    return new Constructor(item.props, item.children);
}

export default BUILTINS;
