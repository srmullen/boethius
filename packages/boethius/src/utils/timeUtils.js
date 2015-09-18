// let _ = require("../../bower_components/lodash/lodash"),
// 	F = require("../../bower_components/fraction.js/fraction.min");
let _ = require("lodash"),
	F = require("fraction.js");

/*
 * @param sig {String} - ex. "4/4", "h"
 */
function sigToNums (sig) {
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
	var measureDuration = beats * (1/value);
	return Math.floor(time/measureDuration);
}

/*
 * Still need to add in offset
 * @return {number} - integer representation
 */
function getBeat (time, [beats, value], offset=0) {
	var measureDuration = beats * (1/value),
		beatTime = (time - offset) % measureDuration;

	// return Math.floor(beatTime/(1/value));
	return beatTime/(1/value);
}

/*
 * @return {number} - time of the first beat in the measure
 */
function getTime (measure, [beats, value], offset=0) {
	return measure * beats * (1/value) + offset;
}

/*
 * @param timeSig {String}
 */
var getTimeSigDuration = _.memoize(function (timeSig) {
	// let [beats, value] = timeSig.split("/");
	let [beats, value] = sigToNums(timeSig);
	return beats * (1/value);
});

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

	return dur.toNumber();
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

module.exports = {
	getTime,
	getMeasure,
	getBeat,
	compareTimes,
	compareByPosition,
	compareByTime,
	getTimeSigDuration,
	getMeasureDuration,
	sigToNums,
	splitByTime,
	splitByMeasure,
	calculateDuration
}
