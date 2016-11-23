import constants from "../constants";
import {drawBarline} from "../engraver";
import _ from "lodash";

import {isMeasure, isTimeSignature} from "../types";
import {getMeasureDuration} from "../utils/timeUtils";

const TYPE = constants.type.measure;

/*
 * @param value - The measure number.
 * @param timeSig - TimeSignature. Required.
 * @param startsAt - Time the measure starts at.
 */
function Measure ({value, timeSig, startsAt=0}, children=[]) {
	if (!timeSig) {
		throw new Error("Time Signature is required when initializing Measure");
	}

	this.value = value;
	this.timeSig = timeSig;
	this.startsAt = startsAt;
	this.children = children;
}

Measure.prototype.type = TYPE;

/*
 * @param lines Group<Line>[]
 */
Measure.prototype.render = function (lines, leftBarline, width) {
	const group = new paper.Group({
		name: TYPE
	});

	leftBarline = leftBarline || drawBarline(lines);
	const previousBarlinePosition = leftBarline.position.x;
	const rightBarline = drawBarline(lines, previousBarlinePosition + width, this.barType);
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
	let measures = new Array(numMeasures);

	// get the Measures from children and add them to the measures array
	let [explicitMeasures, markings] = _.partition(_.filter(children, c => !!c), isMeasure),
		measureMarkings = _.groupBy(markings, marking => marking.measure || 0);

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
