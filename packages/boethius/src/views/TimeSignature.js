import {drawTimeSig} from "../engraver";
import constants from "../constants";

const TYPE = constants.type.timeSig;

const beatStructures = {
	"4/4": [1, 1, 1, 1],
	"2/4": [1, 1],
	"c": [2,2],
	"h": [2,2],
	"3/4": [1, 1, 1],
	"12/8": [3, 3, 3, 3],
	"9/8": [3, 3, 3],
	"6/8": [3, 3],
	"3/8": [3]
};

function TimeSignature ({value="4/4", measure, beatStructure}) {
	this.value = value;
	this.measure = measure;
	// this.beatStructure = beatStructure || TimeSignature.createBeatStructure(value);
	this.beatStructure = beatStructure || beatStructures[value];
}

TimeSignature.prototype.type = TYPE;

TimeSignature.prototype.render = function () {
	const margin = {
		top: 0,
		left: 2,
		bottom: 0,
		right: 10
	};

	const group = this.group = new paper.Group({
		name: TYPE
	});

	const symbol = drawTimeSig(this.value, margin);

	group.addChild(symbol.place());

	return group;
};

export default TimeSignature;
