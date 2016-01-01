import _ from "lodash";

import {drawFlag, getFlagOffset, drawStaccato, drawTenuto} from "../engraver";
import {getSteps, parsePitch} from "../utils/note";
import {defaultStemPoint, getStemLength, getOverlappingNotes, getAccidentalOrdering} from "../utils/chord";
import {map, isEven} from "../utils/common";
import {getAccidentalTop, getAccidentalBottom, calculateDefaultAccidentalPosition, getArticulationPoint} from "../utils/placement";
import {getAccidental} from "../utils/accidental";
import constants from "../constants";
import Note from "./Note";

const TYPE = constants.type.chord;
const UP = "up";
const DOWN = "down";

/*
 * @param children - Array of notes. Can take several representations. String, Object, or Note.
 */
function Chord ({value=4, dots=0, tuplet, time, root, name, inversion, staccato, tenuto, portato, stemDirection}, children=[]) {
	this.value = value;
	this.dots = dots;
	this.tuplet = tuplet;
	this.time = time;
	this.root = root;
	this.name = name;
	this.inversion = inversion;

	// articulations
	this.staccato = staccato;
	this.tenuto = tenuto;
	this.portato = portato;

	this.stemDirection = stemDirection;

	this.children = parseChildren(children, {value});
}

Chord.prototype.type = TYPE;

Chord.render = function (chord, context) {
	let group = chord.render();
	Chord.renderAccidentals(chord, context);
	chord.renderStem();
	return group;
};

// render accidentals from outside in. Closest accidental always starts at highest note.
// translate the accidental left based on the number of accidental overlaps.
// FIXME: this has to take into consideration accidentals from other voices.
Chord.renderAccidentals = function (chord, context={}) {
	// get the accidental to be rendered on each note.
	let accidentals = _.map(chord.children, (note) => {
		let parsedPitch = parsePitch(note.pitch);
		return context.key ? getAccidental(parsedPitch, context.accidentals, context.key) : parsedPitch.accidental;
	});

	// calculate the default position of all the accidentals
	let positions = _.map(chord.children, calculateDefaultAccidentalPosition);
	// get default leftmost accidental. All other accidentals will be set to this position before translating because of overlaps
	let startingXPos = _.min(positions, position => position.x).x;

	// render the accidentals in their default location.
	let accidentalGroups = map((note, accidental, position) => {
		let accidentalGroup = note.drawAccidental(accidental);
		accidentalGroup.translate(startingXPos, position.y);
		return accidentalGroup;
	}, chord.children, accidentals, positions);

	let renderOrder = getAccidentalOrdering(chord.children.length);

	// translate the accidentals to avoid overlaps if needed.
	let translationDepth = 1;
	_.each(renderOrder, (idx, i) => {
		let accidental = accidentalGroups[idx];
		let neighbor = accidentalGroups[renderOrder[i+1]];

		if (neighbor) {
			if (isEven(i)) {
				if (getAccidentalBottom(accidental) > getAccidentalTop(neighbor)) {
					neighbor.translate(-Scored.config.note.accidental.xOffset * translationDepth, 0);
					translationDepth++;
				}
			} else {
				if (getAccidentalTop(accidental) < getAccidentalBottom(neighbor)) {
					neighbor.translate(-Scored.config.note.accidental.xOffset * translationDepth, 0);
					translationDepth++;
				}
			}
		}
	});
};

Chord.prototype.renderStem = function (centerLineValue, stemDirection) {
	if (this.needsStem()) {
		stemDirection = stemDirection || this.getStemDirection(centerLineValue);
		let stemPoint = defaultStemPoint(this, stemDirection, getStemLength(this, centerLineValue));
		this.drawStem(stemPoint, stemDirection);
		this.drawFlag();
	}
};

