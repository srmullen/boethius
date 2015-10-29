import constants from "../constants";
import engraver from "../engraver";
import * as timeUtils from "../utils/timeUtils";
import * as placement from "../utils/placement";
import * as lineUtils from "../utils/line";
import * as common from "../utils/common";
import _ from "lodash";

const TYPE = constants.type.measure;

function Measure ({timeSig="4/4", startsAt=0}, children=[]) {
	this.timeSig = timeSig;
	this.startsAt = startsAt;
	this.children = children;
}

Measure.prototype.type = TYPE;

Measure.prototype.note = function (note) {
	this.children.push(note);
}

Measure.prototype.rest = function (rest) {
	this.children.push(rest);
}

Measure.prototype.chord = function (chord) {
	this.children.push(chord);
};

Measure.prototype.render = function (line, leftBarline, width) {
	const group = new paper.Group({
		name: TYPE
	});

	leftBarline = leftBarline || engraver.drawBarline([line]);
	let previousBarlinePosition = leftBarline.position.x,
		rightBarline = engraver.drawBarline([line], previousBarlinePosition + width),
		bounds = this.drawGroupBounds(previousBarlinePosition, rightBarline);

	group.addChildren([bounds, leftBarline, rightBarline]);

	// let childGroups = this.renderChildren(line, leftBarline);

	// group.addChildren(childGroups);

	this.barlines = [leftBarline, rightBarline]; // FIXME: paper groups shouldn't be on boethius objects

	return group;
};

Measure.prototype.renderChildren = function (line, leftBarline) {
	let childGroups = _.map(this.children, (child) => {
		let pos = placement.getYOffset(child, lineUtils.b(line)),
			yPos = child.type === "note" ?
				placement.calculateNoteYpos(child, Scored.config.lineSpacing/2, placement.getClefBase("treble")) : 0,
			childGroup = child.render(pos.add([leftBarline.position.x + 15, yPos]));

		common.addEvents(childGroup);
		return childGroup;
	});

	placement.lineup(childGroups);

	return childGroups;
}

Measure.prototype.drawGroupBounds = function (previousBarlinePosition, barline) {
	var rectangle = new paper.Path.Rectangle({
		name: "bounds",
		from: new paper.Point(previousBarlinePosition, barline.bounds.top),
		to: barline.bounds.bottomRight
	});
	// rectangle.fillColor = paperUtils.randomColor(); // create a fill so the center can be clicked
	rectangle.fillColor = "#FFF";
	rectangle.opacity = 0.0;
	return rectangle;
};

Measure.prototype.setLength = function (width) {
	this.barlines[1].position = this.barlines[0].position.add(width, 0);
	var bounds = this.group.children.bounds;
	bounds.bounds.right = bounds.bounds.left + width;
};

Measure.prototype.getLength = function () {
	return this.barlines[1].position.subtract(this.barlines[0].position).x;
};

Measure.prototype.getEventsDuration = function () {
	return _.sum(this.eventsList, function (e) {
		return e.context.duration;
	});
};

Measure.prototype.getEventsListWidth = function () {
	var lastEvent = _.last(this.eventsList);

	if (!lastEvent) {return 0;} // if there isn't an event in the measure none of it is used.

	return lastEvent.group.bounds.right - this.group.children.bounds.bounds.left;
};

/*
 * Calculate the width of layout items in the measure.
 * If a time is given returns only the width of items occuring at or before that time.
 */
Measure.prototype.getLayoutListWidth = function () {
	return _.reduce(this.layoutList,  (acc, item) => {
		return acc + item.group.bounds.width;
	}, 0);
};

Measure.addGroupEvents = function (group) {
	_.extend(group, {
		onMouseEnter: () => {
			let bounds = group.children.bounds;
			bounds.fillColor = "green";
			bounds.opacity = 0.2;
		},
		onMouseLeave: () => {
			let bounds = group.children.bounds;
			bounds.fillColor = "#FFF";
			bounds.opacity = 0;
		},
		onMouseDown: (event) => {
			group.children.bounds.fillColor = "red";
			console.log(group);
		},
		onMouseUp: () => {
			group.children.bounds.fillColor = "green";
		}
	});
}

export default Measure;
