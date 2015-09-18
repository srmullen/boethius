let note = require("../utils/note"),
	constants = require("../constants");

const TYPE = constants.type.chord;

function Chord (context={}, children=[]) {
	this.group = new paper.Group({name: TYPE});
}

Chord.prototype.type = TYPE;

Chord.prototype.render = function () {

}
