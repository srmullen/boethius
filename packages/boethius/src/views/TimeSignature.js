import engraver from "../engraver";
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

	}

}

/*
 * @param sig {String} - ex. "4/4", "h"
 */
TimeSignature.parseValue = function (sig) {
	if (sig === "c" || sig === "h") {
		return [4, 4];
	} else {
		let nums = sig.split("/");
		return [+nums[0], +nums[1]]; // convert strings to numbers
	}
}

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