Chord.prototype.render = function () {
	const group = this.group = new paper.Group({name: TYPE});

	let stemDirection = this.getStemDirection(),
		overlaps = getOverlappingNotes(this);

	// get steps
	let [root, ...rest] = stemDirection === UP ? this.children : _.clone(this.children).reverse();

	let noteGroups = this.children.map(note => note.render());

	let translationFn;

	// translate note if they overlap
	if (stemDirection === DOWN) {
		const xTranslation = -Scored.config.note.head.width;
		translationFn = (overlaps) => {
			let translated = [];
			_.each(_.clone(overlaps).reverse(), ([lower, higher]) => {
				if (!_.some(translated, n => n === higher)) {
					lower.group.translate(xTranslation, 0);
					translated.push(lower);
				}
			});
		};
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
		};
	}

	if (overlaps.length) {
		translationFn(overlaps);
	}

	_.each(rest, note => {
		let steps = getSteps(note.pitch, root.pitch);
		note.group.translate(0, steps * Scored.config.layout.stepSpacing);
	});

	group.addChildren(noteGroups);

	return group;
};

Chord.prototype.drawStem = function (to, stemDirection) {
	let frm, stem;

	if (stemDirection === UP) {
		this.stemDirection = UP;
		frm = this.children[0].noteHead.bounds.rightCenter.add(0, Scored.config.note.head.yOffset);
	} else {
		this.stemDirection = DOWN;
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
};

/*
 * The stem must already be rendered for this to work.
 * @return paper.Group
 */
Chord.prototype.drawFlag = function () {
	let dur = this.value,
		stem = this.group.children.stem,
		flag, position;

	let flagSymbol = drawFlag(dur, this.stemDirection);

	if (flagSymbol) {
		// FIXME: getFlagOffset should probably be in placement rather than engraver.
		position = getFlagOffset(stem.segments[1].point, this.stemDirection);
		flag = flagSymbol.place(position);
		this.group.addChild(flag);
	}

	return flag;
};

/*
 * Draws leger lines on the notes that need them
 * @param centerLine - Point representing the center line.
 * @param lineSpacing - Number, space between each line.
 */
Chord.prototype.drawLegerLines = function (centerLine, lineSpacing) {
	this.children.map(note => note.drawLegerLines(centerLine, lineSpacing));
};

/*
 * @return Boolean - true if the note needs a stem drawn, False otherwise.
 */
Chord.prototype.needsStem = function () {
	return this.value >= 2;
};

/*
 * @return Boolean - true if the note needs a flag drawn, False otherwise.
 */
Chord.prototype.needsFlag = function () {
	return this.value >= 8;
};

/*
 * @param centerLineValue - String note pitch of center line.
 * @return String
 */
Chord.prototype.getStemDirection = function (centerLineValue) {
    if (this.stemDirection) {
		return this.stemDirection;
	} else if (centerLineValue) {
        if (this.children.length === 1) {
            return getSteps(centerLineValue, this.children[0].pitch) < 0 ? UP : DOWN;
        }
        // stem direction will be the the direction of the note that is furthest from the center line. Tie goes down.
        let firstSteps = getSteps(centerLineValue, this.children[0].pitch),
            lastSteps = getSteps(centerLineValue, _.last(this.children).pitch);

        if (firstSteps < 0 && lastSteps < 0) {
            return UP;
        } else if (firstSteps >= 0 && lastSteps >= 0) {
            return DOWN;
        } else {
            return (Math.abs(firstSteps) > Math.abs(lastSteps)) ? UP : DOWN;
        }
	} else {
		return UP;
	}
};

Chord.prototype.drawArticulations = function () {
	const point = (this.staccato || this.tenuto || this.portato) ?
		getArticulationPoint(this.getBaseNote(this.stemDirection), this.stemDirection)
		: null;

	if (this.staccato) {
		const stacato = drawStaccato(point);
		this.group.addChild(stacato);
	}

	if (this.tenuto) {
		const legato = drawTenuto(point);
		this.group.addChild(legato);
	}

	if (this.portato) {
		const stacato = drawStaccato(point);
		this.group.addChild(stacato);
		if (!this.slur) {
			// draw tenuto
		}
	}
};

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

/*
 * @param direction - UP DOWN
 * @return Note that is at the end of the stem. either lowest or highet note.
 */
Chord.prototype.getBaseNote = function (direction) {
	return direction === UP ? this.children[0] : _.last(this.children);
}

Chord.prototype.calculateStemPoint = function (fulcrum, vector, direction) {
	const baseNote = this.getBaseNote(direction);
	return baseNote.calculateStemPoint(fulcrum, vector, direction);
};

export default Chord;
