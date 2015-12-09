import _ from "lodash";

/*
 * @param staff - Staff
 * @param measures - Measure[]
 * @param voices - Voice[]
 * @return [...{time, items, context}] Array ordered by time
 */
function getTimeContexts (staff, measures, voices) {
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

export {getTimeContexts};
