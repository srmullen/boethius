import Keyword from './Keyword';
import SystemNode from './SystemNode';
import LineNode from './LineNode';
import {CHORDSYMBOL, CLEF, KEY} from './constants';

const BUILTINS = {
    csym: function (yy, args) {
        const value = args[0].toString();
        const measure = args[1].value;
        const beat = args[2] ? args[2].value : 0;
        const chordSymbol = {type: CHORDSYMBOL, props: {value, measure, beat}};
        yy.chordSymbols.push(chordSymbol);
        return chordSymbol;
    },
    timesig: function (yy, args) {
        const numerator = args[0].value;
        const denominator = args[1].value;
        const measure = args[2] ? args[2].value : 0;
        const beat = args[3] ? args[3].value : 0;
        const timeSignature = {
            value: [numerator, denominator],
            measure,
            beat
        };

        yy.layout.timeSignatures.push(timeSignature);

        return timeSignature;
    },
    system: function (yy, args) {
        const [measures, ...lineSpacings] = args
        const lineSpacing = lineSpacings.length ? lineSpacings.map(num => num.value) : [0];
        const system = new SystemNode({measures: measures.value, lineSpacing});

        yy.layout.systems.push(system);

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

        const line = new LineNode(props, yy.layout);

        yy.layout.lines.push(line);

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
