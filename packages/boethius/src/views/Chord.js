import paper from "paper";
import _ from "lodash";

import {drawFlag, getFlagOffset, drawStaccato, drawTenuto} from "../engraver";
import {getSteps, parsePitch} from "../utils/note";
import {defaultStemPoint, getStemLength, getOverlappingNotes, getAccidentalOrdering} from "../utils/chord";
import {map, isEven} from "../utils/common";
import {getAccidentalTop, getAccidentalBottom, calculateDefaultAccidentalPosition, getArticulationPoint} from "../utils/placement";
import {getAccidental} from "../utils/accidental";
import constants from "../constants";
import Note from "./Note";
import {getCenterLineValue} from "./Clef";

const TYPE = constants.type.chord;
const UP = "up";
const DOWN = "down";

/*
 * @param children - Array of notes. Can take several representations. String, Object, or Note.
 */
function Chord ({value=4, dots=0, tuplet, time, root, name, inversion, staccato, legato, tenuto, portato, slur, stemDirection}, children=[]) {
	this.value = value;
	this.dots = dots;
	this.tuplet = tuplet;
	this.time = time;
	this.root = root;
	this.name = name;
	this.inversion = inversion;

	// articulations
	this.staccato = staccato;
	this.legato = legato;
	this.tenuto = tenuto;
	this.portato = portato;
	this.slur = slur;

	this.stemDirection = stemDirection;

	this.children = parseChildren(children, {value});
}

Chord.prototype.type = TYPE;

Chord.render = function (chord, context) {
	const group = chord.render(context);
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
	let startingXPos = _.minBy(positions, position => position.x).x;

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
		const stemPoint = defaultStemPoint(this, stemDirection, getStemLength(this, centerLineValue, stemDirection));
		this.drawStem(stemPoint, stemDirection);
		this.drawFlag();
	}
};

Chord.prototype.render = function (context) {
	const group = this.group = new paper.Group({name: TYPE});

	const stemDirection = this.getStemDirection(getCenterLineValue(context.clef));
	const overlaps = getOverlappingNotes(this);

	// get steps
	const [root, ...rest] = this.children;

	let noteGroups = this.children.map(note => note.render(context));

	let translationFn;

	// translate note if they overlap
	if (stemDirection === DOWN) {
		const xTranslation = -Scored.config.note.head.width;
		translationFn = (overlaps) => {
			const translated = [];
			_.each(_.clone(overlaps).reverse(), ([lower, higher]) => {
				if (!_.some(translated, n => n === higher)) {
					lower.group.translate(xTranslation, 0);
					translated.push(lower);
				}
			});
			return translated;
		};
	} else {
		const xTranslation = Scored.config.note.head.width;
		translationFn = (overlaps) => {
			const translated = [];
			_.each(overlaps, ([lower, higher]) => {
				if (!_.some(translated, n => n === lower)) {
					higher.group.translate(xTranslation, 0);
					translated.push(higher);
				}
			});
			return translated;
		};
	}

	let translated;
	if (overlaps.length) {
		translated = translationFn(overlaps);
	}

	_.each(rest, note => {
		const steps = getSteps(note.pitch, root.pitch);
		note.group.translate(0, steps * Scored.config.layout.stepSpacing);
	});

	group.addChildren(noteGroups);

	if (this.dots) {
		const rightMostNote = (translated && translated.length && stemDirection === UP) ?
			translated[0] :
			this.getBaseNote(stemDirection);
		const xPos = rightMostNote.noteHead.bounds.right + Scored.config.note.head.width / 2;

		_.each(this.children, (note) => {
			note.drawDots(this.dots, context.clef, xPos);
		});
	}

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
	const dur = this.value;
	const stem = this.group.children.stem;

	const flag = drawFlag(dur, this.stemDirection);

	if (flag) {
		// FIXME: getFlagOffset should probably be in placement rather than engraver.
		flag.position = getFlagOffset(stem.segments[1].point, this.stemDirection);
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
		if (note instanceof Note) {
			note.value = defaults.value;
			return note;
		}

		if (_.isString(note)) {
			return new Note(_.assign({}, defaults, {pitch: note}));
		}

		if (_.isObject(note)) {
			return new Note(_.assign({}, defaults, note, {value: defaults.value}));
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
};

Chord.prototype.calculateStemPoint = function (fulcrum, vector, direction) {
	const baseNote = this.getBaseNote(direction);
	return baseNote.calculateStemPoint(fulcrum, vector, direction);
};

Chord.prototype.getTop = function () {
	const stemDirection = this.getStemDirection();
	if (stemDirection === UP) {
		return this.group.children.stem.segments[1].point;
	} else {
		const baseNote = this.getBaseNote(stemDirection);
		return baseNote.getTop();
	}
};

Chord.prototype.getBottom = function () {
	const stemDirection = this.getStemDirection();
	if (stemDirection === UP) {
		// return this.group.children.stem.segments[1].point;
		const baseNote = this.getBaseNote(stemDirection);
		return baseNote.getBottom();
	} else {
		// const baseNote = this.getBaseNote(stemDirection);
		// return baseNote.getTop();
		return this.group.bounds.bottomCenter;
	}
};

Chord.prototype.equals = function (chord) {
	// chord.root, chord.inversion, and chord.name are not compared right now since they have no bearing on rendering.
	return (
		this.type === chord.type &&
		this.value === chord.value &&
		this.dots === chord.dots &&
		this.tuplet === chord.tuplet &&
		this.time === chord.time &&
		this.staccato === chord.staccato &&
		this.tenuto === chord.tenuto &&
		this.portato === chord.portato &&
		this.slur === chord.slur &&
		this.stemDirection === chord.stemDirection &&
		this.children.length === chord.children.length &&
		_.every(this.children, (child, i) => child.equals(chord.children[i]))
	);
};

export default Chord;
