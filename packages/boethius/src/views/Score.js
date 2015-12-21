import _ from "lodash";

import Line from "./Line";
import Staff from "./Staff";
import constants from "../constants";
import {createMeasures} from "../utils/measure";

const TYPE = constants.type.score;

/*
 * Class for managing Staves and Lines.
 * Meta data such as title/composer could also be attached here.
 */
function Score ({measures=1}, children=[]) {
    /*
     * A score should have both staves and lines.
     * A line represents all measures from 0 to the end of the score. It is one-dimentional.
     * A stave represents a section of the measures from all the lines. It is two-dimentional.
     */
    const types = _.groupBy(children, child => child.type);

    this.measures = createMeasures(measures, types.timeSig);
    this.lines = types.line || [];
    this.staves = types.staff || [];
    _.each(this.lines, line => line.children = this.measures);
}

Score.prototype.type = TYPE;

Score.prototype.note = function (note) {
    let line = getLineByVoice(note.voice, this.lines);
    line.note(note, this.measures);
}

Score.prototype.rest = function (rest) {
    let line = getLineByVoice(rest.voice, this.lines);
    line.rest(rest, this.measures);
}

Score.prototype.voice = function (voice) {
    let line = getLineByVoice(voice.value, this.lines);
    voice.children.map((note) => line.note(note, this.measures));
}

Score.render = function (score) {
    return score.render();
}

Score.prototype.render = function () {
    const group = this.group = new paper.Group({
        name: TYPE
    });

    let staves = _.map(this.staves, (staff) => {
        let group = staff.render(this.lines, staff.startMeasure, staff.measures);
        staff.renderMeasures(this.lines, group.children, staff.startMeasure, staff.measures);
        return group;
    });

    staves.map((staff, i) => staff.translate(0, i * 300));

    group.addChildren(staves);

    return group;
}

function getLineByVoice (voice, lines) {
    return _.find(lines, (line) => {
        return _.indexOf(line.voices, voice) !== -1;
    });
}

Score.getLineByVoice = getLineByVoice;

export default Score;
