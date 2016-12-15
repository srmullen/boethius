import _ from "lodash";
import F from "fraction.js";
import {isNote, isChord, isRest, isTimeSignature, isRepeat} from "../types";

/*
 * @param signature - TimeSignaure or time signature value or tuplet represented as a String. ex. TimeSig({value: "4/4"}) or "4/4", "h"
 * @return Number[]
 */
function parseSignature (signature) {
	const sig = isTimeSignature(signature) ? signature.value : signature;

	if (sig === "c" || sig === "h") {
		return [4, 4];
	} else {
		const nums = sig.split("/");
		return [+nums[0], +nums[1]]; // convert strings to numbers
	}
}

/*
 * @return {number} - the measure number as an integer
 */
function getMeasure (time=0, [beats, value]) {
	const measureDuration = beats * (1/value);
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
		time = item.time;

	if (!_.isNumber(item.measure)) {
		measure = getMeasureNumber(measures, item.time);
	}

	if (measure >= measures.length) {
		const lastMeasure = _.last(measures);
		time = getMeasureDuration(lastMeasure) + lastMeasure.startsAt;
	}

	const measureView = measures[measure];

	// time signatures are always at the beginning of a measure.
	if (isTimeSignature(item)) {
		time = measureView.startsAt;
		beat = 0;
	}

	if (!_.isNumber(item.time) && !_.isNumber(time)) {
		// const baseTime = getTimeNumber(measure, measureView.timeSig);
		const baseTime = measureView.startsAt;
		if (_.isNumber(item.beat)) {
			const [,beatType] = parseSignature(measureView.timeSig);
			const beatTime = (1/beatType) * item.beat;
			time = baseTime + beatTime;
		} else {
			time = baseTime;
		}
	}

	if (measureView) {
		beat = item.beat || getBeat(time, measureView.timeSig, measureView.startsAt);
	}

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
	const measure = _.find(measures, (measure) => {
		const measureEndsAt = measure.startsAt + getMeasureDuration(measure);
		return time >= measure.startsAt && time < measureEndsAt;
	});

	// If the time isn't in the given measures then measure number will be -1.
	// Return the index of the last measure + 1.
	return measure ? measure.value : _.last(measures).value + 1;
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
function getTimeSigDuration (timeSig) {
	let [beats, value] = parseSignature(timeSig);
	return beats * (1/value);
}

/*
 * @param tuplet - String representing the tuplet (ex. "3/2")
 * @param value - Number representing note value.
 * @return - duration of the fully realized tuplet.
 */
function calculateTupletDuration (tuplet, value) {
	const [,tupletDenominator] = parseSignature(tuplet);
	return tupletDenominator * (1/value);
}

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

function equals (time1, time2) {
	return time1.time === time2.time;
}

function splitByMeasure (events) {
	const measures = _.mapValues(_.groupBy(events, function ([, ctx]) {
		return ctx.measure || 0;
	}), function (measure) {
		return _.groupBy(measure, function ([, ctx]) {
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
 * @param item - Scored item. Given an item, return the rational duration of the item;
 * @return Number
 */
function calculateDuration (item) {

	// The item doesn't have a duration unless it's one of the following types.
	if (!(isNote(item) || isChord(item) || isRest(item) ||isRepeat(item))) return 0;

	const s = item.tuplet ? item.tuplet.split("/") : null;
	const tuplet = s ? new F(s[0], s[1]) : null;
	const dots = item.dots || 0;

	let dur = new F(1, item.value);

	for (let i = 0; i < dots; i++) {
		dur = dur.mul(1.5);
	}

	if (tuplet && dur) {
		dur = dur.mul(s[1]).div(s[0]);
	}

	return dur;
}

function sortByKey (obj) {
	const times = _.keys(obj);

	const sortedTimes = _.sortBy(times, function (t) {
		return parseFloat(t);
	});

	return _.map(sortedTimes, function (time) {
		return obj[time];
	});
}

/*
 * @param items - Array of items that have a duration.
 * @return Number
 */
function sumDurations (items) {
	return _.reduce(items, (sum, item) => {
		return sum.add(calculateDuration(item));
	}, F(0)).valueOf();
}

export function gt (t1, t2) {
	const time1 = _.isObject(t1) ? t1.time : t1;
	const time2 = _.isObject(t2) ? t2.time : t2;
	return time1 > time2;
}

export function lt (t1, t2) {
	const time1 = _.isObject(t1) ? t1.time : t1;
	const time2 = _.isObject(t2) ? t2.time : t2;
	return time1 < time2;
}

export function gte (t1, t2) {
	const time1 = _.isObject(t1) ? t1.time : t1;
	const time2 = _.isObject(t2) ? t2.time : t2;
	return time1 >= time2;
}

export function lte (t1, t2) {
	const time1 = _.isObject(t1) ? t1.time : t1;
	const time2 = _.isObject(t2) ? t2.time : t2;
	return time1 <= time2;
}

const f1 = F(1);
const f2 = F(1, 2);
const f4 = F(1, 4)
const f8 = F(1, 8);
const f16 = F(1, 16);
const f32 = F(1, 32);
const f64 = F(1, 64);
const f128 = F(1, 128);
const f256 = F(1, 256);
const durationTable = {
	// basic
	[f1.toFraction()]: Object.freeze({value: 1}),
	[f2.toFraction()]: Object.freeze({value: 2}),
	[f4.toFraction()]: Object.freeze({value: 4}),
	[f8.toFraction()]: Object.freeze({value: 8}),
	[f16.toFraction()]: Object.freeze({value: 16}),
	[f32.toFraction()]: Object.freeze({value: 32}),
	[f64.toFraction()]: Object.freeze({value: 64}),
	// single dot
	[f1.add(f2).toFraction()]: Object.freeze({value: 1, dots: 1}),
	[f2.add(f4).toFraction()]: Object.freeze({value: 2, dots: 1}),
	[f4.add(f8).toFraction()]: Object.freeze({value: 4, dots: 1}),
	[f8.add(f16).toFraction()]: Object.freeze({value: 8, dots: 1}),
	[f16.add(f32).toFraction()]: Object.freeze({value: 16, dots: 1}),
	[f32.add(f64).toFraction()]: Object.freeze({value: 32, dots: 1}),
	[f64.add(f128).toFraction()]: Object.freeze({value: 64, dots: 1}),
	// double dot
	[f1.add(f2).add(f4).toFraction()]: Object.freeze({value: 1, dots: 2}),
	[f2.add(f4).add(f8).toFraction()]: Object.freeze({value: 2, dots: 2}),
	[f4.add(f8).add(f16).toFraction()]: Object.freeze({value: 4, dots: 2}),
	[f8.add(f16).add(f32).toFraction()]: Object.freeze({value: 8, dots: 2}),
	[f16.add(f32).add(f64).toFraction()]: Object.freeze({value: 16, dots: 2}),
	[f32.add(f64).add(f128).toFraction()]: Object.freeze({value: 32, dots: 2}),
	[f64.add(f128).add(f256).toFraction()]: Object.freeze({value: 64, dots: 2}),
}

/*
 * @param abs {Number} - Duration in absolute time.
 * @return {Object} - {value, dots, tuplet};
 */
export function absoluteToRelativeDuration (abs) {
	return durationTable[F(abs).toFraction()];
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
	calculateTupletDuration,
	getMeasureDuration,
	getMeasureNumber,
	splitByTime,
	splitByMeasure,
	calculateDuration,
	parseSignature,
	sumDurations,
	equals
};
