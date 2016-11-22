import constants from "../constants";
import {drawRepeat} from "../engraver";

const TYPE = constants.type.repeat;

function Repeat ({value, measure}) {
    this.value = value;
    this.measure = measure;
}

Repeat.prototype.type = TYPE;

Repeat.prototype.render = function () {
    const group = this.group = drawRepeat();

    return group;
};

export default Repeat;
