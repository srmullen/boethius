// @flow
import Keyword from './Keyword';
import PageNode from './PageNode';
import SystemNode from './SystemNode';
import LineNode from './LineNode';
import ChordSymbol from './ChordSymbol';
import TimeSignature from './TimeSignature';
import Clef from './Clef';
import Key from './Key';
import NumberNode from './NumberNode';
import type { YY } from './types';
import { Stringable } from './interfaces/Stringable';
import { Serializable } from './interfaces/Serializable';

const BUILTINS = {
    csym: function (yy: YY, args: {}) {
        const value = args[0].serialize();
        const measure = args[1].value;
        const beat = args[2] ? args[2].value : 0;
        const chordSymbol = new ChordSymbol({value, measure, beat});

        return chordSymbol;
    },
    timesig: function (yy: YY, args: {}) {
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
    layout: function (yy: YY, args: Array<Stringable>) {
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
    page: function (yy: YY, args: {}) {
        const page = new PageNode({
            systems: args[0].value
        });

        return page;
    },
    system: function (yy: YY, args: Array<NumberNode>) {
        const [measures, ...lineSpacings] = args;
        const lineSpacing = lineSpacings.length ? lineSpacings.map(num => num.value) : [0];
        const system = new SystemNode({measures: measures.value, lineSpacing});

        return system;
    },
    line: function (yy: YY, args: Array<Serializable>) {
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
    clef: function (yy: YY, args: Array<Serializable>) {
        const value = args[0].serialize();
        const measure = args[1] ? args[1].value : 0;
        const beat = args[2] ? args[2].value : 0;
        return new Clef({value, measure, beat});
    },
    key: function (yy: YY, args: Array<Serializable>) {
        const root = args[0].serialize();
        const mode = args[1].serialize();
        const measure = args[2] ? args[2].value : 0;
        const beat = args[3] ? args[3].value : 0;
        return new Key({root, mode, measure, beat});
    }
};

export default BUILTINS;
