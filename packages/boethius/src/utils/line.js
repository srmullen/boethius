import _ from "lodash";
import {getTime} from "./timeUtils";
import {isMarking} from "../types";
import {getStaffSpace} from "./placement";

function lineGetter (name) {
	return function (lineGroup) {
		if (lineGroup instanceof paper.PlacedSymbol) {
			return lineGroup.symbol.definition.children[name].segments[0].point;
		} else {
			return lineGroup.children[name].segments[0].point;
		}
	}
}

const f = lineGetter("F"),
	  d = lineGetter("D"),
	  b = lineGetter("B"),
	  g = lineGetter("G"),
	  e = lineGetter("E");

/*
 * getClosestLine :: line -> (point -> noteName)
 */
function getClosestLine (line) {
	const lineGroup = line.staves[0],
	      positions = [f(lineGroup), d(lineGroup), b(lineGroup), g(lineGroup), e(lineGroup)];
	return function (point) {
		let diffs = _.map(positions, (p) => Math.abs(point.y - p.y));
		return _.indexOf(diffs, _.min(diffs));
	}
}

/*
 * getClosestLine :: line -> (point -> measure)
 */
function getMeasure (line) {
	const positions = _.map(line.children, measure => measure.barlines[0].position);
	return function (point) {
		let diffs = _.map(positions, p => point.x - p.x);
		return line.children[_.indexOf(diffs, _.min(_.filter(diffs, diff => diff >= 0)))];
	}
}

/*
 * @param line - Line
 * @param measures - Measure[]
 * @param voices - Item[]
 * @return [...{time, items, context}] Array ordered by time
 */
function getTimeContexts (line, measures, items) {
	let allItems = line.markings.concat(items);

	let times = _.sortBy(_.map(_.groupBy(allItems, (item) => {
		return getTime(measures, item).time;
	}), (v, k) => {
		let time = getTime(measures, v[0]);
		return {time, items: v, context: line.contextAt(measures, time)};
	}), ({time}) => time.time);

	return times;
}

function calculateMeasureLengths (measures, times, noteHeadWidth, shortestDuration) {
	// group items by measure.
	let itemsInMeasure = _.groupBy(times, (item) => {
		return item.time.measure;
	});

	let measureLengths = _.map(measures, (measure, i) => {
		let measureLength = _.sum(_.map(itemsInMeasure[i], ({items}) => {
			let [markings, voiceItems] = _.partition(items, isMarking),
				markingsLength = _.sum(markings.map(marking => marking.group.bounds.width + noteHeadWidth)),
				voiceItemsLength = _.min(_.map(voiceItems, item => {
					return item.group.bounds.width + (noteHeadWidth * getStaffSpace(shortestDuration, item));
				}));
			return markingsLength + voiceItemsLength
		}));
		measureLength += noteHeadWidth;
		// measure.length = measureLength;
		return measureLength;
	});

	return measureLengths;
}

export {
	f,
	d,
	b,
	g,
	e,
	getClosestLine,
	getMeasure,
	getTimeContexts,
	calculateMeasureLengths
}
