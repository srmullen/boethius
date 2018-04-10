import paper from "paper/dist/paper-core";

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
			view = Score.render(layout, music);
			break;
	}
	paper.view.update();
	return view;
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
