import constants from "../constants";
import {drawChordSymbol} from "../engraver";

const TYPE = constants.type.chordSymbol;

function ChordSymbol ({value, measure, beat, time}) {
    this.value = value;
    this.measure = measure;
    this.beat = beat;
    this.time = time;
}

ChordSymbol.prototype.type = TYPE;

ChordSymbol.prototype.render = function () {
    const group = this.group = drawChordSymbol(this.value);
    group.name = TYPE;
    return group;
};

export default ChordSymbol;
