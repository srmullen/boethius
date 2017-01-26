import constants from "../constants";

const Text = function ({value="", fontSize=Scored.config.fontSize, fontFamily="gonvillealpha", fillColor="black"}) {
    this.value = value;
    this.fontSize;
    this.fontFamily;
    this.fillColor;
}

Text.prototype.type = constants.type.text;

Text.prototype.render = function () {
    return new paper.PointText({
        content: this.value,
        fontFamily: this.fontFamily,
        fontSize: this.fontSize,
        fillColor: this.fillColor,
    });
}

export default Text;
