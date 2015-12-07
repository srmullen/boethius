import * as paperUtils from "./utils/paperUtils";
import {isNote, isChord} from "./types";
import constants from "./constants";
import * as placement from "./utils/placement";
import * as lineUtils from "./utils/line";
import * as noteUtils from "./utils/note";
import * as chordUtils from "./utils/chord";
import {parseSignature} from "./utils/timeUtils";
import {map, doTimes, concat} from "./utils/common";
import _ from "lodash";


//////////////////////
// Measure Engraver //
//////////////////////

/*
 * Given a number, returns a function that returns the y position of a leger line
 * given which leger, the center y position, and the line spacing.
 */
function getYpositionFunc (num, centerY, lineSpacing) {
	if (num >= 0) {
		return function (i) {
			return centerY + (lineSpacing * (3 + i));
		};
	} else {
		return function (i) {
			return centerY - (lineSpacing * (3 + i));
		};
	}
}

/*
 * @centerLine {Point} the leftmost point of the center line in the measure.
 * @lineSpaceing {Integer} distance between lines in a measure.
 */
// FIXME: This could be improved by using a string i.e. "b4", rather than an Point to represent the center line.
function drawLegerLines (noteHead, centerLine, lineSpacing) {

	// get the distance from the center line.
	// var distance = noteHead.bounds.center.y - centerLine.y,
	// rounding to fix issue with leger lines not showing up
	var distance = Math.round(placement.getNoteHeadCenter(noteHead.bounds.center).y - centerLine.y),
		legerLines = [];
	var yPositionFunc = getYpositionFunc(distance, centerLine.y, lineSpacing);

	if (Math.abs(distance) >= lineSpacing * 3) {
		// Added Math.ceil to help with issues doing floating point math. Not sure if it's the perfect solution.
		for (var i = 0; i <= Math.ceil(Math.abs(distance) - (lineSpacing * 3)) / lineSpacing; i++) {
			var yPos = yPositionFunc(i);
			var point1 = new paper.Point(noteHead.bounds.leftCenter.x - Scored.config.note.head.width/2, yPos);
			var point2 = new paper.Point(noteHead.bounds.rightCenter.x + Scored.config.note.head.width/2, yPos);
			legerLines.push(new paper.Path.Line(point1, point2));
		}
	}

	return new paper.Group({
		children: legerLines,
		strokeColor: "black"
	});
}

function drawBarline (staves, xPos=0) {
	let firstLine = staves[0],
		lastLine = staves[staves.length - 1],
		margin = 2,
		barGroup = new paper.Group({name: "barline"});
	let bar = new paper.Path.Line(lineUtils.f(firstLine).add(xPos, 0), lineUtils.e(lastLine).add(xPos, 0));

	// draw the bar line
	barGroup.addChild(bar);
	bar.strokeColor = "black";
	bar.strokeWidth = 1;

	// draw the bounds
	let bounds = new paper.Path.Rectangle(bar.bounds.topLeft.subtract([margin, 0]), bar.bounds.bottomRight.add([margin, 0]));

	bounds.fillColor = "#FFFFFF";
	bounds.opacity = 0;
	// bounds.fillColor = paperUtils.randomColor();
	// bounds.opacity = 0.3;

	barGroup.addChild(bounds);

	return barGroup;
}

///////////////////
// Line Engraver //
///////////////////

function drawLine (width) {
	let line,
		lineArray = [],
		lineNames = ["F", "D", "B", "G", "E"];

	for (let i = 0; i < 5; i++) {
		line = new paper.Path.Line(new paper.Point(0, i * Scored.config.lineSpacing), new paper.Point(width, i * Scored.config.lineSpacing));
		line.name = lineNames[i];
		line.strokeColor = "black";
		lineArray.push(line);
	}

	let rectangle = new paper.Rectangle(lineArray[0].firstSegment.point, lineArray[4].lastSegment.point);
	rectangle = new paper.Path.Rectangle(rectangle);
	rectangle.fillColor = "#FFFFFF"; // create a fill so the center can be clicked
	rectangle.opacity = 0; // make the rectangle invisible
	rectangle.name = "bounds";

	return new paper.Group(_.flatten([rectangle, lineArray]));
}

