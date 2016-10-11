import _ from "lodash";

import System from "./System";
import Slur from "./Slur";
import constants from "../constants";
import {createMeasures} from "../utils/measure";
import {map, reductions, partitionWhen, clone, concat} from "../utils/common";
import {getTimeContexts} from "../utils/line";
import {getStaffItems, iterateByTime} from "../utils/system";
import {getAccidentalContexts} from "../utils/accidental";
import {getTime} from "../utils/timeUtils";
import {isClef, isKey, isTimeSignature} from "../types";

const TYPE = constants.type.score;

/*
 * Class for managing Systems and Lines.
 * Meta data such as title/composer could also be attached here.
 * @param pageWidth - pixels given 72 dpi
 * @param pageHeight - pixels given 72 dpi
 */
function Score ({pageWidth=595, pageHeight=842, length, systemHeights}, children=[]) {
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
    this.systemHeights = systemHeights;
    this.pageWidth = pageWidth;
    this.pageHeight = pageHeight;
}

Score.prototype.type = TYPE;

Score.render = function (score, {measures, voices=[], pages=[1]}) {
    // Create the Score Group. No actual rendering is done here.
    const scoreGroup = score.render();

    // Optimize here. Measures shouldn't need to be recreated every time the score is re-rendered.
    measures = measures || scoreToMeasures(score);

    const systemsToRender = _.reduce(score.systems, (acc, system, index) => {
        return _.contains(pages, system.page) ? concat(acc, {system, index}) : acc;
    }, []);

    // get the start measure for each System.
    const startMeasures = reductions((acc, system) => acc + system.measures, score.systems, 0);
    const startTimes = startMeasures.map((measure) => getTime(measures, {measure}));

    // [startTime inclusive, endTime exclusive]
    const timeFrame = [startTimes[_.first(systemsToRender).index], startTimes[_.last(systemsToRender).index + 1]];

    // get voice time frames for rendering decorations.
    const voiceTimeFrames = voices.map(voice => voice.getTimeFrame(timeFrame[0].time, timeFrame[1].time));
    // slurs are grouped by voice.
    const slurs = voiceTimeFrames.map(voice => Slur.groupSlurs(voice, startTimes).map(slurred => {
        // FIXME: need to add timeBreak property.
        const slurStartTime = _.first(slurred).time;
        const slurEndTime = _.last(slurred).time;
        const systemBreak = _.contains(startTimes.map(time => time.time), slurEndTime);
        return Slur.of({systemBreak}, slurred);
    }));

    const systemTimeContexts = getSystemTimeContexts(score.lines, voices, measures, startMeasures, timeFrame);

    // Create the context marking for the beginning of each system.
    map(({index}) => {
        const firstTime = _.first(systemTimeContexts[index]);
        const startTime = startTimes[index]
        const startContext = getStartContext(score, startTime);
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
    }, systemsToRender);

    const systemGroups = _.map(systemsToRender, ({system, index}, i) => {
        const endMeasure = startMeasures[index] + system.measures;
        const systemMeasures = _.slice(measures, startMeasures[index], endMeasure);
        const timeContext = systemTimeContexts[index];

        const systemGroup = System.renderTimeContexts(system, score.lines, systemMeasures, voices, timeContext, score.length);

        // Add height of previously rendered pages
        const systemTranslation = (!_.contains(pages, system.page - 1)) ?
            score.systemHeights[index] :
            score.systemHeights[index] + _.indexOf(pages, system.page) * score.pageHeight;

        systemGroup.translate(0, systemTranslation);

        return systemGroup;
    });

    const slurGroups = _.flatten(slurs).map(slur => slur.render());
    scoreGroup.addChildren(slurGroups);

    scoreGroup.addChildren(systemGroups);

    // renderDecorations(scoreGroup, voices);

    return scoreGroup;
};

Score.prototype.render = function () {
    const group = new paper.Group({
        name: TYPE
    });

    return group;
};

function getStartContext (score, time) {
    return score.lines.map(line => line.contextAt(time));
}

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

// Staff[Time[Line[Context]]]
export function getSystemTimeContexts (lines, voices, measures, startMeasures) {
    // get the time contexts
	const lineItems = getStaffItems(lines, voices);
	const lineTimes = map((line, items) => getTimeContexts(line, measures, items), lines, lineItems);

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
