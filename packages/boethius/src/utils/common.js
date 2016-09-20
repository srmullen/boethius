import _ from "lodash";
import constants from "../constants";

function concat (a = [], b) {
	return a.concat([b]);
}

/*
 * partitions the collection each time f returns a new value
 */
function partitionBy (coll, f) {
	let previousValue;

	return _.reduce(coll, (acc, el) => {
		let newValue = f(el);
		if (previousValue !== newValue || !acc[acc.length-1]) {
			let partition = [el];
			acc.push(partition);
		} else {
			acc[acc.length-1].push(el);
		}
		previousValue = newValue;
		return acc;
	}, []);
}

/*
 * partitions the coll everytime f returns truthy.
 */
function partitionWhen (coll, f) {
	return _.reduce(coll, (acc, el) => {
		if (f(el) || !acc[acc.length-1]) {
			let partition = [el];
			acc.push(partition);
		} else {
			acc[acc.length-1].push(el);
		}
		return acc;
	}, []);
}

function doTimes (times, fn) {
	const ret = [];
	for (let i = 0; i < times; i++) {
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
 * @param (coll1, coll2) => value - Function of any number of arguments to map across the colls until one of the is exhausted.
 * @param deepColl - nested collection.
 * @param flatColl - flat coll is grouped into lenths of each element of the nested collection.
 */
function mapDeep (fn, deepColl, flatColl) {
	let itemIdx = 0;
	return _.map(deepColl, arr => {
		let section = _.slice(flatColl, itemIdx, itemIdx + arr.length);
		itemIdx += arr.length;
		return fn(arr, section);
	});
}

/*
 * Takes a variable number of functions. Returns a function that is the juxtposition of those functions.
 * ex. juxt(a, b, c)(x) = [a(x), b(x), c(x)]
 */
function juxt (...fns) {
	return (x) => fns.map(fn => fn(x));
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
		ret = new Array(coll.length + 1);
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

function clone (item) {
	const Constructor = item.constructor;
	return new Constructor(item);
}

export {
	concat,
	doTimes,
	serialize,
	partitionBy,
	partitionWhen,
	map,
	mapDeep,
	juxt,
	reductions,
	isEven,
	isOdd,
	clone
};
