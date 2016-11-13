import _ from "lodash";

import {partitionBy} from "./common";
import * as placement from "./placement";
import {isNote} from "../types";

/*
 * Given lines and voices, returns an array of item arrays. The first array is all items to be rendered on the first line, and so on.
 * @param lines - Line[]
 * @param voices- Voice[]
 * @return Items[][]
 */
function getStaffItems (lines, voices) {
    return _.map(lines, (line) => {
        return _.reduce(line.voices, (acc, voiceConfig) => { // FIXME: duplication of getLineItems
            if (_.isString(voiceConfig)) {
                const voice = _.find(voices, voice => voice.name === voiceConfig);
                return voice ? acc.concat(voice.children) : acc;
            } else if (_.isObject(voiceConfig)) {
                // TODO: get the time frame from the voice
            } else {
                return acc;
            }
        }, []);
    });
}

/*
 * @param timeContexts - array of lineContexts.
 * @param shortestDuration - float representation of shortest duration in the measure.
 * @return {time: Time, [markingLength, durationedLength]}
 */
function calculateTimeLengths (timeContexts, shortestDuration) {
    return _.map(timeContexts, (lineContexts) => {
		// get the time
		const time = _.find(lineContexts, ctx => !!ctx).time;

		// get all items at the time
		const allItems = lineContexts.reduce((acc, line) => {
			return line ? acc.concat(line.items) : acc;
		}, []);

		const timeLength = placement.calculateTimeLength(allItems, shortestDuration);

		return {time, length: timeLength};
	});
}

/*
 * @param timeLengths - {time, length[]}[]
 * @return length[]
 */
function calculateMeasureLengths (timeLengths) {
    const noteHeadWidth = Scored.config.note.head.width;
    return _.map(partitionBy(timeLengths, ({time}) => time.measure), (measureTimes) => {
		const [markingsLength, durationedLength] = _.reduce(measureTimes, (acc, {length}) => {
			// sum the marking and duration item lengths
			return [acc[0] + length[0], acc[1] + length[1]];
		}, [0, 0]);

        const measureLength = markingsLength + (durationedLength ? durationedLength : Scored.config.measure.length) + noteHeadWidth;

        return measureLength;
	});
}

/*
 * @param numMeasures - The number of measure lengths to return.
 * @param measureLengths Number[] - The measure lengths that have been calculated already.
 * @return Number[]
 */
function addDefaultMeasureLengths (numMeasures, measureLengths) {
    const defaultMeasureLengths = [];

    for (let i = 0; i < numMeasures; i++) {
        const length = measureLengths[i];
        if (length) {
            defaultMeasureLengths.push(length);
        } else {
            defaultMeasureLengths.push(
                Scored.config.measure.length + Scored.config.note.head.width
            );
        }
    }

    return defaultMeasureLengths;
}

/*
 * @param time context object
 * @return Number or undefined if there is no context
 */
function getTimeFromContext (ctx) {
    return ctx && ctx.time ? ctx.time.time : undefined;
}

/*
 * @param times context[][]
 */
function nextTimes (times) {
    const ctxs = _.map(times, _.first);

    if (!_.compact(ctxs).length) return []; // return nothing if there are no more contexts

    const nextTime = _.min(ctxs, getTimeFromContext).time.time;
    const nexts = [];
    const rests = [];
    for (let i = 0; i < ctxs.length; i++) {
        if (getTimeFromContext(ctxs[i]) === nextTime) {
            nexts.push(ctxs[i]);
            rests.push(_.rest(times[i]));
        } else {
            nexts.push(null);
            rests.push(times[i]);
        }
    }
    return [nexts, rests];
}

/*
 * @param fn - function to apply to the time context
 * @param times context[][]
 */
function iterateByTime (fn, times) {
    let [nexts, rests] = nextTimes(times);
    const ret = [];
    while (_.compact(nexts).length) {
        ret.push(fn(nexts));
        [nexts, rests] = nextTimes(rests);
    }

    return ret;
}

export {
    getStaffItems,
    calculateTimeLengths,
    calculateMeasureLengths,
    addDefaultMeasureLengths,
    nextTimes,
    iterateByTime
};
