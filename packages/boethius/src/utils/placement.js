let noteNameToDegreeObj = {
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
		alto:   {},
		tenor:  {}
	},
	lineNamesObj = {
		treble: ["f", "e", "d", "c", "b", "a", "g", "f", "e"],
		base:   ["a", "g", "f", "e", "d", "c", "b", "a", "g"],
		alto:   ["g", "f", "e", "d", "c", "b", "a", "g", "f"],
		tenor:  ["e", "d", "c", "b", "a", "g", "f", "e", "d"]
	}


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
	// var clefBase = getClefBase(clef),
	// 	lineNames = getLineNames(clef),
	// 	lineIndex = _.indexOf(lineNames, note)
		// octave = clefBase.octave,
		// degree = noteNameToDegree(note);
	// 4 is the offset (number of steps) of the center line.
	// the clefBase offset it subtracted to normalize to the centerline, since the note is rendered from the centerLine.
	// var diffY = (clefBase.degree + (clefBase.octave * 7)) - (degree + (octave * 7)) - (4 - clefBase.offset);

	return degree * step;
}

/*
 * @param note {Note}
 * @param set {Number} - distance between each note
 */
function calculateNoteYpos (note, step, clefBase) {
	let octave = note.note.octave(),
		degree = noteNameToDegree(note.note.name());
	// 4 is the offset (number of steps) of the center line.
	// the clefBase offset it subtracted to normalize to the centerline, since the note is rendered from the centerLine.
	let diffY = (clefBase.degree + (clefBase.octave * 7)) - (degree + (octave * 7)) - (4 - clefBase.offset);
	return diffY * step;
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
 * Could probably use a better name.
 * takes an array of items and translates them so the right bound of the left item lines up with the
 * left bound of the right item.
 */
function lineup (items) {
	var left, right, offset;
	// items needs to have at least two items.
	for (var i = 1; i < items.length; i++) {
		left = items[i-1]; right = items[i];
		offset = (right.bounds.center.x - right.bounds.left) +
				 (left.bounds.right - left.bounds.center.x);
		// right.setPosition(left.group.position.add([offset, 0]));
		right.position.x = left.position.x + offset;
	}
}

var offsets = {
	clef: function ({value}) {
		return {
			treble: 0,
			bass: -17,
			alto: -9,
			tenor: -18
		}[value];
	},
	key: function (item) {
		return -9;
	},
	timeSig: function ({value}) {
		if (value === "c" || value === "h") {
			return -9;
		} else {
			return 0;
		}
	}
}

function getYOffset (item, position) {
	let offsetFn = offsets[item.type] || () => 0;
	return position.add(0, offsetFn(item));
}

export {
	calculateNoteYpos,
	calculateAccidentalYpos,
	getNoteHeadOffset,
	getNoteHeadCenter,
	getClefBase,
	getLineNames,
	lineup,
	getYOffset
}
