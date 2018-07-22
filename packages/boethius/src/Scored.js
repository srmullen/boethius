import paper from "paper";
import {isString} from 'lodash';

import Config from "./config";

import Voice from "./views/Voice";
import Note from "./views/Note";
import Rest from "./views/Rest";
import Chord from "./views/Chord";
import System from "./views/System";
import Line from "./views/Line";
import Measure from "./views/Measure";
import Clef from "./views/Clef";
import Key from "./views/Key";
import Text from "./views/Text";
import TimeSignature from "./views/TimeSignature";
import Dynamic from "./views/Dynamic";
import ChordSymbol from "./views/ChordSymbol";
import Score from "./views/Score";
import Page from "./views/Page";
import Repeat from "./views/Repeat";

import {parse, parseLayout, parseMusic} from "./utils/parser";
import * as lineUtils from "./utils/line";
import * as noteUtils from "./utils/note";
import * as accidental from './utils/accidental';
import * as common from "./utils/common";
import * as timeUtils from "./utils/timeUtils";
import loadFonts from "./utils/fonts";
import constants from "./constants";
import vScore from "./virtual-score";

const Scored = function (options={}) {
	Scored.config = new Config(options.config);
};

Scored.loadFonts = loadFonts;

Scored.prototype.setup = function (canvas) {
	this.project = paper.setup(canvas).project;
};

Scored.prototype.render = function (layout, music, options={}) {
	this.project.activate();
	let view;
	// create a white background for images. Possible memleak issue.
	// const background = new paper.Path.Rectangle(paper.view.bounds);
	// background.fillColor = "white";

	if (options.parse) {
		layout = parseLayout(layout);
		music = parseMusic(music);
	}

	if (!layout.type) throw new Error("Layout must have a type");

	switch (layout.type) {
		case constants.type.note:
			view = Note.render(layout, music);
			break;

		case constants.type.rest:
			view = Rest.render(layout, music);
			break;

		case constants.type.chord:
			view = Chord.render(layout, music);
			break;

		case constants.type.system:
			view = System.render(layout, music);
			break;

		case constants.type.score:
			// view = vScore(composition, args);
			view = Score.render(layout, music, options);
			break;
	}
	paper.view.update();
	return view;
};

// The colorPlugin is being used to help develop how plugins will be executed.
// Its goal is to allow object to be rendered in any color.
const plugins = {
	parserPlugin: {
		name: 'parserPlugin',
		beforeRender: function (acc) {
			if (acc.options.parse) {
				return {
					layout: parseLayout(acc.layout),
					music: parseMusic(acc.music)
				};
			}
		}
	},
	colorPlugin: {
		name: 'colorPlugin',
		collect: function (acc, item) {
			if (item.color) {
				console.log(`Item of color ${item.color}!`);
				return acc.concat([item]);
			}
			return acc;
		},

		apply: function (item) {
			console.log(`Rendering Item: ${item}`);
		}
	},
	tiePlugin: {
		name: 'tiePlugin',
		beforeRender: function ({voiceTimeFrames, startTimes}) {
			return Score.createGroups({voiceTimeFrames, startTimes});
		}
	},
	loggingPlugin: {
		name: 'loggingPlugin',
		beforeRender: function (acc) {
			console.log(acc);
		}
	}
};

// Name of method will change to just render.
Scored.prototype.pluginRender = function (layout, music, options={}) {
	this.project.activate();

	const config = ['loggingPlugin', 'parserPlugin', 'loggingPlugin'];

	const aggregate = beforeRender(config, {
		layout,
		music,
		options
	})
	.then(render)
	.then(renderTimes)
	.then(afterRenderTimes)
	.then(afterRender)
	.catch((error) => {
		console.log(error);
	});

	paper.view.update();
	return aggregate;
}

function beforeRender (config, aggregate) {
	return config.reduce((promise, plugin) => {
		if (isString(plugin)) {
			plugin = plugins[plugin] || {};
		}

		if (plugin.beforeRender) {
			return promise.then((agg) => {
				const val = plugin.beforeRender(agg);
				if (val instanceof Promise) {
					return val;
				} else {
					return new Promise((resolve, reject) => {
						resolve(Object.assign({}, agg, val));
					});
				}
			});
		} else {
			return promise;
		}
	}, Promise.resolve(aggregate));
}

function render (acc) {
	return new Promise((resolve, reject) => {
		const {
            score,
            systemsToRender,
            measures,
            startMeasures,
            systemTimeContexts,
            voices,
			groupings
        } = Score.render(acc.layout, acc);

		resolve(Object.assign({}, acc, {
			score,
			systemsToRender,
            measures,
            startMeasures,
            systemTimeContexts,
            voices,
			groupings
		}));
	});
}

function renderTimes (acc) {
	return new Promise((resolve, reject) => {
		Score.renderTimeContexts({
            score: acc.score,
            systemsToRender: acc.systemsToRender,
            measures: acc.measures,
            startMeasures: acc.startMeasures,
            systemTimeContexts: acc.systemTimeContexts,
            voices: acc.voices
        });
		resolve(acc);
	});
}

function afterRenderTimes (acc) {
	return new Promise((resolve, reject) => {
		acc.score.group.addChildren(Score.renderDecorations({
			groupings: acc.groupings,
		}));
		resolve(acc);
	});
}

function afterRender (acc) {
	return new Promise((resolve, rejet) => {
		acc.score.group.translate(25, 50);
		resolve(acc);
	});
}

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

Scored.prototype.text = function text (context={}) {
	return new Text(context);
};

Scored.prototype.timeSig = function timeSignature (context={}) {
	return new TimeSignature(context);
};

Scored.prototype.dynamic = function dynamic (context={}) {
	return new Dynamic(context);
};

Scored.prototype.chordSymbol = function chordSymbol (context={}) {
	return new ChordSymbol(context);
};

Scored.prototype.chord = function chord (context={}, children=[]) {
	return new Chord(context, children);
};

Scored.prototype.voice = function voice (context={}, children=[]) {
	return new Voice(context, children);
};

Scored.prototype.page = function page (context={} , children=[]) {
	return new Page(context, children);
}

Scored.prototype.measure = function measure (context={}, children) {
	return new Measure(context, children);
};

Scored.prototype.line = function line (context={}, children) {
	return new Line(context, children);
};

Scored.prototype.system = function system (context={}, children) {
	return new System(context, children);
};

Scored.prototype.score = function score (context={}, children) {
	return new Score(context, children);
};

Scored.prototype.repeat = function repeat(context={}) {
	return new Repeat(context);
};

Scored.prototype.clone = common.clone;

Scored.parse = parse;

export default Scored;

if (typeof window === "object") {
	window.Scored = Scored;
}
