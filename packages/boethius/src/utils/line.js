import paper from "paper/dist/paper-core";
import _ from "lodash";
import {getTime} from "./timeUtils";
import {isNote} from "../types";
import * as placement from "./placement";
import {concat} from "./common";

const {calculateTimeLength} = placement;

function lineGetter (name) {
	return function (lineGroup) {
		if (lineGroup instanceof paper.PlacedSymbol) {
			return lineGroup.symbol.definition.children[name].segments[0].point;
		} else {
			return lineGroup.children[name].segments[0].point;
		}
	};
}

const f = lineGetter("F");
const d = lineGetter("D");
const b = lineGetter("B");
const g = lineGetter("G");
const e = lineGetter("E");

function getMeasure (line) {
	const positions = _.map(line.children, measure => measure.barlines[0].position);
	return function (point) {
		const diffs = _.map(positions, p => point.x - p.x);
		return line.children[_.indexOf(diffs, _.min(_.filter(diffs, diff => diff >= 0)))];
	};
}

/*
 * @param line - Line
 * @param voices - Voice[]
 * @param start - Number start time of the line.
 * @param end - Number end time of the line
 * @return - items of each voice that are on the line. Item[][] - first array is the top voice, second array is the lower voice.
 */
function getLineItems (line, voices, start, end) {
    return _.reduce(line.voices, (acc, voiceConfig) => {
        if (_.isString(voiceConfig)) {
            const voice = _.find(voices, voice => voice.name === voiceConfig);
            return voice ? concat(acc, voice.getTimeFrame(start, end, true)) : acc;
        } else if (_.isObject(voiceConfig)) {
            // TODO: get the time frame from the voice
        } else {
            return acc;
        }
    }, []);
}

/*
 * @param line - Line
 * @param measures - Measure[]
 * @param voices - Item[]
 * @return [...{time, items, context}] Array ordered by time
 */
function getTimeContexts (line, measures, items) {
	const allItems = line.markings.concat(items);

	const times = _.map(_.groupBy(allItems, (item) => {
		return getTime(measures, item).time;
	}), (v) => {
		const time = getTime(measures, v[0]);
		return {time, items: v, context: line.contextAt(time)};
	});

	const sortedTimes = _.sortBy(times, ({time}) => time.time);

	return sortedTimes;
}

function calculateMeasureLengths (measures, times, noteHeadWidth, shortestDuration) {
	// group items by measure.
	const itemsInMeasure = _.groupBy(times, (item) => {
		return item.time.measure;
	});

	const measureLengths = _.map(measures, (measure) => {
		// sum the length of all times in the measure.
		const [markingsLength, durationedLength] = _.reduce(itemsInMeasure[measure.value], (acc, {items}) => {
			// calculate the length of each time in the measure and sum the markings and duration items
			const [marking, durationed] = calculateTimeLength(items, shortestDuration);
			return [acc[0] + marking, acc[1] + durationed];
		}, [0, 0]);

		// use the default measure length if there are no durationed items in the measure
		return markingsLength + (durationedLength ? durationedLength : Scored.config.measure.length) + noteHeadWidth;
	});

	return measureLengths;
}

function positionMarkings (lineCenter, cursor, {items}) {
    const {
		clef: clefs,
		key: keys,
		timeSig: timeSigs,
		repeat: repeats
	} = _.groupBy(items, item => item.type);

	// place the markings
	if (clefs) cursor += placement.placeMarking(lineCenter, cursor, clefs[0]);
	if (keys) cursor += placement.placeMarking(lineCenter, cursor, keys[0]);
	if (timeSigs) cursor += placement.placeMarking(lineCenter, cursor, timeSigs[0]);
	if (repeats) cursor += placement.placeMarking(lineCenter, cursor, repeats[0]);

    return cursor;
}

export {
	f,
	d,
	b,
	g,
	e,
	getMeasure,
	getLineItems,
	getTimeContexts,
	calculateMeasureLengths,
	positionMarkings
};
