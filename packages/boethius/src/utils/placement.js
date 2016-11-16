import _ from "lodash";
import * as timeUtils from "./timeUtils";
import constants from "../constants";
import {isNote, isDynamic, isMarking} from "../types";

const noteNameToDegreeObj = {
		"c": 0,
		"d": 1,
		"e": 2,
		"f": 3,
		"g": 4,
		"a": 5,
		"b": 6
	},
	clefBases = {
		treble: {pitch: "C", degree: 0, octave: 5, offset: 3},
		bass:   {pitch: "F", degree: 3, octave: 3, offset: 2},
		alto:   {pitch: "C", degree: 0, octave: 4, offset: 4},
		tenor:  {pitch: "C", degree: 0, octave: 4, offset: 2}
	},
	lineNamesObj = {
		treble: ["f", "e", "d", "c", "b", "a", "g", "f", "e"],
		base:   ["a", "g", "f", "e", "d", "c", "b", "a", "g"],
		alto:   ["g", "f", "e", "d", "c", "b", "a", "g", "f"],
		tenor:  ["e", "d", "c", "b", "a", "g", "f", "e", "d"]
	};


function noteNameToDegree (name) {
	return noteNameToDegreeObj[name];
}

function getClefBase (clef) {
	return clefBases[clef];
}

/*
 * @return {Array}
   treble:
 	f---
 	e
 	d---
 	c
 	b---   => ["f", "e", "d", "c", "b", "a", "g", "f", "e"]
 	a
 	g---
 	f
 	e---
 */
function getLineNames (clef) {
	return lineNamesObj[clef];
}

/*
 * @param note {String}
 */
function calculateAccidentalYpos (degree, step) {
	return degree * step;
}

/*
 * @param note {Note}
 * @param set {Number} - distance between each note
 */
function calculateNoteYpos (note, step, clefBase, offset=0) {
	const octave = note.note.octave();
	const degree = noteNameToDegree(note.note.name());
	// 4 is the offset (number of steps) of the center line.
	// the clefBase offset it subtracted to normalize to the centerline, since the note is rendered from the centerLine.
	const diffY = (clefBase.degree + (clefBase.octave * 7)) - (degree + (octave * 7)) - (4 - clefBase.offset);
	return (diffY + offset) * step;
}

/*
 * @return {Point} the position to draw the font so the center of the noteHead is at the given position.
 */
function getNoteHeadOffset (position) {
	return new paper.Point(position).subtract(0, Scored.config.note.head.yOffset);
}

/*
 * @param position {Point} - the center of the PointText
 * @return {Point} The position of the center of the noteHead.
 */
function getNoteHeadCenter (position) {
	return position.add(0, Scored.config.note.head.yOffset);
}

/*
 * @param note - Note
 * @return Point
 */
function getArticulationPoint (note, stemDirection) {
	const offset = stemDirection === "up" ? Scored.config.layout.lineSpacing : -Scored.config.layout.lineSpacing;
	return note.noteHead.bounds.center.add(0, Scored.config.note.head.yOffset + offset);
}

/*
 * Could probably use a better name.
 * takes an array of items and translates them so the right bound of the left item lines up with the
 * left bound of the right item.
 */
function lineup (items) {
	let left, right, offset;
	// items needs to have at least two items.
	for (let i = 1; i < items.length; i++) {
		left = items[i-1]; right = items[i];
		offset = (right.bounds.center.x - right.bounds.left) +
				(left.bounds.right - left.bounds.center.x);
		right.position.x = left.position.x + offset;
	}
}

/*
 * Places the left bound of the item at cursor.
 * @param cursor - Number
 * @param item - Scored item.
 */
function placeAt (cursor, item) {
	if (isNote(item) && item.note.accidental()) {
		const offset = (item.noteHead.bounds.center.x - item.noteHead.bounds.left);
		item.group.position.x = cursor + offset;
	} else if (isDynamic(item)){
		const xOffset = 5;
		item.group.bounds.center.x = cursor + xOffset;
	} else {
		const offset = (item.group.bounds.center.x - item.group.bounds.left);
		item.group.position.x = cursor + offset;
	}
}

const offsets = {
	clef: function ({value}) {
		return {
			treble: 0,
			bass: -17,
			alto: -9,
			tenor: -18
		}[value];
	},
	key: function () {
		return -9;
	},
	timeSig: function ({value}) {
		if (value === "c" || value === "h") {
			return -9;
		} else {
			return 0;
		}
	},
	rest: function ({value}) {
		if (value === 1) {
			// return -Scored.config.layout.lineSpacing/2;
			return 0;
		} else {
			return Scored.config.layout.lineSpacing;
		}
	}
};

/*
 *
 */
function getYOffset (item) {
	const offsetFn = offsets[item.type] || (() => 0);

	return offsetFn(item);
}

