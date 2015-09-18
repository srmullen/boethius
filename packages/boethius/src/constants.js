"use strict";

let constants = {
	type: {
		staff: "staff",
		line: "line",
		measure: "measure",
		note: "note",
		rest: "rest",
		clef: "clef",
		key: "key",
		timeSig: "timeSig"
	},
	font: {
		clefs: {
			treble: '9',
			base: '8',
			alto: '7'
		},
		timeSigs: {
			common: '\u00AB',
			half: '\u00AA'
		},
		accidentals: {
			flat: 'O',
			b: 'O',
			doubleFlat: 'X',
			natural: 'p',
			sharp: '\u2655',
			"#": '\u2655',
			doubleSharp: '\u2653' // this is html entity hex. in gonvillepart1.svg it is html entity decimal
		},
		flags: { // Stem direction and flag direction are the same. If a stem points up then it gets an up flag.
			eighth: {
				down: '\u265F', // cmd-1
				up: '\u00A1'
			},
			sixteenth: {
				down: '\u00A2',
				up: '\u00A3'
			},
			thirtysecond: {
				down: '\u00A4',
				up: '\u00A5'
			},
			sixtyfourth: {
				down: '\u00A6',
				up: '\u00A7'
			},
			onehundredtwentyeighth: {
				down: '\u00A8',
				up: '\u00A9'
			}
		},
		noteheads: {
			solid: '_',
			hollow: '`',
			whole: '\u2654'
		},
		rests: {
			1: '\u265E',
			2: '\u265B',
			4: '~',
			8: '\u0074', // \u0074 was a pedal dot in the original gonvillepart1.svg
			16: '\u265C',
			32: '\u2657',
			64: '\u2658',
			128: '\u2659'
		}
	},
	clefs: {
		treble: "treble",
		base: "base",
		alto: "alto",
		tenor: "tenor"
	},
	noteTypes: [0.5, 1, 2, 4, 8, 16, 32, 64, 128],
	measure: {
		defaultLength: 200,
		minLength: 75
	}
};

module.exports = constants;
