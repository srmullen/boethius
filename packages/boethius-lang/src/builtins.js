import Keyword from './Keyword';
import PageNode from './PageNode';
import SystemNode from './SystemNode';
import LineNode from './LineNode';
import ChordSymbol from './ChordSymbol';
import TimeSignature from './TimeSignature';
import {CHORDSYMBOL, CLEF, KEY} from './constants';

const BUILTINS = {
    csym: function (yy, args) {
        const value = args[0].toString();
        const measure = args[1].value;
        const beat = args[2] ? args[2].value : 0;
        // const chordSymbol = {type: CHORDSYMBOL, props: {value, measure, beat}};
        const chordSymbol = new ChordSymbol({value, measure, beat});

        return chordSymbol;
    },
    timesig: function (yy, args) {
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

        // yy.layout.timeSignatures.push(timeSignature);

        return timeSignature;
    },
    layout: function (yy, args) {
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
    page: function (yy, args) {
        const page = new PageNode({
            systems: args[0].value
        });

        return page;
    },
    system: function (yy, args) {
        const [measures, ...lineSpacings] = args
        const lineSpacing = lineSpacings.length ? lineSpacings.map(num => num.value) : [0];
        const system = new SystemNode({measures: measures.value, lineSpacing});

        return system;
    },
    line: function (yy, args) {
        const props = args.reduce(function (acc, arg) {
            if (arg instanceof Keyword) {
                acc.voices.push(arg.toString());
            } else if (arg.type === CLEF) {
                acc.clefs.push(arg);
            } else if (arg.type === KEY) {
                acc.keys.push(arg);
            }
            return acc;
        }, {keys: [], clefs: [], voices: []})

        const line = new LineNode(props);

        return line;
    },
    clef: function (yy, args) {
        const value = args[0].toString();
        const measure = args[1] ? args[1].value : 0;
        const beat = args[2] ? args[2].value : 0;
        return {type: CLEF, value, measure, beat};
    },
    key: function (yy, args) {
        const root = args[0].toString();
        const mode = args[1].toString();
        const measure = args[2] ? args[2].value : 0;
        const beat = args[3] ? args[3].value : 0;
        return {type: KEY, root, mode, measure, beat};
    }
};

export default BUILTINS;
