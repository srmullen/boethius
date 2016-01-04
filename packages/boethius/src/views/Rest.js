import {drawRest} from "../engraver";
import constants from "../constants";

const TYPE = constants.type.rest;

function Rest ({voice=0, value=4, dots=0, tuplet, time, slur}) {
	this.voice = voice;
	this.value = value;
	this.dots = dots;
	this.tuplet = tuplet;
	this.time = time;
	this.slur = slur;
}

Rest.prototype.type = TYPE;

Rest.prototype.render = function () {
	const group = this.group = new paper.Group({
		name: TYPE
	});

	this.symbol = drawRest(this.value);

	group.removeChildren();

	group.addChild(this.symbol.place());

	// this.drawGroupBounds(group);

	return group;
};

Rest.prototype.drawDots = function () {

};

Rest.prototype.drawGroupBounds = function (group) {
	const rectangle = new paper.Path.Rectangle(new paper.Rectangle(group.bounds));
	rectangle.name = "bounds";
	// rectangle.fillColor = "blue"; // create a fill so the center can be clicked
	// rectangle.opacity = 0.2;
	group.insertChild(0, rectangle);
};

export default Rest;
