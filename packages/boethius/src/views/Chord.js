import _ from "lodash";

import note from "../utils/note";
import constants from "../constants";
import Note from "./Note";

const TYPE = constants.type.chord;

/*
 * @param children - Array of notes. Can take several representations. String, Object, or Note.
 */
function Chord ({value=4, root, name, inversion, stacato, legato}, children=[]) {
	this.value = value;
	this.root = root;
	this.name = name;
	this.inversion = inversion;
	this.stacato = stacato;
	this.legato = legato;
	this.children = parseChildren(children, {value});
}

Chord.prototype.type = TYPE;

Chord.prototype.render = function () {
	const group = this.group = new paper.Group({name: TYPE});
}

/*
 * @param children - Array<Note representations>
 * @return Note[]
 */
function parseChildren (children, defaults={}) {
	return _.map(children, note => {
		if (note.type === constants.type.note) {
			return note;
		}

		if (_.isString(note)) {
			return new Note(_.assign({}, defaults, {pitch: note}));
		}

		if (_.isObject(note)) {
			return new Note(_.assign({}, defaults, note));
		}
	});
}

export default Chord;
