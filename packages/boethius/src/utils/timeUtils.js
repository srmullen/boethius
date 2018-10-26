import _ from "lodash";
import F from "fraction.js";
import {isNote, isChord, isRest, isTimeSignature, isRepeat} from "../types";

/**
 * @param signature - TimeSignaure or time signature value or tuplet represented as a String. ex. TimeSig({value: "4/4"}) or "4/4", "h"
 * @return {Number[]}
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

/**
 * @return {Number} - the measure number as an integer
 */
function getMeasure (time=0, [beats, value]) {
	const measureDuration = beats * (1/value);
	return Math.floor(time/measureDuration);
}

/**
 * @param {Number} time - number
 * @param {String | []} timesig - string or arrary representation of timeSig value.
 * @param {Number} offset - number representing point in time from which to calculate the beat from.
 * @return {Number} - float representation
 */
function getBeat (time, timeSig, offset=0) {
	let [beats, value] = _.isArray(timeSig) ? timeSig : parseSignature(timeSig),
		measureDuration = beats * (1/value),
		beatTime = (time - offset) % measureDuration;

	return beatTime/(1/value);
}

/**
 * @param {Measure[]} measures
 * @param {Number | {?time, ?measure}} item - Any object with a time or measure property.
 * @return {{time, measure, beat}} - object with time, measure, and beat.
 */
function getTime (measures, item) {
	// Make sure item is an object;
	item = _.isNumber(item) ? {time: item} : item;

	if (_.isNumber(item.time)) {
		const measure = getMeasureNumber(measures, item.time);
		const measureView = measures.find(view => view.value === measure);
		const beat = item.beat || getBeat(item.time, measureView.timeSig, measureView.startsAt);
		return {time: item.time, measure, beat};
	} else {

		const ret = {
			beat: item.beat,
			measure: item.measure,
			time: item.time
		};

		if (!_.isNumber(item.measure)) {
			ret.measure = getMeasureNumber(measures, item.time);
		}

		const lastMeasure = _.last(measures);
		if (ret.measure > lastMeasure.value) {
			ret.time = getMeasureDuration(lastMeasure) + lastMeasure.startsAt;
		}

		const measureView = measures.find(view => view.value === ret.measure);

		// time signatures are always at the beginning of a measure.
		if (isTimeSignature(item)) {
			ret.time = measureView.startsAt;
			ret.beat = 0;
		}

		if (!_.isNumber(item.time) && !_.isNumber(ret.time)) {
			const baseTime = measureView.startsAt;
			if (_.isNumber(item.beat)) {
				ret.time = baseTime + getBeatTime(measureView.timeSig, item.beat);
			} else {
				ret.time = baseTime;
			}
		}

		if (measureView) {
			const timeSig = measureView.timeSig;
			const [beats, value] = _.isArray(timeSig) ? timeSig : parseSignature(timeSig);
			// If beat is greater than the number of beats in a measure then they need to be adjusted.
			if (_.isNumber(ret.beat) && ret.beat >= beats) {
				const extraMeasures = Math.floor(ret.beat / beats);
				ret.measure = ret.measure + extraMeasures;
				ret.beat = ret.beat % beats;
			} else {
				ret.beat = item.beat || getBeat(ret.time, timeSig, measureView.startsAt);
			}
		}

		return ret;
	}
}

/**
 * @param {Measure[]} measures
 * @param {Number | {time | measure, ?beat}} t1 - Any object with a time or measure property.
 * @param {Number | {time | measure, ?beat}} t2 - Any object with a time or measure property.
 * @return {{time, measure, beat}} - object with time, measure, and beat.
 */
function addTimes (measures, t1, t2) {
	const time1 = getTime(measures, t1);
	if (_.isNumber(t2)) {
		return getTime(measures, time1.time + t2);
	} else {
		if (_.isNumber(t2.time)) {
			return getTime(measures, time1.time + t2.time);
		} else {
			const measure = time1.measure + (t2.measure || 0);
			const beat = time1.beat + (t2.beat || 0);
			return getTime(measures, {measure, beat});
		}
	}
}

/*
 * @param measures TimeSignature[]
 * @param item - Any object with a time or measure property.
 * @return time object - object with time, measure, and beat.
 */
