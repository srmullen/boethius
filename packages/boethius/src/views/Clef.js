import {drawClef} from "../engraver";
import common from "../utils/common";
import constants from "../constants";

const TYPE = constants.type.clef;

function Clef ({value="treble", measure, beat}) {
	this.value = value;
	this.measure = measure;
	this.beat = beat;
}

Clef.prototype.type = TYPE;

Clef.prototype.render = function () {
	const margin = {
		top: 0,
		left: 2,
		bottom: 0,
		right: 7
	}

	const group = this.group = new paper.Group({
		name: TYPE
	});

	const symbol = drawClef(this.value, margin);

	group.addChild(symbol.place());

	// common.debugGroupEvents(this.group);

	return group;
}

const centerLineValues = {
	treble: "b4",
	bass: "d3",
	alto: "c4",
	tenor: "a4"
}

/*
 * @param Clef
 * @return String - note value of the center line.
 */
export function getCenterLineValue (clef) {
	return centerLineValues[clef.value];
}

export default Clef;
