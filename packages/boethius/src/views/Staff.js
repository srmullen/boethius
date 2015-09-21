import * as paperUtils from "../utils/paperUtils";
import * as timeUtils from "../utils/timeUtils";
import * as engraver from "../engraver";
import * as constants from "../constants";

const TYPE = constants.type.staff;

function adjustMeasures (lines, measures) {
	var maxLength;
	for (var i = 0; i < measures; i++) {
		maxLength = _.max(_.map(lines, line => line.measures[i].getLength()));
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

function Staff (context={}, children=[]) {
	context.timeSig = context.timeSig || "4/4"
	this.context = context;
	this.children = children;

	this.group = new paper.Group({
		name: TYPE
	});

	var self = {
		time: 0,
		measure: 0,
		beat: 0,
		voiceMap: new Map(), // voice => line
		previousTime: undefined
	};

	// setup voiceMap
	for (let i = 0, lineNum = 0; i < children.length; i++) {
		let voices = children[i].context.voices || 1;
		for (let j = 0; j < voices; j++) {
			self.voiceMap.set(lineNum, children[i]);
			lineNum++;
		}
	}

	this.setTime = function ({time: lineTime, measure: lineMeasure, beat: lineBeat}) {
		self.time = lineTime;
		self.measure = lineMeasure;
		self.beat = lineBeat;
	};

	/*
	 * returns an object containing the current time, measure, and beat.
	 */
	// this.at = function () {
	// 	return {
	// 		time: self.time,
	// 		measure: self.measure,
	// 		beat: self.beat
	// 	};
	// };

	this.getLine = function (voice) {
		return self.voiceMap.get(voice) || this.children[0];
	};

	// Used in more than one class. Should be moved to a prototype.
	this.getTotalHeight = function (views) {
		var ans =  _.reduce(views, function (x, y) {
			return x + y.height;
		}, 0);
		return ans;
	};
}

Staff.prototype.type = TYPE;

Staff.prototype.render = function (position) {

	adjustMeasures(this.children, this.context.measures);

	this.group.addChildren(paperUtils.extractGroups(this.children));

	var numStaves = this.children[0].staves.length,
		staveYPos = 0;
	for (let i = 0; i < numStaves; i++) {
		_.each(children, (line, j) => {
			line.staves[i].translate([0, staveYPos + 120 * j]);
			paper.view.update();
		});
		staveYPos = staveYPos + 400;
	}

	this.group.addChildren(engraver.drawStaffBar(this.children));

	this.translate(50, 50);
};

Staff.prototype.processEvents = function (events) {

	var currentTime = getTime(events) || 0,
		splitTimeSig = this.context.timeSig.split("/"),
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

Staff.note = function (staff, note) {
	console.log("adding note to staff");
};

Staff.rest = function (staff, rest) {
	console.log("adding rest to staff");
};

// Staff.prototype.note = function (note, cursor) {
// 	var line = this.getLine(note.voice);
// 	return line.note(note, cursor);
// };
//
// Staff.prototype.rest = function (rest, cursor) {
// 	var line = this.getLine(rest.voice);
// 	return line.rest(rest, cursor);
// };

Staff.prototype.setPosition = function (position) {
	this.group.setPosition(position);
};

Staff.prototype.translate = function (vector) {
	this.group.translate(vector);
};

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

/*
 * Set all measures to be of equal length
 * @param lines {LineView[]} - collection of lineViews
 * @param measures {number} - measures the staff has
 */


export default Staff;
