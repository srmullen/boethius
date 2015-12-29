import constants from "../constants";
import {drawBarline} from "../engraver";
import _ from "lodash";

const TYPE = constants.type.measure;

/*
 * @param value - The measure number.
 * @param timeSig - TimeSignature. Required.
 * @param startsAt - Time the measure starts at.
 */
function Measure ({value, timeSig, startsAt=0}, children=[]) {
	if (!timeSig) {
		throw new Error("Time Signature is required when initializing Measure");
	}

	this.value = value;
	this.timeSig = timeSig;
	this.startsAt = startsAt;
	this.children = children;
}

Measure.prototype.type = TYPE;

/*
 * @param lines Group<Line>[]
 */
Measure.prototype.render = function (lines, leftBarline, width) {
	const group = this.group = new paper.Group({
		name: TYPE
	});

	leftBarline = leftBarline || drawBarline(lines);
	let previousBarlinePosition = leftBarline.position.x,
		rightBarline = drawBarline(lines, previousBarlinePosition + width),
		bounds = this.drawGroupBounds(previousBarlinePosition, rightBarline);

	group.addChildren([bounds, leftBarline, rightBarline]);

	this.barlines = [leftBarline, rightBarline];

	return group;
};

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