function getTimeFromSignatures (timeSigs, item) {
	let beat = item.beat;
	let measure = item.measure;
	let time = item.time;

	if (!_.isNumber(item.time) && !_.isNumber(item.measure)) {
		throw new Error('Item must have time or measure property');
	}

	if (!_.isNumber(item.measure)) {
		measure = 0;
		const timeSignature = getTimeSignatureAtMeasure(timeSigs, measure);
		let measureTime = getTimeSigDuration(timeSignature);
		while (measureTime <= item.time) {
			measure++;
			const timeSignature = getTimeSignatureAtMeasure(timeSigs, measure);
			measureTime += getTimeSigDuration(timeSignature);
		}

		beat = getBeat(item.time, timeSignature, getTimeAtMeasure(timeSigs, measure));
	}

	if (!_.isNumber(item.time)) {
		const timeSig = getTimeSignatureAtMeasure(timeSigs, item.measure);
		const measureTime = getTimeAtMeasure(timeSigs, item.measure);
		const beatTime = getBeatTime(timeSig, item.beat);
		time = measureTime + beatTime;
	}

	return {time, measure, beat};
}

/*
 * Get the TimeSignature at the given measure.
 * @param timeSigs TimeSignature[] - Array of TimeSignatures.
 * @param measure Number - The measure number to get the timeSignature for.
 * @return TimeSignature
 */
function getTimeSignatureAtMeasure(timeSigs, measure) {
	if (!timeSigs.length) {
		throw new Error('No TimeSignatures given.');
	} else if (timeSigs.length === 1) {
		return timeSigs[0];
	} else {
		for (let i = 0; i < timeSigs.length; i++) {
			const timeSig = timeSigs[i];
			if (timeSig.measure === measure) {
				return timeSig;
			} else if (timeSig.measure > measure) {
				return timeSigs[i-1];
			}
		}
		return _.last(timeSigs);
	}
}

/*
 * Get the time at which the given measure starts.
 * @param timeSigs TimeSignaure[]
 * @param measure Number
 * @return Number
 */
function getTimeAtMeasure (timeSigs, measure) {
	let time = 0;
	for (let i = 0; i < measure; i++) {
		const timeSig = getTimeSignatureAtMeasure(timeSigs, i);
		time += getTimeSigDuration(timeSig);
	}
	return time;
}

function getBeatTime (timeSig, beat=0) {
	const [,beatType] = parseSignature(timeSig);
	return (1/beatType) * beat;
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
	[f1.toFraction()]: Object.freeze({value: 1, dots: 0}),
	[f2.toFraction()]: Object.freeze({value: 2, dots: 0}),
	[f4.toFraction()]: Object.freeze({value: 4, dots: 0}),
	[f8.toFraction()]: Object.freeze({value: 8, dots: 0}),
	[f16.toFraction()]: Object.freeze({value: 16, dots: 0}),
	[f32.toFraction()]: Object.freeze({value: 32, dots: 0}),
	[f64.toFraction()]: Object.freeze({value: 64, dots: 0}),
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

/*
 * @param time context object
 * @return Number or undefined if there is no context
 */
function getTimeFromContext (ctx) {
    return ctx && ctx.time ? ctx.time.time : undefined;
}

/*
 * @param timeFn - Function that returns a time object.
 * @param times context[][]
 */
function nextTimes (timeFn, times) {
	const nextTime = _.minBy(
		times.map(items => {
			if (items.length) {
				return timeFn(_.first(items));
			} else {
				return {time: Infinity};
			}
		}),
		(time) => time.time
	);
    const ctxs = _.compact(_.map(times, (items) => {
		const [nexts, rests] = _.partition(items, item => timeFn(item).time === nextTime.time);
		return {
			time: nextTime,
			nexts,
			rests
		};
	}));

	return ctxs.reduce((acc, ctx) => {
		return {
			time: ctx.time,
			nexts: acc.nexts.concat(ctx.nexts),
			rests: acc.rests.concat([ctx.rests])
		};
	}, {nexts: [], rests: []});
}

/*
 * @param timeFn - Function to get the time from items.
 * @param fn - function to apply to the time context
 * @param times context[][]
 */
export function iterateByTime (timeFn, fn, times) {
    let {time, nexts, rests} = nextTimes(timeFn, times);
    const ret = [];
    while (_.compact(nexts).length) {
        ret.push(fn(time, nexts));
        // [time, nexts, rests] = nextTimes(timeFn, rests);
		const obj = nextTimes(timeFn, rests);
		time = obj.time;
		nexts = obj.nexts;
		rests = obj.rests;
    }

    return ret;
}

export {
	addTimes,
	getTime,
	getTimeFromSignatures,
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
