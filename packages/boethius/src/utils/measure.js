import _ from "lodash";
import {isMeasure, isTimeSignature} from "../types";
import * as timeUtils from "./timeUtils";
import Measure from "../views/Measure"; // other utils don't import views!

// originally in Line
/*
 * @param numMeasures - the number of measures to create.
 * @param children - Measures or Markings
 */
function createMeasures (numMeasures, children) {
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
		const startsAt = previousMeasure ? previousMeasure.startsAt + timeUtils.getMeasureDuration(previousMeasure) : 0;

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

export {
	createMeasures
};
