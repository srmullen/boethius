const Config = require("./config"),
	  Context = require("./base/Context"),
	  events = require("./events"),
	  processor = require("./Processor"),
	  midi = require("./midi"),
	  MoveTool = require("./tools/MoveTool"),

	  Staff = require("./views/Staff"),
	  Line = require("./views/Line"),
	  Measure = require("./views/Measure"),
	  Note = require("./views/Note"),
	  Rest = require("./views/Rest"),
	  Clef = require("./views/Clef"),
	  Key = require("./views/Key"),
	  TimeSignature = require("./views/TimeSignature"),

	  lineUtils = require("./utils/line"),
	  noteUtils = require("./utils/note"),
	  common = require("./utils/common"),
	  constants = require("./constants"),
	  _ = require("lodash");

const Scored = function (options={}) {
	Scored.config = new Config(options.config);
};

Scored.prototype.setup = function (canvas) {
	this.project = paper.setup(canvas).project;
}

// Scored.projects = paper.projects;

Scored.utils = {note: noteUtils, line: lineUtils};

Scored.prototype.layout = function (layout) {
	return _.bind(parse, this)({}, layout) || [];
};

Scored.prototype.compose = function (layout, music) {
	// return processor.run(layout, music);
	// if (layout.type === constants.type.line) {
	// 	_.map(music, e => Line[e.type](layout, e));
	// } else if (layout.type === constants.type.staff) {
	// 	_.map(music, e => Staff[e.type](layout, e));
	// }
	_.map(music, e => layout[e.type](e));

	return layout;
};

Scored.prototype.render = function (composition) {
	this.destroy();
	this.view = composition.render();
	paper.view.update();
	return this.view;
};

Scored.prototype.destroy = function () {
	this.project.activate();
	if (this.view) this.view.remove();
	paper.view.update();
};

/*
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
}

Scored.prototype.rest = function rest (context={}) {
	return new Rest(context);
}

Scored.prototype.clef = function clef (context={}) {
	return new Clef(context);
}

Scored.prototype.key = function key (context={}) {
	return new Key(context);
}

Scored.prototype.timeSig = function timeSignature (context={}) {
	return new TimeSignature(context);
}

Scored.prototype.measure = function measure (context={}, children) {
	return new Measure(context, children);
}

Scored.prototype.line = function line (context={}, children) {
	return new Line(context, children);
}

Scored.prototype.staff = function staff (context={}, children) {
	return new Staff(context, children);
}

function parse (parentContext={}, [type, context={}, elements=[]]) {
	const data = arguments[1],
		handler = _.isString(type) ? this[type] : null;

	if (handler) {
		var mergedContext = _.extend({}, parentContext, context),
			mappableParse = _.bind(parse, this, mergedContext);
		return handler(mergedContext, mappableParse(elements));
	} else if (_.isArray(type)) {
		return _.map(data, _.partial(parse, parentContext), this);
	}
};

Scored.parseMidi = midi.parseMidi;

module.exports = Scored;

if (typeof window === "object") {
	window.Scored = Scored;
}
