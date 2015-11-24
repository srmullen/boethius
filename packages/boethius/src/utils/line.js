import _ from "lodash";
import {getTime} from "./timeUtils";

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
 * @param voices - Voice[]
 * @return [...{time, items, context}] Array ordered by time
 */
function getTimeContexts (line, measures, voices) {
	let allItems = line.markings.concat(_.reduce(voices, (acc, voice) => {
		return acc.concat(voice.children);
	}, []));

	let times = _.sortBy(_.map(_.groupBy(allItems, (item) => {
		return getTime(measures, item).time;
	}), (v, k) => {
		let time = getTime(measures, v[0]);
		return {time, items: v, context: line.contextAt(measures, time)};
	}), ({time}) => time.time);

	return times;
}

/*
 * @param times - array describing the rendering context as returned from getTimeContexts.
 * @return String[] - Array with the notes for which accidentals already exist in the measure.
 */
function getAccidentals (times) {

}

export {
	f,
	d,
	b,
	g,
	e,
	getClosestLine,
	getMeasure,
	getTimeContexts
}