// var drawLine = _.memoize(function (width) {
// 	var line,
// 		lineArray = [],
// 		lineNames = ["F", "D", "B", "G", "E"];

// 	for (var i = 0; i < 5; i++) {
// 		line = new paper.Path.Line(new paper.Point(0, i * Scored.config.lineSpacing), new paper.Point(width, i * Scored.config.lineSpacing));
// 		line.name = lineNames[i];
// 		line.strokeColor = "black";
// 		lineArray.push(line);
// 	}

// 	var rectangle = new paper.Rectangle(lineArray[0].firstSegment.point, lineArray[4].lastSegment.point);
// 	rectangle = new paper.Path.Rectangle(rectangle);
// 	rectangle.fillColor = "#FFFFFF"; // create a fill so the center can be clicked
// 	rectangle.opacity = 0.0; // make the rectangle invisible

// 	return new paper.Symbol(new paper.Group(_.flatten([rectangle, lineArray])));
// });

function drawStaffBar (lines) {
	var firstLine = lines[0],
		lastLine = lines[lines.length - 1];

	let bar = new paper.Path.Line(lineUtils.f(firstLine), lineUtils.e(lastLine));
	bar.strokeColor = "black";
	bar.strokeWidth = 2;

	return bar;
}

//////////////////////
// Marking Engraver //
//////////////////////

// memoized to always return the same symbol for a given clef. May cause issues with margin param
const drawClef = _.memoize(function (clef, margin={}) {
	const svgItem = new paper.PointText({
		content: {
			treble: '9',
			bass: '8',
			alto: '7',
			tenor: '7'
		}[clef],
		fontFamily: 'gonville',
		fontSize: 32,
		fillColor: 'black',
		name: 'clef'
	});

	return new paper.Symbol(drawBounds(svgItem, margin));
});

const drawTimeSig = _.memoize(function (timeSig, margin) {
	var item;

	if (timeSig === "c") { // common time
		item = new paper.PointText({
			content: constants.font.timeSigs.common,
			fontFamily: 'gonville',
			fontSize: 32,
			fillColor: 'black'
		});
	} else if (timeSig === "h") { // half time
		item = new paper.PointText({
			content: constants.font.timeSigs.half,
			fontFamily: 'gonville',
			fontSize: 32,
			fillColor: 'black'
		});
	} else {
		let [beats, value] = timeSig.split("/"),
			top = new paper.PointText({
				content: beats,
				fontFamily: 'gonvillealpha',
				fontSize: 32,
				fillColor: 'black'
			}),
			bot = new paper.PointText({
				content: value,
				fontFamily: 'gonvillealpha',
				fontSize: 32,
				fillColor: 'black'
			});

		item = new paper.Group([top, bot]);
		bot.translate([0, top.bounds.height/2]);
	}

	return new paper.Symbol(drawBounds(item, margin));
});

// var drawKey = _.memoize(function (key, signature, accidental, margin) {
// 	var keyGroup = new paper.Group();

// 	var position = new paper.Point(0,0);

// 	var item, yTranslate;
// 	for (var i = 0; i < signature.length; i++) {
// 		item = new paper.PointText({
// 			content: constants.font.accidentals[accidental],
// 			fontFamily: 'gonville',
// 			fontSize: 32,
// 			fillColor: 'black'
// 		});

// 		yTranslate = placement.calculateAccidentalYpos(signature[i], Scored.config.lineSpacing/2);

// 		item.setPosition(position.add([0, yTranslate]));

// 		position = position.add([7, 0]);

// 		keyGroup.addChild(item);
// 	}

// 	return new paper.Symbol(drawBounds(keyGroup, margin));
// });

function drawBounds (item, {top=0, left=0, bottom=0, right=0}) {
	var rect = new paper.Path.Rectangle(item.bounds.topLeft.subtract([left, top]), item.bounds.bottomRight.add([right, bottom]));

	rect.fillColor = "#FFFFFF";
	rect.opacity = 0;
	// rect.fillColor = paperUtils.randomColor();
	// rect.opacity = 0.3;

	item.addChild(rect);
	return item;
}

