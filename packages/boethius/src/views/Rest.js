let engraver = require("../engraver"),
	common = require("../utils/common"),
	constants = require("../constants");

const TYPE = constants.type.rest;

function Rest ({voice=0, value=4, dots=0, tuplet, time}) {
	this.voice = voice;
	this.value = value;
	this.dots = dots;
	this.tuplet = tuplet;
	this.time = time;
}

Rest.prototype.type = TYPE;

Rest.prototype.render = function (position) {
	this.group = new paper.Group({
		name: TYPE
	});

	common.addEvents(this);

	// this.symbol = engraver.drawRest(this.context.type);
	this.symbol = engraver.drawRest(this.value);

	this.group.removeChildren();

	this.group.addChild(this.symbol.place(position));

	this.drawGroupBounds();
};

Rest.prototype.drawGroupBounds = function () {
	var rectangle = new paper.Rectangle(this.group.bounds);

	rectangle = new paper.Path.Rectangle(rectangle);
	rectangle.name = "bounds";
	// rectangle.fillColor = "blue"; // create a fill so the center can be clicked
	// rectangle.opacity = 0.2;
	this.group.insertChild(0, rectangle);
};

Rest.prototype.setPosition = function (position) {
	this.group.setPosition(position);
};

Rest.prototype.translate = function (vector) {
	this.group.translate(vector);
};

// Rest.prototype.serialize = function () {
// 	return this.context;
// }

module.exports = Rest;
