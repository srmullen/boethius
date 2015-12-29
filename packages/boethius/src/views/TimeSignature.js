import {drawTimeSig} from "../engraver";
import constants from "../constants";

const TYPE = constants.type.timeSig;

function TimeSignature ({value="4/4", measure, beatStructure}) {
	this.value = value;
	this.measure = measure;
	this.beatStructure = beatStructure || TimeSignature.createBeatStructure(value);
}

TimeSignature.prototype.type = TYPE;

TimeSignature.createBeatStructure = function (value) {
	// handle common time signatures first
	switch (value) {
		case "4/4":
			return [2,2];
			break;
		case "c":
			return [2,2];
			break;
		case "3/4":
			return [1, 1, 1];
			break;
	}

}

TimeSignature.prototype.render = function () {
	const margin = {
		top: 0,
		left: 2,
		bottom: 0,
		right: 10
	}

	const group = this.group = new paper.Group({
		name: TYPE
	});

	const symbol = drawTimeSig(this.value, margin);

	// this.group.removeChildren();

	group.addChild(symbol.place());

	return group;
}

export default TimeSignature;
