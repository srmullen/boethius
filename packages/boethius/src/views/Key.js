import {drawAccidental} from "../engraver";
import * as placement from "../utils/placement";
import {parsePitch} from "../utils/note";
import _ from "lodash";
import constants from "../constants";

const TYPE = constants.type.key,

	// flats = [
	// 	[],
	// 	["bb"],
	// 	["bb", "eb"],
	// 	["bb", "eb", "ab"],
	// 	["bb", "eb", "ab", "db"],
	// 	["bb", "eb", "ab", "db", "gb"],
	// 	["bb", "eb", "ab", "db", "gb", "cb"],
	// 	["bb", "eb", "ab", "db", "gb", "cb", "fb"]
	// ],
	//
	// sharps = [
	// 	[],
	// 	["f#"],
	// 	["f#", "c#"],
	// 	["f#", "c#", "g#"],
	// 	["f#", "c#", "g#", "d#"],
	// 	["f#", "c#", "g#", "d#", "a#"],
	// 	["f#", "c#", "g#", "d#", "a#", "e#"],
	// 	["f#", "c#", "g#", "d#", "a#", "e#", "b#"]
	// ],

	keyToPitches = {
		"C":  ["c", "d", "e", "f", "g", "a", "b"],
		"C#": ["c#", "d#", "e#", "f#", "g#", "a#", "b#"],
		"Db": ["db", "eb", "f", "gb", "ab", "bb", "c"],
		"D":  ["d", "e", "f#", "g", "a", "b", "c#"],
		"D#": ["d#", "e#", "fx", "g#", "a#", "b#", "cx"],
		"Eb": ["eb", "f", "g", "ab", "bb", "c", "d"],
		"E":  ["e", "f#", "g#", "a", "b", "c#", "d#"],
		"F":  ["f", "g", "a", "bb", "c", "d", "e"],
		"F#": ["f#", "g#", "a#", "b", "c#", "d#", "e#"],
		"Gb": ["gb", "ab", "bb", "cb", "db", "eb", "f"],
		"G":  ["g", "a", "b", "c", "d", "e", "f#"],
		"G#": ["g#", "a#", "b#", "c#", "d#", "e#", "fx"],
		"Ab": ["ab", "bb", "c", "db", "eb", "f", "g"],
		"A":  ["a", "b", "c#", "d", "e", "f#", "g#"],
		"A#": ["a#", "b#", "cx", "d#", "e#", "fx", "gx"],
		"Bb": ["bb", "c", "d", "eb", "f", "g", "a"],
		"B":  ["b", "c#", "d#", "e", "f#", "g#", "a#"],

		"a":  ["a", "b", "c", "d", "e", "f", "g"],
		"a#": ["a#", "b#", "c#", "d#", "e#", "f#", "g#"],
		"bb": ["bb", "c", "db", "eb", "f", "gb", "ab"],
		"b":  ["b", "c#", "d", "e", "f#", "g", "a"],
		"c":  ["c", "d", "eb", "f", "g", "ab", "bb"],
		"c#": ["c#", "d#", "e", "f#", "g#", "a", "b"],
		"db": ["db", "eb", "fb", "gb", "ab", "bbb", "cb"],
		"d":  ["d", "e", "f", "g", "a", "bb", "c"],
		"d#": ["d#", "e#", "f#", "g#", "a#", "b", "c#"],
		"eb": ["eb", "f", "gb", "ab", "bb", "cb", "db"],
		"e":  ["e", "f#", "g", "a", "b", "c", "d"],
		"f":  ["f", "g", "ab", "bb", "c", "db", "eb"],
		"f#": ["f#", "g#", "a", "b", "c#", "d", "e"],
		"gb": ["gb", "ab", "bbb", "cb", "db", "ebb", "fb"],
		"g":  ["g", "a", "bb", "c", "d", "eb", "f"],
		"g#": ["g#", "a#", "b", "c#", "d#", "e", "f#"],
		"ab": ["ab", "bb", "cb", "db", "eb", "fb", "gb"]
	},

	// Treble major is the baseline
	flatSteps = [
		[],
		[0],
		[0, -3],
		[0, -3, 1],
		[0, -3, 1, -2],
		[0, -3, 1, -2, 2],
		[0, -3, 1, -2, 2, -1],
		[0, -3, 1, -2, 2, -1, 3]
	],

	sharpSteps = [
		[],
		[-4],
		[-4, -1],
		[-4, -1, -5],
		[-4, -1, -5, -2],
		[-4, -1, -5, -2, 1],
		[-4, -1, -5, -2, 1, -3],
		[-4, -1, -5, -2, 1, -3, 0]
	],

	clefTransform = {
			treble: _.identity,
			bass: _.partialRight(_.map, x => x + 2),
			alto: _.partialRight(_.map, x => x + 1),
			tenor: _.partialRight(_.map, x => x + -1)
		},
		SHARP = "#",
		FLAT = "b",

	nameToSignature = {
		"C":  [[], ""],
		"a":  [[], ""],

		// major sharps
		"G":  [sharpSteps[1], SHARP],
		"D":  [sharpSteps[2], SHARP],
		"A":  [sharpSteps[3], SHARP],
		"E":  [sharpSteps[4], SHARP],
		"B":  [sharpSteps[5], SHARP],
		"F#": [sharpSteps[6], SHARP],
		"C#": [sharpSteps[7], SHARP],

		// minor sharps
		"e":  [sharpSteps[1], SHARP],
		"b":  [sharpSteps[2], SHARP],
		"f#": [sharpSteps[3], SHARP],
		"c#": [sharpSteps[4], SHARP],
		"g#": [sharpSteps[5], SHARP],
		"d#": [sharpSteps[6], SHARP],
		"a#": [sharpSteps[7], SHARP],

		// major flats
		"F":  [flatSteps[1], FLAT],
		"Bb": [flatSteps[2], FLAT],
		"Eb": [flatSteps[3], FLAT],
		"Ab": [flatSteps[4], FLAT],
		"Db": [flatSteps[5], FLAT],
		"Gb": [flatSteps[6], FLAT],
		"Cb": [flatSteps[7], FLAT],

		// minor flats
		"d":  [flatSteps[1], FLAT],
		"g":  [flatSteps[2], FLAT],
		"c":  [flatSteps[3], FLAT],
		"f":  [flatSteps[4], FLAT],
		"bb": [flatSteps[5], FLAT],
		"eb": [flatSteps[6], FLAT],
		"ab": [flatSteps[7], FLAT]
	}

