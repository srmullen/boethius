import engraver from "../engraver";
import * as common from "../utils/common";
import * as placement from "../utils/placement";
import * as noteUtils from "../utils/note";
import teoria from "teoria";
import constants from "../constants";

const TYPE = constants.type.note;

/*
 * Context contains all of the information that come from parsing of music json.
 * Only items on the context will be saved back to the music json.
 * All other properties on the view will need to be calculated at runtime.
 */
function Note ({pitch="a4", value=4, dots=0, tuplet, time, voice}) {

	this.note = teoria.note(pitch || "a4", {value: value, dots: dots});
	this.value = value;
	this.pitch = pitch;
	this.voice = voice; // Should this be here since a voice object has been created?
	this.dots = dots;
	this.tuplet = tuplet;
	this.time = time;
}

Note.prototype.type = TYPE;

Note.prototype.render = function (position) {
	const group = this.group = new paper.Group({
		name: TYPE
	});

	this.symbol = engraver.drawHead(1/this.note.duration.value);

	common.addEvents(this);

	// If the note has already been rendered remove any children so it is ready to be rendered again.
	group.removeChildren();

	// xPos and yPos are the center of the font item, not the noteHead. placement will take care of handling the offset for now.
	var offset = placement.getNoteHeadOffset(position),
		noteHead = this.noteHead = this.symbol.place(offset);

	group.addChild(noteHead);

	// this.drawLegerLines(barLine, lineSpacing);

	if (this.note.duration.dots) {
		let dots = engraver.drawDots(noteHead, this.note.duration.dots);
		group.addChild(dots);
	}

	// if (this.context.stacato) {
	// 	let stacato = engraver.drawStacato();
	// 	group.addChild(stacato);
	// }
	//
	// if (this.context.legato) {
	// 	let legato = engraver.drawLegato();
	// 	group.addChild(legato);
	// }

	if (this.note.accidental()) {
		var accidentalSymbol = engraver.drawAccidental(this.note.accidental());
		let position = placement.getNoteHeadCenter(noteHead.bounds.center)
								.add(-Scored.config.note.accidental.xOffset, Scored.config.note.accidental.yOffset);
		group.addChild(accidentalSymbol.place(position));
	}

	this.drawGroupBounds();

	return group;
};

Note.prototype.drawLegerLines = function (centerLine, lineSpacing) {
	var legerLines = engraver.drawLegerLines(this.noteHead, centerLine, lineSpacing);
	if (legerLines){
		this.group.addChild(legerLines);
	}
};

Note.prototype.drawGroupBounds = function () {
	var rectangle = new paper.Rectangle(this.group.bounds);
	rectangle.right += 5;

	rectangle = new paper.Path.Rectangle({
		name: "bounds",
		rectangle: rectangle
	});
	rectangle.fillColor = "#FFF"; // create a fill so the center can be clicked
	rectangle.opacity = 0;

	this.group.insertChild(0, rectangle);
};

Note.prototype.drawStem = function (to, stemDirection) {
	var frm, stem;

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
}

/*
 * @param point - optional point to draw the flag to.
 */
Note.prototype.drawFlag = function (point) {
	var dur = this.note.duration.value,
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

export default Note;
