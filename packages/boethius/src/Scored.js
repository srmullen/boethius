import Config from "./config";
import * as events from "./events";

import Voice from "./views/Voice";
import Note from "./views/Note";
import Rest from "./views/Rest";
import Chord from "./views/Chord";
import Staff from "./views/Staff";
import Line from "./views/Line";
import Measure from "./views/Measure";
import Clef from "./views/Clef";
import Key from "./views/Key";
import TimeSignature from "./views/TimeSignature";
import Score from "./views/Score";

import * as lineUtils from "./utils/line";
import * as noteUtils from "./utils/note";
import * as accidental from './utils/accidental';
import * as common from "./utils/common";
import * as timeUtils from "./utils/timeUtils";
import * as measureUtils from "./utils/measure";
import constants from "./constants";
import _ from "lodash";

const Scored = function (options={}) {
	Scored.config = new Config(options.config);
};

Scored.prototype.setup = function (canvas) {
	this.project = paper.setup(canvas).project;
};

// Scored.projects = paper.projects;

Scored.utils = {
	note: noteUtils,
	line: lineUtils,
	time: timeUtils,
	measure: measureUtils,
	common,
	accidental
};

Scored.prototype.layout = function (layout) {
	return _.bind(parse, this)({}, layout) || [];
};

Scored.prototype.compose = function (layout, music) {
	// When layout is a Score it needs to be responsible for putting music events into the correct line.
	// Staff is currently handling this so that functionality needs to be ported.
	_.map(music, e => layout[e.type](e)); // FIXME: line.note now requires measures

	return layout;
};

Scored.prototype.render = function (composition, ...args) {
	let view;
	// return view;
	switch (composition.type) {
		case constants.type.note:
			view = Note.render(composition, ...args);
			break;

		case constants.type.chord:
			view = Chord.render(composition, ...args);
			break;

		case constants.type.line:
			view = Line.render(composition, ...args);
			break;

		case constants.type.staff:
			view = Staff.render(composition, ...args);
			break;

		case constants.type.score:
			view = Score.render(composition, ...args);
			break;
	}
	paper.view.update();
	return view;
};

/*
 * @deprecated
 * @param music - hierarchical description of music.
 * @return - array of music events with all info needed to add to a score.
 */
Scored.prototype.createEvents = function (music=[]) {
	return events.createEvents({}, [], music);
};

Scored.prototype.serialize = function (item) {
	return common.serialize(item);
};

Scored.prototype.note = function note (context={}) {
	return new Note(context);
};

Scored.prototype.rest = function rest (context={}) {
	return new Rest(context);
};

Scored.prototype.clef = function clef (context={}) {
	return new Clef(context);
};

Scored.prototype.key = function key (context={}) {
	return new Key(context);
};

Scored.prototype.timeSig = function timeSignature (context={}) {
	return new TimeSignature(context);
};

Scored.prototype.chord = function chord (context={}, children=[]) {
	return new Chord(context, children);
};

Scored.prototype.voice = function voice (context={}, children=[]) {
	return new Voice(context, children);
};

Scored.prototype.measure = function measure (context={}, children) {
	return new Measure(context, children);
};

Scored.prototype.line = function line (context={}, children) {
	return new Line(context, children);
};

Scored.prototype.staff = function staff (context={}, children) {
	return new Staff(context, children);
};

Scored.prototype.score = function score (context={}, children) {
	return new Score(context, children);
};

function parse (parentContext={}, [type, context={}, elements=[]]) {
	const data = arguments[1],
		handler = _.isString(type) ? this[type] : null;

	if (handler) {
		const mergedContext = _.extend({}, parentContext, context);
		const mappableParse = _.bind(parse, this, mergedContext);
		return handler(mergedContext, mappableParse(elements));
	} else if (_.isArray(type)) {
		return _.map(data, _.partial(parse, parentContext), this);
	}
}

export default Scored;

if (typeof window === "object") {
	window.Scored = Scored;
}
