import paper from "paper/dist/paper-core";

import {drawRest, drawDots} from "../engraver";
import constants from "../constants";
import {restEquals} from "../utils/equality";

const TYPE = constants.type.rest;

function Rest ({voice=0, value=4, dots=0, tuplet, time, slur}) {
	this.voice = voice;
	this.value = value;
	this.dots = dots;
	this.tuplet = tuplet;
	this.time = time;
	this.slur = slur;
}

Rest.render = function (rest, context={}) {
	return rest.render(context);
}

Rest.prototype.type = TYPE;

Rest.prototype.render = function (context) {
	const group = this.group = new paper.Group({
		name: TYPE
	});

	group.addChild(drawRest(this.value));
	group.position = [0, 0];

	if (this.dots) {
		this.drawDots(this.dots, context.clef);
	}

	return group;
};

Rest.prototype.drawDots = function (dots) {
	const noteHeadCenterY = this.group.bounds.center.y + Scored.config.note.head.yOffset;
	const yPos = noteHeadCenterY - Scored.config.layout.stepSpacing;

	const point = new paper.Point(this.group.bounds.right + (Scored.config.note.head.width / 2), yPos);

	const dotGroups = drawDots(point, dots);
	this.group.addChildren(dotGroups);
};

Rest.prototype.drawGroupBounds = function (group) {
	const rectangle = new paper.Path.Rectangle(new paper.Rectangle(group.bounds));
	rectangle.name = "bounds";
	// rectangle.fillColor = "blue"; // create a fill so the center can be clicked
	// rectangle.opacity = 0.2;
	group.insertChild(0, rectangle);
};

Rest.prototype.equals = function (rest) {
	return restEquals(this, rest);
};

export default Rest;
