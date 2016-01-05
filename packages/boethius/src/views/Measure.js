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
	const group = new paper.Group({
		name: TYPE
	});

	leftBarline = leftBarline || drawBarline(lines);
	const previousBarlinePosition = leftBarline.position.x;
	const rightBarline = drawBarline(lines, previousBarlinePosition + width, this.barType);
	const bounds = this.drawGroupBounds(previousBarlinePosition, rightBarline);

	group.addChildren([bounds, leftBarline, rightBarline]);

	this.barlines = [leftBarline, rightBarline];

	return group;
};

Measure.prototype.drawGroupBounds = function (previousBarlinePosition, barline) {
	const rectangle = new paper.Path.Rectangle({
		name: "bounds",
		from: new paper.Point(previousBarlinePosition, barline.bounds.top),
		to: barline.bounds.bottomRight
	});
	// rectangle.fillColor = paperUtils.randomColor(); // create a fill so the center can be clicked
	rectangle.fillColor = "#FFF";
	rectangle.opacity = 0.0;
	return rectangle;
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
		onMouseDown: () => {
			group.children.bounds.fillColor = "red";
		},
		onMouseUp: () => {
			group.children.bounds.fillColor = "green";
		}
	});
};

export default Measure;
