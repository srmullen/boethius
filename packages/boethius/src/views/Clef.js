import engraver from "../engraver";
import common from "../utils/common";
import constants from "../constants";

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

	group.addChild(symbol.place(position));

	// common.debugGroupEvents(this.group);

	return group;
}

// Clef.prototype.getWidth = function () {
// 	return this.symbol.definition.bounds.width;
// }

export default Clef;
