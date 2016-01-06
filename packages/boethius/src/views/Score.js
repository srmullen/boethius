import _ from "lodash";

import Staff from "./Staff";
import constants from "../constants";
import {createMeasures} from "../utils/measure";
import {map, reductions} from "../utils/common";
import {getTimeContexts} from "../utils/line";
import {getLineItems} from "../utils/staff";

const TYPE = constants.type.score;

/*
 * Class for managing Staves and Lines.
 * Meta data such as title/composer could also be attached here.
 */
function Score ({measures=1, length}, children=[]) {
    /*
     * A score should have both staves and lines.
     * A line represents all measures from 0 to the end of the score. It is one-dimentional.
     * A stave represents a section of the measures from all the lines. It is two-dimentional.
     */
    const types = _.groupBy(children, child => child.type);

    this.timeSigs = types.timeSig || [];
    this.lines = types.line || [];
    this.staves = types.staff || [];
    this.length = length;
}

Score.prototype.type = TYPE;

Score.render = function (score, {measures, voices=[]}) {
    const scoreGroup = score.render();

    const numMeasures = _.sum(score.staves, staff => staff.measures);

    measures = measures || createMeasures(numMeasures, score.timeSigs);

    // get the time contexts
	const lineItems = getLineItems(score.lines, voices);
	const lineTimes = map((line, items) => getTimeContexts(line, measures, items), score.lines, lineItems);
    console.log(lineTimes);
    // get the start measure for each Staff.
    const startMeasures = reductions((acc, stave) => acc + stave.measures, score.staves, 0);
    console.log(startMeasures);

    let startMeasure = 0;
    const staffGroups = _.map(score.staves, (staff, i) => {
        const staffGroup = Staff.render(staff, {
            length: score.length,
            measures,
            voices,
            lines: score.lines,
            startMeasure,
            numMeasures: staff.measures
        });
        staffGroup.translate(0, i * 250);

        startMeasure += staff.measures;

        return staffGroup;
    });

    scoreGroup.addChildren(staffGroups);

    return scoreGroup;
};

Score.prototype.render = function () {
    const group = new paper.Group({
        name: TYPE
    });

    return group;
};

function getLineByVoice (voice, lines) {
    return _.find(lines, (line) => {
        return _.indexOf(line.voices, voice) !== -1;
    });
}

Score.getLineByVoice = getLineByVoice;

export default Score;