function calculateCursor (item1) {
	const noteHeadWidth = Scored.config.note.head.width,
		shortestDuration = 0.125;

	let cursor;

	if (isMarking(item1)) {
		// FIXME: needs a little work for perfect positioning
		cursor = item1.group.children.length ? item1.group.bounds.right + noteHeadWidth : cursor;
	} else if (item1.type === constants.type.measure) {
		let leftBarline = item1.barlines[0];
		cursor = leftBarline.position.x + noteHeadWidth;
	} else {
		cursor = item1.group.bounds.right + (noteHeadWidth * getStaffSpace(shortestDuration, item1));
	}

	return cursor;
}

/*
 * Aligns the notes so they are all at the same x position.
 * @param xPos - Number
 * @param notes - <Note, Chord>[]
 */
function alignNoteHeads (xPos, items) {
	_.each(items, item => {
		let note = isNote(item) ? item : item.children[0];
		let offset = xPos - note.noteHead.bounds.center.x;

		item.group.translate([offset, 0]);
	});
}

// The most common shortest duration is determined as follows: in every measure, the shortest duration is determined.
// The most common shortest duration is taken as the basis for the spacing, with the stipulation that this shortest
// duration should always be equal to or shorter than an 8th note.
/*
 * @param notes
 */
function commonShortestDuration () {

}

/*
 * returns the amount to multiply note head width by. Doubles
 * @param shortestDuration - Number representing
 */
function getStaffSpace (shortestDuration, item) {
	const duration = timeUtils.calculateDuration(item);
	if (duration < shortestDuration) {
		return 1;
	} else {
		return 1 + Math.log2(duration / shortestDuration);
	}
}

// TODO: get correct values for all offsets.
const accidentalTopOffsets = {};
accidentalTopOffsets[constants.font.accidentals.sharp] = 10;
accidentalTopOffsets[constants.font.accidentals.flat] = 10;
accidentalTopOffsets[constants.font.accidentals.doubleFlat] = 10;
accidentalTopOffsets[constants.font.accidentals.doubleSharp] = 10;
accidentalTopOffsets[constants.font.accidentals.natural] = 10;

/*
 * The accidentals group bounds don't align exactly to it's perimeter.
 * This function handles the difference.
 */
function getAccidentalTop (accidental) {
	return accidental.bounds.top + accidentalTopOffsets[accidental.content];
}

function getAccidentalBottom (accidental) {
	return accidental.bounds.bottom;
}

/*
 * @param note - Note
 * @return Point - the default position to place the accidental for the given note.
 */
function calculateDefaultAccidentalPosition (note) {
	return getNoteHeadCenter(note.noteHead.bounds.center).add(-Scored.config.note.accidental.xOffset, Scored.config.note.accidental.yOffset);
}

/*
 * @param items - RenderedItem[]
 * @param shortestDuration - Number
 * @return - pixel length of the time frame.
 */
function calculateTimeLength (items, shortestDuration) {
	const noteHeadWidth = Scored.config.note.head.width;
	const [markings, voiceItems] = _.partition(items, isMarking);
	const {
		clef: clefs,
		key: keys,
		timeSig: timeSigs
	} = _.groupBy(markings, item => item.type);
	const getMarkingWidth = (marking) => marking.group.bounds.width + noteHeadWidth;
	const clefLength = clefs ? _.max(clefs.map(getMarkingWidth)) : 0;
	const keyLength = keys ? _.max(keys.map(getMarkingWidth)) : 0;
	const timeSigLength = timeSigs ? _.max(timeSigs.map(getMarkingWidth)) : 0;
	const markingsLength = _.sum([clefLength, keyLength, timeSigLength]);
	// dynamics should affect measure length. remove them.
	const voiceItemLengths = _.map(_.reject(voiceItems, isDynamic), item => {
		return item.group.bounds.width + (noteHeadWidth * getStaffSpace(shortestDuration, item));
	});
	const totalVoiceItemsLength = voiceItemLengths.length ? _.min(voiceItemLengths) : 0;

	return [markingsLength, totalVoiceItemsLength];
}

function placeMarking (lineCenter, cursor, marking) {
	marking.group.translate(lineCenter.add([0, getYOffset(marking)]));
	placeAt(cursor, marking);
	// since keys of C and a have no children calculateCursor return undefined.
	return calculateCursor(marking) || cursor;
}

/*
 * Increases the new cursors position by the scale factor.
 */
function scaleCursor (scale, oldCursor, newCursor) {
	return oldCursor + (newCursor - oldCursor) * scale;
}

export {
	calculateNoteYpos,
	calculateAccidentalYpos,
	getNoteHeadOffset,
	getNoteHeadCenter,
	getClefBase,
	getLineNames,
	lineup,
	getYOffset,
	commonShortestDuration,
	getStaffSpace,
	calculateCursor,
	placeAt,
	alignNoteHeads,
	getAccidentalTop,
	getAccidentalBottom,
	calculateDefaultAccidentalPosition,
	calculateTimeLength,
	placeMarking,
	scaleCursor,
	getArticulationPoint
};
