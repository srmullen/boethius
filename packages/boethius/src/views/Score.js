import _ from "lodash";

import Staff from "./Staff";
import constants from "../constants";
import {createMeasures} from "../utils/measure";
import {map, reductions, partitionWhen} from "../utils/common";
import {getTimeContexts} from "../utils/line";
import {getStaffItems, iterateByTime} from "../utils/staff";
import {getAccidentalContexts} from "../utils/accidental";

const TYPE = constants.type.score;

/*
 * Class for managing Staves and Lines.
 * Meta data such as title/composer could also be attached here.
 */
function Score ({measures=1, length, staffHeights=[]}, children=[]) {
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
    this.staffHeights = staffHeights;
}

Score.prototype.type = TYPE;

Score.render = function (score, {measures, voices=[]}) {
    const scoreGroup = score.render();

    const numMeasures = _.sum(score.staves, staff => staff.measures);

    measures = measures || createMeasures(numMeasures, score.timeSigs);

    // get the time contexts
	const lineItems = getStaffItems(score.lines, voices);
	const lineTimes = map((line, items) => getTimeContexts(line, measures, items), score.lines, lineItems);

    // calculate the accidentals for each line.
	_.each(lineTimes, (times) => {
		const accidentals = getAccidentalContexts(times);
		// add accidentals to times
		_.each(times, (time, i) => time.context.accidentals = accidentals[i]);
	});

    const timeContexts = iterateByTime(x => x, lineTimes);

    // get the start measure for each Staff.
    const startMeasures = reductions((acc, stave) => acc + stave.measures, score.staves, 0);

    // split staffTimes and measures
    let staffIdx = 0;
    const staffTimeContexts = partitionWhen(timeContexts, (timeContext) => {
        const measure = _.find(timeContext, ctx => !!ctx).time.measure;
        const ret = measure >= startMeasures[staffIdx + 1];
        if (ret) staffIdx++;
        return ret;
    });

    let startMeasure = 0;
    let staffHeight = score.staffHeights[0] || 0;
    const defaultHeight = 250;
    const staffGroups = _.map(score.staves, (staff, i) => {
        const endMeasure = startMeasure + staff.measures;
        const staffMeasures = _.slice(measures, startMeasure, endMeasure);

        const staffGroup = Staff.renderTimeContexts(staff, score.lines, staffMeasures, voices, staffTimeContexts[i], score.length);
        staffGroup.translate(0, staffHeight);

        staffHeight = (score.staffHeights[i+1] || defaultHeight) + staffHeight;

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
