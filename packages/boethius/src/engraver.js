// let paperUtils = require("./utils/paperUtils"),
// 	constants = require("./constants"),
// 	placement = require("./utils/placement"),
// 	lineUtils = require("./utils/line"),
// 	_ = require("lodash");
import * as paperUtils from "./utils/paperUtils";
import constants from "./constants";
import * as placement from "./utils/placement";
import * as lineUtils from "./utils/line";
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
	var firstLine = staves[0],
		lastLine = staves[staves.length - 1],
		margin = 2,
		barGroup = new paper.Group({name: "barline"}),
		bar = new paper.Path.Line(lineUtils.f(firstLine[0]).add(xPos, 0), lineUtils.e(lastLine[0]).add(xPos, 0));

	// draw the bar line
	barGroup.addChild(bar);
	bar.strokeColor = "black";
	bar.strokeWidth = 1;

	// draw the bounds
	var bounds = new paper.Path.Rectangle(bar.bounds.topLeft.subtract([margin, 0]), bar.bounds.bottomRight.add([margin, 0]));

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
	var line,
		lineArray = [],
		lineNames = ["F", "D", "B", "G", "E"];

	for (var i = 0; i < 5; i++) {
		line = new paper.Path.Line(new paper.Point(0, i * Scored.config.lineSpacing), new paper.Point(width, i * Scored.config.lineSpacing));
		line.name = lineNames[i];
		line.strokeColor = "black";
		lineArray.push(line);
	}

	var rectangle = new paper.Rectangle(lineArray[0].firstSegment.point, lineArray[4].lastSegment.point);
	rectangle = new paper.Path.Rectangle(rectangle);
	rectangle.fillColor = "#FFFFFF"; // create a fill so the center can be clicked
	rectangle.opacity = 0; // make the rectangle invisible
	rectangle.name = "bounds";

	return new paper.Group(_.flatten([rectangle, lineArray]));
	// return new paper.Group(lineArray);
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
		lastLine = lines[lines.length - 1],
		numStaves = firstLine.staves.length,
		bars = [];

	for (let i = 0; i < numStaves; i++) {
		let bar = new paper.Path.Line(lineUtils.f(firstLine.staves[i]), lineUtils.e(lastLine.staves[i]));
		bar.strokeColor = "black";
		bar.strokeWidth = 2;
		bars.push(bar);
	}

	return bars;
}

//////////////////////
// Marking Engraver //
//////////////////////

// memoized to always return the same symbol for a given clef. May cause issues with margin param
var drawClef = _.memoize(function (clef, margin={}) {
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

var drawTimeSig = _.memoize(function (timeSig, margin) {
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

var drawHead = _.memoize(function (type) {
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

var drawAccidental = _.memoize(function (accidental) {
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

var drawFlag = _.memoize(function (dur, stemDirection) {
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

var drawRest = _.memoize(function (type) {
	var rest = new paper.PointText({
		content: constants.font.rests[type],
		fontFamily: 'gonville',
		fontSize: Scored.config.fontSize,
		fillColor: 'black'
	});

	return new paper.Symbol(rest);
});

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
	drawRest
};
