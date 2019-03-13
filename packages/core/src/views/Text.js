import paper from "paper";
import constants from "../constants";

const Text = function ({value="", fontSize=32, fontFamily="gonvillealpha", fillColor="black"}) {
    this.value = value;
    this.fontSize = fontSize;
    this.fontFamily = fontFamily;
    this.fillColor = fillColor;
}

Text.prototype.type = constants.type.text;

Text.prototype.render = function () {
    return new paper.Group({
        name: constants.type.text,
        children: [new paper.PointText({
            content: this.value,
            fontFamily: this.fontFamily,
            fontSize: this.fontSize,
            fillColor: this.fillColor,
        })]
    });
}

export default Text;
