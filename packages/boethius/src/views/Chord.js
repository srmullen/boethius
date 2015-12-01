import _ from "lodash";

import {getSteps, parsePitch} from "../utils/note";
import {getStemDirection, defaultStemPoint, getStemLength, getOverlappingNotes} from "../utils/chord";
import {map} from "../utils/common";
import constants from "../constants";
import Note from "./Note";

const TYPE = constants.type.chord;

/*
 * @param children - Array of notes. Can take several representations. String, Object, or Note.
 */
function Chord ({value=4, root, name, inversion, stacato, legato, stemDirection}, children=[]) {
	this.value = value;
	this.root = root;
	this.name = name;
	this.inversion = inversion;
	this.stacato = stacato;
	this.legato = legato;
	this.stemDirection = stemDirection;

	this.children = parseChildren(children, {value});
}

Chord.prototype.type = TYPE;

Chord.render = function (chord, context) {
	let group = chord.render();
	Chord.renderAccidentals(chord, context);
	Chord.renderStem(chord);
	return group;
}

// render accidentals from outside in. Closest accidental always starts at highest note.
// translate the accidental left based on the number of accidental overlaps.
Chord.renderAccidentals = function (chord, context={}) {
	// get the accidental to be rendered on each note.
	let accidentals = _.map(chord.children, (note) => {
		let parsedPitch = parsePitch(note.pitch);
		return context.key ? getAccidental(parsedPitch, context.accidentals, context.key) : parsedPitch.accidental;
	});

	map((note, accidental) => note.drawAccidental(accidental), chord.children, accidentals);

}

Chord.renderStem = function (chord, centerLineValue, stemDirection) {
	if (chord.needsStem()) {
		stemDirection = stemDirection || getStemDirection(chord, centerLineValue);
		let stemPoint = defaultStemPoint(chord, stemDirection, getStemLength(chord, centerLineValue));
		chord.drawStem(stemPoint, stemDirection);
		chord.drawFlag();
	}
}

Chord.prototype.render = function ({accidentals = [], context = {}} = {}) {
	const group = this.group = new paper.Group({name: TYPE});

	let stemDirection = getStemDirection(this),
		overlaps = getOverlappingNotes(this);

	// get steps
	let [root, ...rest] = stemDirection === "up" ? this.children : _.clone(this.children).reverse();

	let noteGroups = this.children.map(note => note.render());

	let translationFn;

	// translate note if they overlap
	if (stemDirection === "down") {
		const xTranslation = -Scored.config.note.head.width;
		translationFn = (overlaps) => {
			let translated = [];
			_.each(_.clone(overlaps).reverse(), ([lower, higher]) => {
				if (!_.some(translated, n => n === higher)) {
					lower.group.translate(xTranslation, 0);
					translated.push(lower);
				}
			});
		}
	} else {
		const xTranslation = Scored.config.note.head.width;
		translationFn = (overlaps) => {
			let translated = [];
			_.each(overlaps, ([lower, higher]) => {
				if (!_.some(translated, n => n === lower)) {
					higher.group.translate(xTranslation, 0);
					translated.push(higher);
				}
			});
		}
	}

	if (overlaps.length) {
		translationFn(overlaps)
	}

	_.each(rest, note => {
		let steps = getSteps(note.pitch, root.pitch);
		note.group.translate(0, steps * Scored.config.layout.stepSpacing);
	});

	group.addChildren(noteGroups);

	return group;
}

Chord.prototype.drawStem = function (to, stemDirection) {
	let frm, stem;

	if (stemDirection === "up") {
		frm = this.children[0].noteHead.bounds.rightCenter.add(0, Scored.config.note.head.yOffset);
	} else {
		frm = _.last(this.children).noteHead.bounds.leftCenter.add(0, Scored.config.note.head.yOffset);
	}

	stem = new paper.Path.Line({
		name: "stem",
		from: frm,
		to: to,
		strokeColor: "black",
		strokeWidth: 2
	});

	this.group.addChild(stem);

	return stem;
}

Chord.prototype.drawFlag = function () {
	console.log("drawing chord flag");
}

/*
 * @return Boolean - true if the note needs a stem drawn, False otherwise.
 */
Chord.prototype.needsStem = function () {
	return this.value >= 2;
}

/*
 * @return Boolean - true if the note needs a flag drawn, False otherwise.
 */
Chord.prototype.needsFlag = function () {
	return this.value >= 8;
}

/*
 * @param children - Array<Note representations>
 * @return Note[]
 */
function parseChildren (children, defaults={}) {
	let notes = _.map(children, note => {
		if (note.type === constants.type.note) {
			return note;
		}

		if (_.isString(note)) {
			return new Note(_.assign({}, defaults, {pitch: note}));
		}

		if (_.isObject(note)) {
			return new Note(_.assign({}, defaults, note));
		}
	});

	return _.sortBy(notes, note => note.note.midi());
}

export default Chord;
