import paper from "paper/dist/paper-core";

import constants from "../constants";
import {drawBarline} from "../engraver";
import _ from "lodash";

import {isMeasure, isTimeSignature, isRepeat} from "../types";
import {getMeasureDuration} from "../utils/timeUtils";

const TYPE = constants.type.measure;

const DEFAULTBAR = "default";
const REPEATBAR = "repeat";

/*
 * @param value - The measure number.
 * @param timeSig - TimeSignature. Required.
 * @param startsAt - Time the measure starts at.
 */
function Measure ({value, timeSig, startsAt=0, barType=DEFAULTBAR}, children=[]) {
	if (!timeSig) {
		throw new Error("Time Signature is required when initializing Measure");
	}

	this.value = value;
	this.timeSig = timeSig;
	this.startsAt = startsAt;
	this.barType = barType;
	this.children = children;
}

Measure.prototype.type = TYPE;

/*
 * @param lines Group<Line>[]
 */
 //FIXME: Need to take width of barlines into account when calculating measure lengths.
 // ex. repeat barlines are wider than regular barlines.
Measure.prototype.render = function (lines, leftBarline, width) {
	const group = new paper.Group({
		name: TYPE
	});

	let barType = this.barType;
	if (_.filter(this.children, isRepeat).length) {
		barType = REPEATBAR;
	}

	leftBarline = leftBarline || drawBarline(lines);
	const previousBarlinePosition = leftBarline.bounds.right;
	const rightBarline = drawBarline(lines, previousBarlinePosition + width, barType);
	const bounds = this.drawGroupBounds(previousBarlinePosition, rightBarline);

	group.addChildren([bounds, leftBarline, rightBarline]);

	this.barlines = [leftBarline, rightBarline];

	return group;
};

Measure.prototype.drawGroupBounds = function (previousBarlinePosition, barline) {
	const rectangle = new paper.Path.Rectangle({
		name: "bounds",
		from: new paper.Point(previousBarlinePosition, barline.bounds.top),
		to: barline.bounds.bottomRight
	});
	rectangle.fillColor = "#FFF";
	rectangle.opacity = 0.0;
	return rectangle;
};

/*
 * @param numMeasures - the number of measures to create.
 * @param children - Measures or Markings
 */
export function createMeasures (numMeasures, children) {
	const measures = new Array(numMeasures);

	// get the Measures from children and add them to the measures array
	const [explicitMeasures, markings] = _.partition(_.filter(children, c => !!c), isMeasure);
	const measureMarkings = _.groupBy(markings, marking => marking.measure || 0);

	{	// Put each measure in the right position in the measures array.
		// If a measure does not have an index property put it in the next available location.
		let cur = 0;
		_.each(explicitMeasures, (measure) => {
			if (_.isNumber(measure.index)) {
				measures[measure.index] = measure;
				cur = measure.index + 1;
			} else {
				measures[cur] = measure;
				cur++;
			}
		});
	}

	_.each(measures, (measure, i) => {
		const previousMeasure = measures[i-1];
		const startsAt = previousMeasure ? previousMeasure.startsAt + getMeasureDuration(previousMeasure) : 0;

		if (!measure) {
			const timeSig = _.find(measureMarkings[i], isTimeSignature) || previousMeasure.timeSig;
			measure = new Measure(_.extend({}, {startsAt, timeSig, value: i}), measureMarkings[i]);
		} else {
			measure.startsAt = startsAt;
			measure.value = i;
		}

		if (i === numMeasures - 1) measure.barType = "final";

		measures[i] = measure;
	});

	return measures;
}

export default Measure;
