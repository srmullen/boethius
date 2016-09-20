import constants from "../constants";
import {drawDynamic} from "../engraver";
import {dynamicEquals} from "../utils/equality";

const TYPE = constants.type.dynamic;

function Dynamic ({value, time}) {
    this.value = value;
    this.time = time;
}

Dynamic.prototype.type = TYPE;

Dynamic.prototype.render = function () {
    const group = this.group = drawDynamic(this.value);
    group.name = TYPE;
    return group;
};

Dynamic.prototype.equals = function (dynamic) {
    return dynamicEquals(this, dynamic);
};

export default Dynamic;
