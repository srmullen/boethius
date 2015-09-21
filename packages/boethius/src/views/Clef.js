import engraver from "../engraver";
import common from "../utils/common";
import constants from "../constants";

"use strict";

const TYPE = constants.type.clef;

function Clef ({value="treble", measure}) {
	this.value = value;
	this.measure = measure;
}

Clef.prototype.type = TYPE;

Clef.prototype.render = function (position) {
	const margin = {
		top: 0,
		left: 2,
		bottom: 0,
		right: 7
	}

	const group = new paper.Group({
		name: TYPE
	});

	const symbol = engraver.drawClef(this.value, margin);

	// this.group.removeChildren();

	group.addChild(symbol.place(position));

	// common.debugGroupEvents(this.group);

	return group;
}

// Clef.prototype.setPosition = function (position) {
// 	this.group.setPosition(position);
// }
//
// Clef.prototype.getWidth = function () {
// 	return this.symbol.definition.bounds.width;
// }

Clef.prototype.serialize = function () {
	return this.context;
}

export default Clef;
