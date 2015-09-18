// let _ = require("../bower_components/lodash/lodash.min"),
let _ = require("lodash"),

	common = require("./utils/common"),
	timeUtils = require("./utils/timeUtils"),
	Note = require("./views/Note"),
	Rest = require("./views/Rest");

let attachAt = _.compose(attach, at);

let eventHandlers = {

	staff: function (acc, context, elements) {
		return createEvents(context, acc, elements);
	},

	line: function (acc, context, elements) {
		return createEvents(context, acc, elements);
	},

	/*
	 * Changes the voice events are being sent to.
	 */
	voice: function (acc, {value: voice}, elements) {
		var context = _.extend({}, arguments[1], {voice: voice});
		return createEvents({voice: voice}, acc, elements);
	},

	tuplet: function (acc, {value: tuplet}, elements) {
		var context = _.extend({}, arguments[1], {tuplet: tuplet});
		return createEvents(context, acc, elements);
	},

	note: attachAt((__, context) => new Note(context)),

	rest: attachAt((__, context) => new Rest(context)),

	clef: attach(function (acc, context) {
		context.beat = context.beat || 0;
		return ["clef", context];
	}),

	timeSig: attach(function (acc, context) {
		context.beat = context.beat || 0;
		return ["timeSig", context];
	}),

	key: attach(function (acc, context) {
		context.beat = context.beat || 0;
		return ["key", context];
	}),

	chord: attachAt(function (acc, context) {
		return ["chord", context];
	}),

	slurStart: function (acc, context) {
		return ["slurStart", context];
	},

	slurEnd: function (acc, context) {
		return ["slurEnd", context];
	}

}

/*
 * Should return a chronologically ordered sequence of events.
 * These events are leaf nodes of the data structure (notes, rests, dynamics, lyrics?, chord symbols, etc).
 * Everything else will end up as contextual information on the event.
 * Some leaf node events also create contextual changes, such as clef and meter changes.
 */
function createEvents (parent={}, acc=[], [action, context={}, elements=[]]) {
	var music = arguments[2];

	if (_.isString(action)) {
		let handler = eventHandlers[action];
		if (handler) {
			return handler(acc, _.extend({}, parent, context), elements);
		} else {
			return [];
		}
	} else {
		return _.reduce(music, _.partial(createEvents, parent), acc);
	}
}

/*
 *
 */
function contextEvents (fn) {
	return function (acc, {clef: clef, timeSig: timeSig, key: key, line: line}, elements) {
		var args = Array.prototype.slice.call(arguments, 0);
		if (clef) acc = eventHandlers["clef"].call(null, acc, {value: args[1].clef, line: line}, elements);
		if (timeSig) acc = eventHandlers["timeSig"].call(null, acc, {value: args[1].timeSig, line: line}, elements);
		if (key) acc = eventHandlers["key"].call(null, acc, {value: args[1].key, line: line}, elements);
		return fn(acc, args[1], elements);
	}
}

/*
 * @return - Function that concats the result of its calling onto the first argument.
 */
function attach (fn) {
	return function (...args) {
		return common.concat(args[0], fn(...args));
	}
}

/*
 * @return - Runction that sets time on the events context.
 */
function at (fn) {
	return function (...args) {
		let acc = args[0],
			ctx = fn(...args),
			previousEvent = _.findLast(acc, e => e.voice === ctx.voice);


		if (previousEvent) {
			ctx.time = previousEvent.time + (timeUtils.calculateDuration(previousEvent) || 0);
		} else {
			ctx.time = 0;
		}

		return ctx;
	}
}

module.exports = {
	createEvents: createEvents,
	contextEvents: contextEvents
};
