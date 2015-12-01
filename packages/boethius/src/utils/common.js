import _ from "lodash";
import constants from "../constants";

const debugEvents = {
	onMouseEnter: () => {
		console.log("entered");
	},

	onMouseLeave: () => {
		console.log("left");
	},

	onMouseDown: () => {
		console.log("down");
	},

	onMouseUp: () => {
		console.log("up");
	}
}

function getEventHandlers (group) {
	if (group.name === constants.type.note ||
		group.name === constants.type.rest ||
		group.name === constants.type.clef ||
		group.name === constants.type.key  ||
		group.name === constants.type.timeSig) {
		return {
			onMouseEnter: () => {
				let bounds = group.children.bounds || group.bounds;
				bounds.fillColor = "blue";
				bounds.opacity = 0.2;
			},

			onMouseLeave: () => {
				let bounds = group.children.bounds || group.bounds;
				bounds.fillColor = "#FFF";
				bounds.opacity = 0;
			},

			onMouseDown: () => {
				let bounds = group.children.bounds || group.bounds;
				bounds.fillColor = "red";
				// console.log(item.serialize());
			},

			onMouseUp: () => {
				let bounds = group.children.bounds || group.bounds;
				bounds.fillColor = "blue";
			}
		}
	} else {
		return debugEvents;
	}
}

function addEvents (group) {
	_.extend(group, getEventHandlers(group));
}

function debugGroupEvents (group) {
	_.extend(item.group, debugEvents);
}

function concat (a, b) {
	return a.concat([b]);
}

/*
 * partitions the collection each time f returns a new value
 */
function partitionBy (coll, f) {
	let previousValue;

	return _.reduce(coll, (acc, el) => {
		let newValue = f(el);
		if (previousValue === newValue) {
			acc[acc.length-1].push(el);
		} else {
			let partition = [el];
			acc.push(partition);
		}
		previousValue = newValue;
		return acc;
	}, []);
}

function doTimes (times, fn) {
	var ret = [], i = 0;
	for (; i < times; i++) {
		ret.push(fn(i));
	}
	return ret;
}

function serialize (item) {
	return _.filter([item.type, item, _.map(item.children, serialize)], v => _.size(v));
}

/*
 * @param fn - Function of any number of arguments to map across the colls until one of the is exhausted.
 * 		Ignores remaining items in other colls.
 * @param colls - any number of collections each of which will be passed to each arg of fn
 * @return Array of results from fn.
 */
function map (fn, ...colls) {
	let l = _.min(colls.map(coll => coll.length)),
		ret = new Array(l);
	for (let i = 0; i < l; i++) {
		let elms = colls.map(coll => coll[i]);
		ret[i] = fn.apply(null, elms);
	}
	return ret;
}

/*
 * Takes a variable number of functions. Returns a function that is the juxtposition of those functions.
 * ex. juxt(a, b, c)(x) = [a(x), b(x), c(x)]
 */
function juxt (...fns) {
	return (x) => fns.map(fn => fn(x));
}

function isMarking (item) {
	return item.type === constants.type.clef ||
			item.type === constants.type.key ||
			item.type === constants.type.timeSig ||
			false;
}

/*
 * @param reducer - Function
 * @param coll - collection to reduce over.
 * @param init - optional initialization value
 * @return - Array of intermediate results from the reducing function.
 */
function reductions (reducer, coll, init) {
	let ret, idx = 1, i = 0;
	if (!_.isUndefined(init)) {
		ret = new Array(coll.length + 1)
		ret[0] = init;
	} else {
		ret = new Array(coll.length);
		ret[0] = coll[0];
		i++;
	}
	for (; i < coll.length; i++, idx++) {
		ret[idx] = reducer(ret[idx-1], coll[i]);
	}
	return ret;
}

function isEven (n) {
	return !(n % 2);
}

function isOdd (n) {
	return !isEven(n);
}

export {
	concat,
	doTimes,
	addEvents,
	debugGroupEvents,
	serialize,
	partitionBy,
	map,
	juxt,
	isMarking,
	reductions,
	isEven,
	isOdd
}
