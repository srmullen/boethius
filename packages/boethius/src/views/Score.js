import _ from "lodash";

import Line from "./Line";
import Staff from "./Staff";
import constants from "../constants";
import {map} from "../utils/common";
import {createMeasures} from "../utils/measure";
import {getTimeContexts, b} from "../utils/line";
import {groupVoices, getLineItems, calculateMeasureLengths, nextTimes, iterateByTime, renderTimeContext, positionMarkings} from "../utils/staff";

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

    this.timeSigs = types.timeSig || [];
    this.lines = types.line || [];
    this.staves = types.staff || [];
    // _.each(this.lines, line => line.children = this.measures);
}

Score.prototype.type = TYPE;

Score.render = function (score, {measures, voices=[], numMeasures}) {
    const scoreGroup = score.render();

    measures = measures || createMeasures(numMeasures, score.timeSigs);

    // get the time contexts
	const lineItems = getLineItems(score.lines, voices);

	const lineTimes = map((line, items) => getTimeContexts(line, measures, items), score.lines, lineItems);

    let staffGroups = _.map(score.staves, (staff, i) => {
        const staffGroup = Staff.render(staff, {length: 1000, measures, voices, lines: score.lines, numMeasures});
        staffGroup.translate(0, i * 250);
        return staffGroup;
    });

    scoreGroup.addChildren(staffGroups);

    return scoreGroup;
}

Score.prototype.render = function () {
    const group = new paper.Group({
        name: TYPE
    });

    return group;
}

Score.renderStaff = function (staff, lines) {

}

function getLineByVoice (voice, lines) {
    return _.find(lines, (line) => {
        return _.indexOf(line.voices, voice) !== -1;
    });
}

Score.getLineByVoice = getLineByVoice;

export default Score;
