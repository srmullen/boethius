import * as paperUtils from "../utils/paperUtils";
import * as timeUtils from "../utils/timeUtils";
import engraver from "../engraver";
import constants from "../constants";
import _ from "lodash";


const TYPE = constants.type.staff;

function adjustMeasures (lines, measures) {
	var maxLength;
	for (var i = 0; i < measures; i++) {
		// maxLength = _.max(_.map(lines, line => line.measures[i].getLength()));
		maxLength = _.max(_.map(lines, line => line.children[i].getLength()));
		_.each(lines, line => line.setMeasureLength(i, maxLength));
	}
}

function calculateCursor (lines, currentMeasure, currentTime) {
	let width = lines[0].measures[currentMeasure].group.bounds.width,
		duration = lines[0].measures[currentMeasure].duration,
		startsAt = lines[0].measures[currentMeasure].context.startsAt,
		measureTime = currentTime - startsAt,
		// the width of marks that have no duration
		markingWidth = _.max(_.map(lines, function (line) {
			return line.measures[currentMeasure].getLayoutListWidth();
		})),
		nonLayoutWidth = width - markingWidth,
		percentageTime = measureTime / duration;

	// return left + 15 + markingWidth + (percentageTime * nonLayoutWidth);
	return 15 + markingWidth + (percentageTime * nonLayoutWidth);
}

// FIXME: move to bounds file
function drawTimeBounds (items, children) {
	var groups = _.filter(paperUtils.extractGroups(items), x => x);

	if (!groups.length) {return;}

	var furthestLeft = _.min(groups, function (group) {
		return group.bounds.left;
	});

	var minDur;
	if (!items[0].context.duration) { // test if its a layout event
		minDur = _.max(groups, function (group) {
			return group.bounds.right;
		});
	} else {
		minDur = _.min(items, function (item) {
			return item.context.duration;
		}).group;
	}


	var left = furthestLeft.bounds.left,
		right = minDur.bounds.right;

	// use the lines for top and bottom
	var top = children[0].group.bounds.top,
		bottom = _.last(children).group.bounds.bottom;

	var bounds = new paper.Path.Rectangle(new paper.Point(left, top), new paper.Point(right, bottom));

	// bounds.strokeColor = paperUtils.randomColor();
	// bounds.fillColor = paperUtils.randomColor();
	// bounds.opacity = 0.3;
	// bounds.strokeWidth = 2;

	return bounds;
}

/*
 * Get the time of an array of events
 */
function getTime ([[e, ctx]]) {
	if (ctx) {return ctx.time;}
}
/*
 * @measures - the number of measures on the staff.
 * @startMeasure - the index of the first measure on the stave.
 */
 // TODO: What are the children of a staff now? It's more of a view onto the lines, rather than something with children in it's own right.
function Staff ({timeSig="4/4", startMeasure=0, measures, lineLength}, children=[]) {
	// this.staves = staves;
	this.timeSig = timeSig;
	this.measures = measures;

	this.lineLength = lineLength;

	this.children = children;

	this.voices = new Map();

	var self = {
		time: 0,
		measure: 0,
		beat: 0,
		// voiceMap: new Map(), // voice => line
		previousTime: undefined
	};

	// setup voiceMap
	for (let i = 0, lineNum = 0; i < children.length; i++) {
		let voices = children[i].voices || 1;
		for (let j = 0; j < voices; j++) {
			// self.voiceMap.set(lineNum, children[i]);
			this.voices.set(lineNum, children[i]);
			lineNum++;
		}
	}

	// this.setTime = function ({time: lineTime, measure: lineMeasure, beat: lineBeat}) {
	// 	self.time = lineTime;
	// 	self.measure = lineMeasure;
	// 	self.beat = lineBeat;
	// };

	// // Used in more than one class. Should be moved to a prototype.
	// this.getTotalHeight = function (views) {
	// 	var ans =  _.reduce(views, function (x, y) {
	// 		return x + y.height;
	// 	}, 0);
	// 	return ans;
	// };
}