///////////////////
// Note Engraver //
///////////////////

const drawHead = _.memoize(function (type) {
	var noteHead, noteheadChar;

	if (type >= 1) {
		noteheadChar = constants.font.noteheads.whole;
	} else if (type >= 1/2) {
		noteheadChar = constants.font.noteheads.hollow;
	} else {
		noteheadChar = constants.font.noteheads.solid;
	}

	noteHead = new paper.PointText({
		name: "head",
		content: noteheadChar,
		fontFamily: 'gonville',
		fontSize: Scored.config.fontSize,
		fillColor: 'black'
	});

	return new paper.Symbol(noteHead);
});

/*
 * Draw the duration dots on the note
 */
function drawDots (noteHead, dots) {
	if (dots) {
		var dotArr = [],
			distance = noteHead.bounds.width / 2,
			// point = noteHead.bounds.rightCenter,
			point = placement.getNoteHeadOffset(noteHead.bounds.bottomRight),
			dot;

		for (var i = 0; i < dots; i++) {
			point = point.add(distance, 0);
			dot = new paper.Path.Circle(point, 1.5);
			dot.fillColor = 'black';
			// this.group.addChild(dot); // TODO: might need a way to refer to the dots later
			dotArr.push(dot);
		}

		return new paper.Group({
			children: dotArr
		});
	}
}

function drawStacato () {
	return new paper.Path.Circle();
}

function drawLegato () {
	return new paper.path.Line();
}

const drawAccidental = _.memoize(function (accidental) {
	var content = {
			"#": constants.font.accidentals.sharp,
			"b": constants.font.accidentals.flat,
			"bb": constants.font.accidentals.doubleFlat,
			"x": constants.font.accidentals.doubleSharp,
			"n": constants.font.accidentals.natural,
		}[accidental],
		item = new paper.PointText({
			content: content,
			fontFamily: 'gonville',
			fontSize: Scored.config.fontSize,
			fillColor: 'black'
		});

	return new paper.Symbol(item);
});

const drawFlag = _.memoize(function (dur, stemDirection) {
	var flagName = {
			8: "eighth",
			16: "sixteenth",
			32: "thirtysecond",
			64: "sixtyfourth",
			128: "onehundredtwentyeighth"
		}[dur],
		flag;

	if (flagName) {
		flag = new paper.PointText({
			content: constants.font.flags[flagName][stemDirection],
			fontFamily: 'gonville',
			fontSize: Scored.config.fontSize,
			fillColor: 'black'
		});

		return new paper.Symbol(flag);
	}
}, (dur, stemDirection) => "" + dur + stemDirection);

function getFlagOffset (point, direction) {
	return point.add({up: [4, -9],
					  down: [5, -11]}[direction]);
}

const drawRest = _.memoize(function (type) {
	var rest = new paper.PointText({
		content: constants.font.rests[type],
		fontFamily: 'gonville',
		fontSize: Scored.config.fontSize,
		fillColor: 'black'
	});

	return new paper.Symbol(rest);
});

/*
 * @param items - <Note, Chord>[]
 * @param stemPoints - Point[] representing default stem points of the notes.
 * @return [fulcrum Point, vector Point]
 * Should this be made into two functions? Thinking here was the the value of one would affect the other.
 */
