import engraver from "../engraver";
import constants from "../constants";

const TYPE = constants.type.timeSig;

function TimeSignature ({value="4/4", measure}) {
	this.value = value;
	this.measure = measure;
}

TimeSignature.prototype.type = TYPE;

TimeSignature.prototype.render = function (position) {
	const margin = {
		top: 0,
		left: 2,
		bottom: 0,
		right: 10
	}

	const group = this.group = new paper.Group({
		name: TYPE
	});

	const symbol = engraver.drawTimeSig(this.value, margin);

	// this.group.removeChildren();

	group.addChild(symbol.place(position));

	return group;
}

export default TimeSignature;
