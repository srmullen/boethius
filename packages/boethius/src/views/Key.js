import engraver from "../engraver";
import * as placement from "../utils/placement";
import _ from "lodash";
import constants from "../constants";

const TYPE = constants.type.key,

	flats = [
		[],
		["bb"],
		["bb", "eb"],
		["bb", "eb", "ab"],
		["bb", "eb", "ab", "db"],
		["bb", "eb", "ab", "db", "gb"],
		["bb", "eb", "ab", "db", "gb", "cb"],
		["bb", "eb", "ab", "db", "gb", "cb", "fb"]
	],

	sharps = [
		[],
		["f#"],
		["f#", "c#"],
		["f#", "c#", "g#"],
		["f#", "c#", "g#", "d#"],
		["f#", "c#", "g#", "d#", "a#"],
		["f#", "c#", "g#", "d#", "a#", "e#"],
		["f#", "c#", "g#", "d#", "a#", "e#", "b#"]
	],

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
Key.prototype.render = function (clef) {
	const margin = {
		top: 0,
		left: 2,
		bottom: 0,
		right: 10
	}

	const group = this.group = new paper.Group({
		name: TYPE
	});
	position = new paper.Point(position); // make sure position isn't just an array

	// group.removeChildren();

	let [signature, accidental] = nameToSignature[this.value];

	var symbol, item, yTranslate, position = new paper.Point([0, 0]);
	for (var i = 0; i < signature.length; i++) {
		symbol = engraver.drawAccidental(accidental);

		yTranslate = placement.calculateAccidentalYpos(signature[i], Scored.config.lineSpacing/2);

		item = symbol.place(position.add([0, yTranslate]));

		position = position.add([7, 0]);

		group.addChild(item);
	}

	return group;
}

export default Key;