function calculateBeamFulcrumAndVector (items, stemPoints, stemDirections) {
	let firstPoint = stemPoints[0],
		lastPoint = stemPoints[stemPoints.length-1],
		x = firstPoint.x + ((lastPoint.x - firstPoint.x) / 2);

	let vector = lastPoint.subtract(firstPoint).normalize();
	if (vector.angle < -Scored.config.maxBeamAngle) {
		vector = new paper.Point({angle: -Scored.config.maxBeamAngle, length: 1});
	} else if (vector.angle > Scored.config.maxBeamAngle) {
		vector = new paper.Point({angle: Scored.config.maxBeamAngle, length: 1});
	}

	// get stem points given minimum stem lengths
	let minStemLength = Scored.config.stepSpacing * 4.5;
	// let minStemPoints = map(_.partialRight(defaultStemPoint, minStemLength), items, stemDirections);
	let minStemPoints = map((item, stemDirection) => {
		if (isNote(item)) {
			return noteUtils.defaultStemPoint(item, stemDirection, minStemLength);
		} else if (isChord(item)) {
			return chordUtils.defaultStemPoint(item, stemDirection, minStemLength);
		}
	}, items, stemDirections);
	// TODO: Handle stems going different directions
	let ys;
	if (stemDirections[0] === "up") {
		let minPoint = _.min(minStemPoints, p => p.y);
		ys = stemPoints.map(p => p.y < minPoint.y ? p.y : minPoint.y);
	} else if (stemDirections[0] === "down") {
		let minPoint = _.max(minStemPoints, p => p.y);
		ys = stemPoints.map(p => p.y > minPoint.y ? p.y : minPoint.y);
	}
	// y is the average of all points above the min beam point.
	let fulcrum = new paper.Point(x, _.sum(ys)/ys.length);

	return [fulcrum, vector];
}

function handleBeam (beam, point, duration, previousDuration, nextDuration, fulcrum, vector, direction, yDiff) {
	let lastBeam = _.last(beam),
		BEAM_DIFF = [0, yDiff],
		p16;

	if (direction === "up") { // should use vector from stemPoint to note rather than direction string
		p16 = point.add(BEAM_DIFF);
	} else {
		p16 = point.subtract(BEAM_DIFF);
	}

	// create left flag point
	if (previousDuration && previousDuration < duration && (!nextDuration || nextDuration < duration)) {
		let p = getLinePoint(p16.x - 10, fulcrum, vector),
			flag = direction === "up" ? p.add(BEAM_DIFF) : p.subtract(BEAM_DIFF);

		lastBeam.push(flag);
	}

	lastBeam.push(p16);

	// create right flag point
	if (nextDuration && !previousDuration && nextDuration < duration) {
		let p = getLinePoint(p16.x + 10, fulcrum, vector),
			flag = direction === "up" ? p.add(BEAM_DIFF) : p.subtract(BEAM_DIFF);
		lastBeam.push(flag);
	}
}


// for use in beam function
const durationToBeams = {
	8: 1, 16: 2, 32: 3, 64: 4, 128: 5, 256: 6
};

/*
 * @param items - collection of the items to bar.
 * @param fulcrum - a point that the bar passes through
 * @param vector - the vector of the bar
 * @param line - String value of center line
 */
