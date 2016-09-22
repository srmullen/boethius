import _ from "lodash";

import System from "./System";
import constants from "../constants";
import {createMeasures} from "../utils/measure";
import {map, reductions, partitionWhen, clone} from "../utils/common";
import {getTimeContexts} from "../utils/line";
import {getStaffItems, iterateByTime} from "../utils/system";
import {getAccidentalContexts} from "../utils/accidental";
import {getTime} from "../utils/timeUtils";
import {isClef, isKey, isTimeSignature} from "../types";

const TYPE = constants.type.score;

/*
 * Class for managing Systems and Lines.
 * Meta data such as title/composer could also be attached here.
 */
// function Score ({measures=1, length, systemHeights=[]}, children=[]) {
function Score (props={}, children=[]) {
    /*
     * A score should have both systems and lines.
     * A line represents all measures from 0 to the end of the score. It is one-dimentional.
     * A stave represents a section of the measures from all the lines. It is two-dimentional.
     */
    const types = _.groupBy(children, child => child.type);

    this.timeSigs = types.timeSig || [];
    this.lines = types.line || [];
    this.systems = types.system || [];
    this.length = props.length;
    this.systemHeights = props.systemHeights;
}

Score.prototype.type = TYPE;

Score.render = function (score, {measures, voices=[], pages=[1]}) {
    // Create the Score Group. No actual rendering is done here.
    const scoreGroup = score.render();

    // Optimize here. Measures shouldn't need to be recreated every time the score is re-rendered.
    measures = measures || scoreToMeasures(score);

    // get the start measure for each System.
    const startMeasures = reductions((acc, system) => acc + system.measures, score.systems, 0);
    const startTimes = _.dropRight(startMeasures).map((measure) => getTime(measures, {measure}));
    const startContexts = startTimes.map((time) => {
        return score.lines.map(line => line.contextAt(time));
    });

    const systemTimeContexts = getSystemTimeContexts(score, voices, measures, startMeasures);

    // Create the context marking for the beginning of each system.
    map((systemContext, startContext, startTime) => {
        const firstTime = _.first(systemContext);
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
            const systemTimeContext = _.map(startContext, _.partial(createLineTimeContext, startTime));
            systemContext.push(systemTimeContext);
        }
    }, systemTimeContexts, startContexts, startTimes);

    let systemHeight = score.systemHeights[0] || 0;
    const defaultHeight = 250;
    const systemGroups = _.map(score.systems.filter(system => _.contains(pages, system.page)), (system, i) => {
        const endMeasure = startMeasures[i] + system.measures;
        const systemMeasures = _.slice(measures, startMeasures[i], endMeasure);

        const systemGroup = System.renderTimeContexts(system, score.lines, systemMeasures, voices, systemTimeContexts[i], score.length);

        systemGroup.translate(0, score.systemHeights[i]);

        return systemGroup;
    });

    scoreGroup.addChildren(systemGroups);

    renderDecorations(scoreGroup, voices);

    return scoreGroup;
};

Score.prototype.render = function () {
    const group = new paper.Group({
        name: TYPE
    });

    return group;
};

export function scoreToMeasures (score) {
    const numMeasures = _.sum(score.systems, system => system.measures);
    // Optimize here. Measures shouldn't need to be recreated every time the score is re-rendered.
    return createMeasures(numMeasures, score.timeSigs);
}

/*
 * mutates scoreGroup
 */
export function renderDecorations (scoreGroup, voices) {
	const decorationGroups = renderSlurs(voices);
	decorationGroups.map(group => scoreGroup.addChildren(group));
}

function renderSlurs (voices) {
	return _.map(voices, voice => {
		// slurs only need to know voice
		return voice.renderSlurs();
	});
}

/*
 * @param time - Time object.
 * @param context - Return value of line.contextAt.
 * @return TimeContext object {context, time, items}
 */
export function createLineTimeContext (time, context) {
    const items = [clone(context.clef), clone(context.key), clone(context.timeSig)];
    return {context, items, time};
}

export function getSystemTimeContexts (score, voices, measures, startMeasures) {
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

    // split staffTimes and measures
    let systemIdx = 0;
    const systemTimeContexts = partitionWhen(timeContexts, (timeContext) => {
        const measure = _.find(timeContext, ctx => !!ctx).time.measure;
        const ret = measure >= startMeasures[systemIdx + 1];
        if (ret) systemIdx++;
        return ret;
    });

    // add empty contexts for any remaining systemIdxs'
    _.each(_.drop(startMeasures, systemIdx + 2), () => systemTimeContexts.push([]));

    return systemTimeContexts;
}

function getLineByVoice (voice, lines) {
    return _.find(lines, (line) => {
        return _.indexOf(line.voices, voice) !== -1;
    });
}

Score.getLineByVoice = getLineByVoice;

export default Score;
