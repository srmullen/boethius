import paper from "paper";
import {isEqual} from "lodash";
import {drawTimeSig} from "../engraver";
import constants from "../constants";
import { parseSignature } from '../utils/timeUtils';

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
	"3/8": [3],
	"FREE": [4, 4]
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

	if (this.value !== 'FREE') {
		group.addChild(drawTimeSig(this.value, margin));
		group.position = [0, 0];
		if (this.value === "c" || this.value === "h") {
			group.translate(0, Scored.config.stepSpacing * 4);
		}
	}

	return group;
};

TimeSignature.prototype.equals = function (timeSig) {
	return (
    this.type === timeSig.type &&
		this.value === timeSig.value &&
    this.measure === timeSig.measure &&
    isEqual(this.beatStructure, timeSig.beatStructure)
	);
};

/**
 * Calculates the duration of measures and beats with the time signature.
 * @param {?RelativeTime} - Object with measure/beat properties.
 * @return {Time}
 */
TimeSignature.prototype.getDurationTime = function (dur) {
	const [beats, value] = parseSignature(this);
	const measures = dur.measure || 0;
	const totalBeats = (dur.beat || 0) + (measures * beats);
	return totalBeats * (1/value);
}

export default TimeSignature;
