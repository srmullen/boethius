import constants from "../constants";

const TYPE = constants.type.repeat;

function Repeat ({value, measure}) {
    this.value = value;
    this.measure = measure;
}

Repeat.prototype.type = TYPE;

Repeat.prototype.render = function () {
    const group = this.group = new paper.Group();

    return group;
};

export default Repeat;
