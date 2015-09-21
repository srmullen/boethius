import note "../utils/note";
import constants from "../constants";

const TYPE = constants.type.chord;

function Chord (context={}, children=[]) {
	this.group = new paper.Group({name: TYPE});
}

Chord.prototype.type = TYPE;

Chord.prototype.render = function () {

}

export default Chord;
