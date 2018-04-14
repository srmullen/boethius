import Keyword from './Keyword';
import {CHORDSYMBOL, CLEF, KEY} from './constants';

const BUILTINS = {
    csym: function (yy, args) {
        const value = args[0].toString();
        const measure = Number(args[1]);
        const beat = args[2] ? Number(args[2]) : 0;
        const chordSymbol = {type: CHORDSYMBOL, props: {value, measure, beat}};
        yy.chordSymbols.push(chordSymbol);
        return chordSymbol;
    },
    timesig: function (yy, args) {
        const numerator = Number(args[0]);
        const denominator = Number(args[1]);
        const timeSignature = {
            value: [numerator, denominator],
            measure: 0,
            beat: 0
        };
        if (yy.layout.timeSignatures) {
            yy.layout.push(timeSignature);
        } else {
            yy.layout.timeSignatures = [timeSignature];
        }
        return timeSignature;
    },
    line: function (yy, args) {
        const line = args.reduce(function (acc, arg) {
            if (arg instanceof Keyword) {
                acc.voices.push(arg.toString());
            } else if (arg.type === CLEF) {
                acc.clefs.push(arg);
            } else if (arg.type === KEY) {
                acc.keys.push(arg);
            }
            return acc;
        }, {keys: [], clefs: [], voices: []});
        if (yy.layout.lines) {
            yy.layout.lines.push(line);
        } else {
            yy.layout.lines = [line];
        }
        return line;
    },
    clef: function (yy, args) {
        const value = args[0].toString();
        const measure = args[1] ? Number(args[1]) : 0;
        const beat = args[2] ? Number(args[2]) : 0;
        return {type: CLEF, value, measure, beat};
    },
    key: function (yy, args) {
        const root = args[0].toString();
        const mode = args[1].toString();
        const measure = args[2] ? Number(args[2]) : 0;
        const beat = args[3] ? Number(args[3]) : 0;
        return {type: KEY, root, mode, measure, beat};
    }
};

export default BUILTINS;