function beam (items, {line="b4", fulcrum, vector, kneeGap=5.5, stemDirections}) {

	let numBeams = durationToBeams[_.max(_.map(items, item => item.value))];

	let durations = items.map(item => item.value),
		stemLengths = map((item, stemDirection) => {
			if (isNote(item)) {
				return noteUtils.getStemLength(item, line);
			} else if (isChord) {
				return chordUtils.getStemLength(item, line, stemDirection);
			}
		}, items, stemDirections),
		stemPoints = items.map((item, i) => {
			if (isNote(item)) {
				return noteUtils.defaultStemPoint(item, stemDirections[i], stemLengths[i]);
			} else if (isChord) {
				return chordUtils.defaultStemPoint(item, stemDirections[i], stemLengths[i]);
			}
		});

	// only calculate the fulcrum and vector if they aren't passed in as arguments
	if (fulcrum && !vector) {
		[, vector] = calculateBeamFulcrumAndVector(items, stemPoints, stemDirections);
	} else if (vector && !fulcrum) {
		[fulcrum,] = calculateBeamFulcrumAndVector(items, stemPoints, stemDirections);
	} else {
		[fulcrum, vector] = calculateBeamFulcrumAndVector(items, stemPoints, stemDirections);
	}

	// beams is an array of arrays of segments, beams[0] are eighth segments, beams[1] sixteenths, etc.
	let beams = doTimes(numBeams, () => [[]]),
		segments = _.reduce(items, (acc, item, i) => {
			let point = _.last(acc),
				duration = durations[i],
				direction = stemDirections[i],
				current = _.last(acc),
				previous = acc[i-1],
				previousDuration = durations[i-1],
				nextDuration = durations[i+1],
				nextItem = items[i+1],
				next = nextItem ? nextItem.calculateStemPoint(fulcrum, vector, stemDirections[i+1]) : null;

			_.last(beams[0]).push(point);

			if (duration >= 16) {
				handleBeam(beams[1], current, duration, previousDuration, nextDuration, fulcrum, vector, direction, 5);
			}

			if (duration >= 32) {
				handleBeam(beams[2], current, duration, previousDuration, nextDuration, fulcrum, vector, direction, 10);
			}

			if (duration >= 64) {
				handleBeam(beams[3], current, duration, previousDuration, nextDuration, fulcrum, vector, direction, 15);
			}

			if (duration >= 128) {
				handleBeam(beams[4], current, duration, previousDuration, nextDuration, fulcrum, vector, direction, 20);
			}

			if (duration >= 256) {
				handleBeam(beams[5], current, duration, previousDuration, nextDuration, fulcrum, vector, direction, 25);
			}

			// Break beams
			if (duration < 16 && beams[1]) {
				beams[1].push([]);
			}

			if (duration < 32 && beams[2]) {
				beams[2].push([]);
			}

			if (duration < 64 && beams[3]) {
				beams[3].push([]);
			}

			if (duration < 128 && beams[4]) {
				beams[4].push([]);
			}

			if (duration < 256 && beams[5]) {
				beams[5].push([]);
			}

			item.drawStem(point, direction);

			return concat(acc, next);
		}, [items[0].calculateStemPoint(fulcrum, vector, stemDirections[0])]), // initialize the accumulator with the first point

		paths = _.map(_.flatten(beams), (bar) => {
			return new paper.Path({
				segments: bar,
				strokeColor: "black",
				strokeWidth: 3
			});
		});

	// what group should this be added to?
	return new paper.Group({
		name: "beam",
		children: paths
	});
}

/*
 * @param - Item with a stem drawn.
 */
function getStemPoint (item) {
	return item.group.children["stem"].segments[1].point;
}

/*
 * @param items - array of items to notate as a tuplet.
 * @param centerLine - Point
 * @param voiceDirection - String direction of the voices stems. optional.
 */
function drawTuplets (items, centerLine, voiceDirection) {
	// just draw it on top right now.
	const [numerator,] = parseSignature(items[0].tuplet);
	const distance = _.last(items).group.bounds.right - items[0].group.bounds.left;
	let frm, to;
	if (voiceDirection === "up") {
		// get highest stem point
		let highestPoint = _.min(_.map(items, getStemPoint), point => point.y);
		let yPos = highestPoint.y - Scored.config.note.head.height;
		frm = [items[0].group.bounds.left, yPos];
		to = [_.last(items).group.bounds.right, yPos];
	} else if (voiceDirection === "down") {
		let lowestPoint = _.min(_.map(items, getStemPoint), point => point.y);
		let yPos = lowestPoint.y + Scored.config.note.head.height;
		frm = [items[0].group.bounds.left, yPos];
		to = [_.last(items).group.bounds.right, yPos];
	} else {
		// get the part of the tuplet that furthest from the center line. draw the tuplet on that side.
		let distances = _.map(items, item => {
			let stemPoint = item.group.children["stem"].segments[1].point;
			return centerLine.y - stemPoint.y;
		});
	}

	let line = new paper.Path.Line({
		// from: items[0].group.bounds.leftCenter,
		// to: _.last(items).group.bounds.rightCenter,
		from: frm,
		to: to,
		strokeColor: "black"
	});

	let num = new paper.PointText({
		content: numerator,
		fontFamily: 'gonvillealpha',
		fontSize: Scored.config.fontSize/1.5,
		fillColor: 'black',
		position: line.segments[0].point.add(distance/2, 0)
	});

	return new paper.Group({children: [line, num]});
}


export default {
	drawLegerLines,
	drawBarline,
	drawLine,
	drawStaffBar,
	drawClef,
	drawTimeSig,
	drawHead,
	drawDots,
	drawStacato,
	drawLegato,
	drawAccidental,
	drawFlag,
	getFlagOffset,
	drawRest,
	beam,
	drawTuplets
};
