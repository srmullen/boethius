import _ from "lodash";
import F from "fraction.js";
import constants from "../constants";

/*
 * @param timeSig - TimeSignaure or time signature value represented as a String. ex. TimeSig({value: "4/4"}) or "4/4", "h"
 * @return Number[]
 */
function parseSignature (timeSig) {
	let sig = timeSig.type === constants.type.timeSig ? timeSig.value : timeSig;

	if (sig === "c" || sig === "h") {
		return [4, 4];
	} else {
		let nums = sig.split("/");
		return [+nums[0], +nums[1]]; // convert strings to numbers
	}
}

/*
 * Still need to add in offset
 * @return {number} - the measure number as an integer
 */
function getMeasure (time=0, [beats, value], offset=0) {
	let measureDuration = beats * (1/value);
	return Math.floor(time/measureDuration);
}

/*
 * @param time - number
 * @param timesig - string or arrary representation of timeSig value.
 * @param offset - number representing point in time from which to calculate the beat from.
 * @return {number} - float representation
 */
function getBeat (time, timeSig, offset=0) {
	let [beats, value] = _.isArray(timeSig) ? timeSig : parseSignature(timeSig),
		measureDuration = beats * (1/value),
		beatTime = (time - offset) % measureDuration;

	return beatTime/(1/value);
}

/*
 * @param measures Measure[]
 * @param item - Any object with a time or measure property.
 * @return time object - object with time, measure, and beat.
 */
function getTime (measures, item) {
	let beat,
		measure = item.measure,
		time = item.time,
		measureView;

	if (!_.isNumber(item.measure)) {
		measure = getMeasureNumber(measures, item.time);
	}

	measureView = measures[measure];

	// time signatures are always at the beginning of a measure.
	if (item.type === constants.type.timeSig) {
		time = measureView.startsAt;
		beat = 0;
	}

	if (!_.isNumber(item.time) && !_.isNumber(time)) {
		time = getTimeNumber(measure, measureView.timeSig);
	}

	beat = item.beat || getBeat(time, measureView.timeSig, measureView.startsAt);

	return {time, measure, beat};
}

/*
 * @param timesig - string or arrary representation of timeSig value.
 * @param offset - number representing point in time from which to calculate the beat from.
 * @return {number} - float
 */
function getTimeNumber (measure, timeSig, offset=0) {
	let [beats, value] = _.isArray(timeSig) ? timeSig : parseSignature(timeSig);
	return measure * beats * (1/value) + offset;
}

/*
 * @param measures - array of measures.
 * @param time - number representing time of event.
 */
function getMeasureNumber (measures, time) {
	return _.findIndex(measures, (measure) => {
		let measureEndsAt = measure.startsAt + getMeasureDuration(measure);
		return time >= measure.startsAt && time < measureEndsAt;
	});
}

/*
 * @param measures - array of measures.
 * @param time - number representing time of event.
 */
function getMeasureByTime (measures, time) {
	return measures[getMeasureNumber(measures, time)];
}

/*
 * @param timeSig {String}
 */
var getTimeSigDuration = function (timeSig) {
	let [beats, value] = parseSignature(timeSig);
	return beats * (1/value);
};

function getMeasureDuration (measure) {
	return getTimeSigDuration(measure.timeSig);
}

/*
 * returns true if the first time is before or the same as the second time
 */
 // FIXME: Not sure this is right
function compareTimes ({time: t1, measure: m1=0, beat: b1=0}, {time: t2, measure: m2=0, beat: b2=0}) {
	if (_.isNumber(t1) && _.isNumber(t2)) {
		return t1 <= t2;
	} else if (m1 === m2) {
		return b1 <= b2;
	} else if (m1 < m2) {
		return true;
	} else {
		return false;
	}
}

function compareByPosition ({measure: m1=0, beat: b1=0}, {measure: m2=0, beat: b2=0}) {
	if (m1 === m2) {
		return b1 <= b2;
	} else {
		return m1 < m2;
	}
}

function compareByTime ({time: t1=0}, {time: t2=0}) {
	return t1 <= t2;
}

function splitByMeasure (events) {
	var measures = _.mapValues(_.groupBy(events, function ([e, ctx]) {
		return ctx.measure || 0;
	}), function (measure) {
		return _.groupBy(measure, function ([e, ctx]) {
			return ctx.beat;
		});
	});

	return Array.prototype.concat.apply([], _.map(sortByKey(measures), sortByKey));
}

function splitByTime (events) {
	return sortByKey(_.groupBy(events, function (ctx) {
		return ctx.time;
	}));
}

/*
 * Given and event, return the rational duration of the event;
 */
function calculateDuration (ctx) {

	// If the event has no type it has no duration.
	if (!ctx.type) return 0;

	var s = ctx.tuplet ? ctx.tuplet.split("/") : null,
		tuplet = s ? new F(s[0], s[1]) : null,
		dur = new F(1, ctx.value),
		dots = ctx.dots || 0;

	for (let i = 0; i < dots; i++) {
		dur = dur.mul(1.5);
	}

	if (tuplet && dur) {
		dur = dur.mul(tuplet);
	}

	return dur.valueOf();
}

function sortByKey (obj) {
	var times = _.keys(obj);

	var sortedTimes = _.sortBy(times, function (t) {
		return parseFloat(t);
	});

	return _.map(sortedTimes, function (time) {
		return obj[time];
	});
}

export {
	getTime,
	getMeasure,
	getMeasureByTime,
	getBeat,
	compareTimes,
	compareByPosition,
	compareByTime,
	getTimeSigDuration,
	getMeasureDuration,
	getMeasureNumber,
	splitByTime,
	splitByMeasure,
	calculateDuration,
	parseSignature
}
