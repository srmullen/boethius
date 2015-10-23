import _ from "lodash";

import Line from "./Line";
import Staff from "./Staff";
import constants from "../constants";

const TYPE = constants.type.score;

/*
 * Class for managing Staves and Lines.
 * Meta data such as title/composer could also be attached here.
 */
function Score (context={}, children=[]) {
    /*
     * A score should have both staves and lines.
     * A line represents all measures from 0 to the end of the score. It is one-dimentional.
     * A stave represents a section of the measures from all the lines. It is two-dimentional.
     */
    const types = _.groupBy(children, child => child.type);

    this.lines = types.line || [];
    this.staves = types.staff || [];
}

Score.prototype.type = TYPE;

Score.prototype.note = function (note) {
    let line = getLineByVoice(note.voice, this.lines);
    line.note(note);
}

Score.prototype.rest = function (rest) {
    let line = getLineByVoice(rest.voice, this.lines);
    line.rest(rest);
}

Score.prototype.render = function () {
    const group = new paper.Group({
        name: TYPE
    });

    let staves = _.map(this.staves, (staff) => {
        let group = staff.render(this.lines, staff.startMeasure, staff.measures);
        staff.renderMeasures(this.lines, group.children, staff.startMeasure, staff.measures);
        return group;
    });

    staves.map((staff, i) => staff.translate(0, i * 300));

    group.addChildren(staves);

    console.log(this.staves);
    console.log(this.lines);

    return group;
}

function getLineByVoice (voice, lines) {
    return _.find(lines, (line) => {
        return _.indexOf(line.voices, voice) !== -1;
    });
}

Score.getLineByVoice = getLineByVoice;

export default Score;