function Key ({value="C", measure, beat}) {
	this.value = value;
	this.measure = measure;
	this.beat = beat;
}

Key.prototype.type = TYPE;

/*
 * @param position {Point} - the location to draw the first accidental
 */
Key.prototype.render = function ({context} = {}) {
	const margin = {
		top: 0,
		left: 2,
		bottom: 0,
		right: 10
	}

	const group = this.group = new paper.Group({
		name: TYPE
	});

	// group.removeChildren();

	let clefValue = context && context.clef ? context.clef.value : "treble";

	let clefToPosition = {
		"treble": [0, 0],
		"bass": [0, Scored.config.layout.stepSpacing * 2],
		"alto": [0, Scored.config.layout.stepSpacing],
		"tenor": [0, -Scored.config.layout.stepSpacing]
	};

	let [signature, accidental] = nameToSignature[this.value],
		position = new paper.Point(clefToPosition[clefValue]);

	let symbol, item, yTranslate;
	for (var i = 0; i < signature.length; i++) {
		symbol = drawAccidental(accidental);

		yTranslate = placement.calculateAccidentalYpos(signature[i], Scored.config.lineSpacing/2);

		item = symbol.place(position.add([0, yTranslate]));

		position = position.add([7, 0]);

		group.addChild(item);
	}

	return group;
}

Key.prototype.getPitches = function () {
	return keyToPitches[this.value];
}

export default Key;
