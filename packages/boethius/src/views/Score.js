import _ from "lodash";

import Staff from "./Staff";
import constants from "../constants";
import {createMeasures} from "../utils/measure";
import {map, reductions, partitionWhen, clone} from "../utils/common";
import {getTimeContexts} from "../utils/line";
import {getStaffItems, iterateByTime} from "../utils/staff";
import {getAccidentalContexts} from "../utils/accidental";
import {getTime} from "../utils/timeUtils";

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
    const startTimes = _.dropRight(startMeasures).map((measure) => getTime(measures, {measure}));
    const startContexts = startTimes.map((time) => {
        return score.lines.map(line => line.contextAt(time));
    });

    // split staffTimes and measures
    let staffIdx = 0;
    const staffTimeContexts = partitionWhen(timeContexts, (timeContext) => {
        const measure = _.find(timeContext, ctx => !!ctx).time.measure;
        const ret = measure >= startMeasures[staffIdx + 1];
        if (ret) staffIdx++;
        return ret;
    });

    // add empty contexts for any remaining staffIdxs'
    _.each(_.drop(startMeasures, staffIdx + 2), () => staffTimeContexts.push([]));

    // Create the context marking for the beginning of each staff.
    map((staffContext, startContext, startTime) => {
        const firstTime = _.first(staffContext);
        if (firstTime) {
            // create markings.
            // merge the markings if the start time is the same as the first time.
            // create a new timeContext if the startTime is earlier than firstTime.
            console.log("firstTime", firstTime);
        } else {
            // create a timeContext with the cloned startContext markings
            const items = [clone(startContext[0].clef), clone(startContext[0].key), clone(startContext[0].timeSig)];
            staffContext.push([{context: startContext[0], items, time: startTime}]);
            console.log("staffContext", staffContext);
        }
        // console.log(staffContext, startContext, startTime);
    }, staffTimeContexts, startContexts, startTimes);

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
