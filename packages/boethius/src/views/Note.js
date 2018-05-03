import paper from "paper";
import teoria from "teoria";
import _ from "lodash";

import * as engraver from "../engraver";
import {getLinePoint} from "../utils/geometry";
import * as placement from "../utils/placement";
import * as noteUtils from "../utils/note";
import {getAccidental} from "../utils/accidental";
import constants from "../constants";
import {getCenterLineValue} from "./Clef";
import {isEven} from "../utils/common";
import {noteEquals} from "../utils/equality";

const TYPE = constants.type.note;

/*
 * Context contains all of the information that come from parsing of music json.
 * Only items on the context will be saved back to the music json.
 * All other properties on the view will need to be calculated at runtime.
 */
function Note ({pitch, pitchClass="a", octave=4, value=4, dots=0, slur, tuplet, time, legato, staccato, tenuto, portato, voice}) {

	this.pitch = pitch || (pitchClass + octave);
	this.pitchClass = pitchClass;
	this.octave = this.octave;
	// FIXME: doesn't get cloned. Possible bugs could result.
	this.note = teoria.note(this.pitch, {value: value, dots: dots});
	this.value = value;
	this.dots = dots;
	this.tuplet = tuplet;
	this.time = time;
	this.voice = voice;
	this.slur = slur;
	this.legato = legato;

	// articulations
	this.staccato = staccato;
	this.tenuto = tenuto;
	this.portato = portato;
}

Note.prototype.type = TYPE;

Note.render = function (note, context={}) {
	let group = note.render(context);
	Note.renderAccidental(note, context.accidentals, context.key);
	note.renderStem();
	return group;
};

Note.renderAccidental = function (note, accidentals, key) {
	let parsedPitch = noteUtils.parsePitch(note.pitch);
	let accidental = key ? getAccidental(parsedPitch, accidentals, key) : parsedPitch.accidental;
	if (!_.isUndefined(accidental)) {
		let position = placement.calculateDefaultAccidentalPosition(note);
		let accidentalGroup = note.drawAccidental(accidental);
		accidentalGroup.translate(position);
	}
};

Note.renderDots = function (note, clef) {
	if (note.dots) {
		note.drawDots(note.dots, clef);
	}
};

Note.prototype.renderStem = function (centerLineValue, stemDirection) {
	if (this.needsStem()) {
		stemDirection = stemDirection || this.getStemDirection(centerLineValue);
		const stemPoint = noteUtils.defaultStemPoint(this, stemDirection, noteUtils.getStemLength(this, centerLineValue, stemDirection));
		this.drawStem(stemPoint, stemDirection);
		this.drawFlag();
	}
};

Note.prototype.render = function () {
	const group = this.group = new paper.Group({
		name: TYPE
	});

	// xPos and yPos are the center of the font item, not the noteHead. placement will take care of handling the offset for now.
	const offset = placement.getNoteHeadOffset([0, 0]);
	const noteHead = this.noteHead = engraver.drawHead(1/this.value);
	noteHead.position = offset;

	group.addChild(noteHead); // commenting this line removed the Group mem leak.

	return group;
};

/*
 * @return Boolean - true if the note needs a stem drawn, False otherwise.
 */
Note.prototype.needsStem = function () {
	return this.note.duration.value >= 2;
};

/*
 * @return Boolean - true if the note needs a flag drawn, False otherwise.
 */
Note.prototype.needsFlag = function () {
	return this.note.duration.value >= 8;
};

Note.prototype.drawLegerLines = function (centerLine, lineSpacing) {
	const legerLines = engraver.drawLegerLines(this.noteHead, centerLine, lineSpacing);
	if (legerLines){
		this.group.addChild(legerLines);
	}
};

Note.prototype.drawGroupBounds = function () {
	const rect = new paper.Rectangle(this.group.bounds);
	rectangle.right += 5;

	const rectangle = new paper.Path.Rectangle({
		name: "bounds",
		rectangle: rect
	});
	rectangle.fillColor = "#FFF"; // create a fill so the center can be clicked
	rectangle.opacity = 0;

	this.group.insertChild(0, rectangle);
};

Note.prototype.drawStem = function (to, stemDirection) {
	let frm, stem;

	if (stemDirection === "up") {
		this.stemDirection = "up";
		frm = this.noteHead.bounds.rightCenter.add(0, Scored.config.note.head.yOffset);
	} else {
		this.stemDirection = "down";
		// this.noteHead.rotate(180);
		frm = this.noteHead.bounds.leftCenter.add(0, Scored.config.note.head.yOffset);
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
 * The Stem must already be rendered for this to work.
 * @return paper.Group
 */
Note.prototype.drawFlag = function () {
	let dur = this.value,
		stem = this.group.children.stem;

	// let flagSymbol = engraver.drawFlag(dur, this.stemDirection);
	const flag = engraver.drawFlag(dur, this.stemDirection);

	if (flag) {
		flag.position = engraver.getFlagOffset(stem.segments[1].point, this.stemDirection);
		this.group.addChild(flag);
	}

	return flag;
};

Note.prototype.drawAccidental = function (accidental) {
	const accidentalGroup = engraver.drawAccidental(accidental);
	accidentalGroup.position = [0, 0];

	this.group.addChild(accidentalGroup);

	return accidentalGroup;
};

/*
 * @param dots - the number of dots to draw.
 * @param clef - the Clef the note is placed on
 * @param xPos - Number representing the xPosition of the note.
 */
Note.prototype.drawDots = function (dots, clef, xPos) {
	const centerLineValue = getCenterLineValue(clef);
	const steps = noteUtils.getSteps(centerLineValue, this.pitch);
	const noteHeadCenterY = this.noteHead.bounds.center.y + Scored.config.note.head.yOffset;
	// if steps is odd then the note is on a line. needs to be position so it doesn't overlap with the line.
	const yPos = isEven(steps) ?
		noteHeadCenterY - Scored.config.layout.stepSpacing :
		noteHeadCenterY;

	let point;
	if (xPos) {
		point = new paper.Point(xPos, yPos);
	} else {
		point = new paper.Point(this.noteHead.bounds.right + (Scored.config.note.head.width / 2), yPos);
	}

	const dotGroups = engraver.drawDots(point, dots);
	this.group.addChildren(dotGroups);
};

Note.prototype.drawArticulations = function () {
	const point = (this.staccato || this.tenuto || this.portato) ? placement.getArticulationPoint(this, this.stemDirection) : null;

	if (this.staccato) {
		const stacato = engraver.drawStaccato(point);
		this.group.addChild(stacato);
	}

	if (this.tenuto) {
		const legato = engraver.drawTenuto(point);
		this.group.addChild(legato);
	}

	if (this.portato) {
		const stacato = engraver.drawStaccato(point);
		this.group.addChild(stacato);
		if (!this.slur) {
			// draw tenuto
		}
	}
};

/*
 * @param centerLineValue - String note pitch of center line.
 */
Note.prototype.getStemDirection = function (centerLineValue) {
	if (this.stemDirection) {
		return this.stemDirection;
	} else if (centerLineValue) {
		return noteUtils.getSteps(centerLineValue, this.pitch) < 0 ? "up" : "down";
	} else {
		return "up";
	}
};

Note.prototype.calculateStemPoint = function (fulcrum, vector, direction) {
	// get the beam point at the center of the noteHead
	return getLinePoint((direction === "up" ? this.noteHead.bounds.right : this.noteHead.bounds.left), fulcrum, vector);
};

/*
 * @return true if the this note is equivalent to the given note.
 */
Note.prototype.equals = function (note) {
	return noteEquals(this, note);
};

export default Note;
