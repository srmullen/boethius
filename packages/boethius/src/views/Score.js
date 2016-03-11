import _ from "lodash";

import System from "./System";
import constants from "../constants";
import {createMeasures} from "../utils/measure";
import {map, reductions, partitionWhen, clone} from "../utils/common";
import {getTimeContexts} from "../utils/line";
import {getStaffItems, iterateByTime} from "../utils/staff";
import {getAccidentalContexts} from "../utils/accidental";
import {getTime} from "../utils/timeUtils";
import {isClef, isKey, isTimeSignature} from "../types";

const TYPE = constants.type.score;

/*
 * Class for managing Staves and Lines.
 * Meta data such as title/composer could also be attached here.
 */
function Score ({measures=1, length, staffHeights=[]}, children=[]) {
    /*
     * A score should have both systems and lines.
     * A line represents all measures from 0 to the end of the score. It is one-dimentional.
     * A stave represents a section of the measures from all the lines. It is two-dimentional.
     */
    const types = _.groupBy(children, child => child.type);

    this.timeSigs = types.timeSig || [];
    this.lines = types.line || [];
    this.systems = types.system || [];
    this.length = length;
    this.staffHeights = staffHeights;
}

Score.prototype.type = TYPE;

Score.render = function (score, {measures, voices=[]}) {
    const scoreGroup = score.render();

    const numMeasures = _.sum(score.systems, system => system.measures);

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

    // get the start measure for each System.
    const startMeasures = reductions((acc, stave) => acc + stave.measures, score.systems, 0);
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
            const time = _.find(firstTime, ctx => !!ctx).time;
            if (startTime.time < time.time) {
                throw new Error("Gap in time");
            } else {
                _.each(firstTime, (timeContext, i) => {
                    if (timeContext) { // there are items at the time.
                        // add markings to the items list if they don't exist.
                        const {context, items} = timeContext;
                        if (!_.find(timeContext.items, isClef)) items.push(clone(context.clef));
                        if (!_.find(timeContext.items, isKey)) items.push(clone(context.key));
                        if (!_.find(timeContext.items, isTimeSignature)) items.push(clone(context.timeSig));
                    } else { // create a context and marking items for the line
                        firstTime[i] = createLineTimeContext(startTime, startContext[i]);
                    }
                });
            }
        } else {
            // create a timeContext with the cloned startContext markings
            const staffTimeContext = _.map(startContext, _.partial(createLineTimeContext, startTime));
            staffContext.push(staffTimeContext);
        }
        // console.log(staffContext, startContext, startTime);
    }, staffTimeContexts, startContexts, startTimes);

    let startMeasure = 0;
    let staffHeight = score.staffHeights[0] || 0;
    const defaultHeight = 250;
    const staffGroups = _.map(score.systems, (system, i) => {
        const endMeasure = startMeasure + system.measures;
        const systemMeasures = _.slice(measures, startMeasure, endMeasure);

        const staffGroup = System.renderTimeContexts(system, score.lines, systemMeasures, voices, staffTimeContexts[i], score.length);
        staffGroup.translate(0, staffHeight);

        staffHeight = (score.staffHeights[i+1] || defaultHeight) + staffHeight;

        startMeasure += system.measures;

        return staffGroup;
    });

    scoreGroup.addChildren(staffGroups);

    return scoreGroup;
};

/*
 * @param time - Time object.
 * @param context - Return value of line.contextAt.
 * @return TimeContext object {context, time, items}
 */
function createLineTimeContext (time, context) {
    const items = [clone(context.clef), clone(context.key), clone(context.timeSig)];
    return {context, items, time};
}

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