Staff.prototype.type = TYPE;

Staff.prototype.getLine = function (voice) {
	return this.voices.get(voice) || this.children[0];
}

// Staff.prototype.render = function (lines, startMeasure, endMeasure) {
//
// 	const group = this.group = new paper.Group({
// 		name: TYPE
// 	});
//
// 	let childGroups = this.children.map((child) => child.render([0,0]));
//
// 	adjustMeasures(this.children, this.measures);
//
// 	this.group.addChildren(paperUtils.extractGroups(this.children));
//
// 	// let numStaves = this.children[0].staves.length,
// 	// 	staveYPos = 0;
// 	// for (let i = 0; i < numStaves; i++) {
// 	// 	_.each(children, (line, j) => {
// 	// 		line.staves[i].translate([0, staveYPos + 120 * j]);
// 	// 	});
// 	// 	staveYPos = staveYPos + 400;
// 	// }
// 	let staveYPos = 0;
// 	for (let i = 0; i < this.staves; i++) { // FIXME: this.staves is no longer a property of Staff
// 		_.each(childGroups, (lineGroup, j) => {
// 			lineGroup.children["stave"].translate([0, staveYPos + 120 * j]);
// 		});
// 		staveYPos = staveYPos + 400;
// 	}
//
// 	this.group.addChildren(engraver.drawStaffBar(this.children));
//
// 	return group;
// };

Staff.prototype.render = function (lines, startMeasure, endMeasure) {

	const group = this.group = new paper.Group({
		name: TYPE
	});

	// draw each line
	let lineGroups = lines.map((child) => child.render(this.lineLength));

	// adjustMeasures(this.children, this.measures);

	// this.group.addChildren(paperUtils.extractGroups(this.children));
	group.addChildren(lineGroups);

	_.each(lineGroups, (lineGroup, j) => {
		lineGroup.translate([0, 120 * j]);
	});

	group.addChild(engraver.drawStaffBar(lineGroups));

	return group;
};

Staff.prototype.processEvents = function (events) {

	var currentTime = getTime(events) || 0,
		splitTimeSig = this.timeSig.split("/"),
		currentMeasure = timeUtils.getMeasure(currentTime, splitTimeSig);

	/* Get the position for drawing items */
	var cursor = calculateCursor(this.children, currentMeasure, currentTime),
		items = _.filter(_.reduce(events, function (acc, [e, ctx]) {
			var item = this[e](ctx, cursor);
			acc.push(item);
			return acc;
		}, [], this), x => x),
		lastLineItem = _.max(this.children, line => line.at().time),
		lastLineAt = lastLineItem.at();

	// set the time of the staff
	this.setTime(lastLineAt);
	self.previousTime = currentTime;

	// Draw the time bounds group
	// var timeBounds;
	// if (timeBounds = drawTimeBounds(items, this.children)) {
	// 	this.group.addChild(timeBounds);
	// }

	// return the min line time
	return _.min(_.map(this.children,
					line => line.at()),
				t => t.time);
};

Staff.prototype.note = function (note, cursor) {
	var line = this.getLine(note.voice);
	return line.note(note, cursor);
};

Staff.prototype.rest = function (rest, cursor) {
	var line = this.getLine(rest.voice);
	return line.rest(rest, cursor);
};

// Staff.prototype.setPosition = function (position) {
// 	this.group.setPosition(position);
// };
//
// Staff.prototype.translate = function (vector) {
// 	this.group.translate(vector);
// };

// Staff.prototype.clef = function (clef, lineCursor) {
// 	var line = this.getLine(clef.line);
// 	return line.clef(clef, lineCursor);
// }

// Staff.prototype.timeSig = function (timeSig, lineCursor) {
// 	var line = this.getLine(timeSig.line);
// 	return line.timeSig(timeSig, lineCursor);
// }

// Staff.prototype.key = function (key, lineCursor) {
// 	var line = this.getLine(key.line);
// 	return line.key(key, lineCursor);
// }

export default Staff;
