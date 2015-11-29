import _ from "lodash";

import {getSteps} from "../utils/note";
import {getStemDirection, defaultStemPoint, getStemLength, getOverlappingNotes} from "../utils/chord";
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

Chord.render = function (chord) {
	let group = chord.render();
	Chord.renderStem(chord);
	return group;
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

	// get steps
	let [root, ...rest] = this.children;

	let noteGroups = this.children.map(note => note.render());

	let stemDirection = getStemDirection(this),
		overlaps = getOverlappingNotes(this);

	if (overlaps.length) {
		_.each(overlaps, ([lower, higher]) => {
			if (stemDirection === "down") {
				lower.group.translate(-Scored.config.note.head.width, 0);
			} else {
				higher.group.translate(Scored.config.note.head.width, 0);
			}
		});
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
