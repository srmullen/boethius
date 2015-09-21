import engraver from "../engraver";
import constants from "../constants";

"use strict";

const TYPE = constants.type.timeSig;

function TimeSignature ({value="4/4", measure}) {
	this.value = value;
	this.measure = measure;
}

TimeSignature.prototype.type = TYPE;

TimeSignature.prototype.render = function (position, cursor) {
	const margin = {
		top: 0,
		left: 2,
		bottom: 0,
		right: 10
	}

	const group = new paper.Group({
		name: TYPE
	});

	const symbol = engraver.drawTimeSig(this.value, margin);

	// this.group.removeChildren();

	group.addChild(symbol.place(position));

	return group;
}

// TimeSignature.prototype.setPosition = function (position) {
// 	this.group.setPosition(position);
// }

// TimeSignature.prototype.getWidth = function () {
// 	return this.symbol.definition.bounds.width;
// }

TimeSignature.prototype.serialize = function () {
	return this.context;
}

export default TimeSignature;
