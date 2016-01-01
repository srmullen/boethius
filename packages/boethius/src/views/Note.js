import teoria from "teoria";
import _ from "lodash";

import * as engraver from "../engraver";
import {getLinePoint} from "../utils/geometry";
import * as placement from "../utils/placement";
import * as noteUtils from "../utils/note";
import {getAccidental} from "../utils/accidental";
import constants from "../constants";

const TYPE = constants.type.note;

/*
 * Context contains all of the information that come from parsing of music json.
 * Only items on the context will be saved back to the music json.
 * All other properties on the view will need to be calculated at runtime.
 */
function Note ({pitch="a4", value=4, dots=0, slur, tuplet, time, staccato, tenuto, voice}) {

	this.note = teoria.note(pitch || "a4", {value: value, dots: dots});
	this.value = value;
	this.pitch = pitch;
	this.dots = dots;
	this.tuplet = tuplet;
	this.time = time;
	this.voice = voice;
	this.slur = slur;
	this.staccato = staccato;
	this.tenuto = tenuto;
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

Note.prototype.renderStem = function (centerLineValue, stemDirection) {
	if (this.needsStem()) {
		stemDirection = stemDirection || this.getStemDirection(centerLineValue);
		let stemPoint = noteUtils.defaultStemPoint(this, stemDirection, noteUtils.getStemLength(this, centerLineValue));
		this.drawStem(stemPoint, stemDirection);
		this.drawFlag();
	}
};

Note.prototype.render = function () {
	const group = this.group = new paper.Group({
		name: TYPE
	});

	this.symbol = engraver.drawHead(1/this.note.duration.value);

	// If the note has already been rendered remove any children so it is ready to be rendered again.
	group.removeChildren();

	// xPos and yPos are the center of the font item, not the noteHead. placement will take care of handling the offset for now.
	const offset = placement.getNoteHeadOffset([0, 0]);
	const noteHead = this.noteHead = this.symbol.place(offset);

	group.addChild(noteHead);

	if (this.note.duration.dots) {
		const dots = engraver.drawDots(noteHead, this.note.duration.dots);
		group.addChild(dots);
	}

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
		stem = this.group.children.stem,
		flag, position;

	let flagSymbol = engraver.drawFlag(dur, this.stemDirection);

	if (flagSymbol) {
		position = engraver.getFlagOffset(stem.segments[1].point, this.stemDirection);
		flag = flagSymbol.place(position);
		this.group.addChild(flag);
	}

	return flag;
};

Note.prototype.drawAccidental = function (accidental) {
	let accidentalSymbol = engraver.drawAccidental(accidental);

	// accidentalGroup = accidentalSymbol.place(position);
	let accidentalGroup = accidentalSymbol.place();

	this.group.addChild(accidentalGroup);

	return accidentalGroup;
};

Note.prototype.drawArticulations = function () {
	if (this.staccato) {
		const offset = this.stemDirection === "up" ? Scored.config.layout.lineSpacing : -Scored.config.layout.lineSpacing;
		const point = this.noteHead.bounds.center.add(0, Scored.config.note.head.yOffset + offset);
		const stacato = engraver.drawStaccato(point);
		this.group.addChild(stacato);
	}

	if (this.tenuto) {
		const offset = this.stemDirection === "up" ? Scored.config.layout.lineSpacing : -Scored.config.layout.lineSpacing;
		const point = this.noteHead.bounds.center.add(0, Scored.config.note.head.yOffset + offset);
		const legato = engraver.drawTenuto(point);
		this.group.addChild(legato);
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

export default Note;
