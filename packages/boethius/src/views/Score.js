import paper from "paper";
import _ from "lodash";

import System from "./System";
import TimeContext from "./TimeContext";
import Beaming from './Beaming';
import Tuplet from './Tuplet';
import Legato from "./Legato";
import Slur from './Slur';
import Text from "./Text";
import {createMeasures} from "./Measure";
import constants from "../constants";
import {map, reductions, clone, concat} from "../utils/common";
import {getTimeContexts} from "../utils/line";
import {getStaffItems, iterateByTime} from "../utils/system";
import {getAccidentalContexts} from "../utils/accidental";
import {getTime, equals} from "../utils/timeUtils";
import {isClef, isKey, isText, isTimeSignature} from "../types";

const TYPE = constants.type.score;

/*
 * Class for managing Systems and Lines.
 * Meta data such as title/composer could also be attached here.
 * @param pageWidth - pixels given 72 dpi
 * @param pageHeight - pixels given 72 dpi
 */
function Score ({pageWidth=595, pageHeight=842, length, title}, children=[]) {
    /*
     * A score should have both systems and lines.
     * A line represents all measures from 0 to the end of the score. It is one-dimentional.
     * A stave represents a section of the measures from all the lines. It is two-dimentional.
     */
    const types = _.groupBy(children, child => child.type);

    this.timeSigs = types.timeSig || [];
    this.lines = types.line || [];
    this.systems = types.system || [];
    this.pages = types.page || [];
    this.length = length;
    this.pageWidth = pageWidth;
    this.pageHeight = pageHeight;
    this.title = parseTitle(title);
}

Score.prototype.type = TYPE;

Score.render = function (score, {measures, voices=[], chordSymbols=[], repeats=[], pages=[0]}) {
    // Create the Score Group.
    const scoreGroup = score.render();

    // Optimize here. Measures shouldn't need to be recreated every time the score is re-rendered.
    measures = measures || scoreToMeasures(score, repeats);

    {
        const times = measures.map(measure => measure.startsAt);
        voices.map(voice => {
            voice.breakDurations(times);
        });
    }

    // Get the systems that need to be rendered. The rest are ignored. This
    // is based on the page.
    const systemsToRender = _.reduce(score.systems, (acc, system, index) => {
        return _.includes(pages, system.page) ? concat(acc, {system, index}) : acc;
    }, []);

    // When no systems are on the page nothing further is done.
    if (systemsToRender.length) {
        // get the start measure for each System.
        const startMeasures = reductions((acc, system) => acc + system.measures, score.systems, 0);
        const startTimes = startMeasures.map((measure) => getTime(measures, {measure}));

        // [startTime inclusive, endTime exclusive]
        const timeFrame = [startTimes[_.first(systemsToRender).index], startTimes[_.last(systemsToRender).index + 1]];

        // voiceTimeFrames is an array of only the items that are being rendered
        // for each voice.
        const voiceTimeFrames = _.compact(voices.map(voice => {
            if (isVoiceUsed(voice, score.lines)) {
                return voice.getTimeFrame(timeFrame[0].time, timeFrame[1].time);
            } else {
                return null;
            }
        }));

        const beamings = voiceTimeFrames.map(voice => {
            return Beaming.groupItems(voice, {measures}).map(beaming => {
                return Beaming.of({}, beaming);
            });
        });

        const tuplets = voiceTimeFrames.map(voice => {
            return Tuplet.groupItems(voice, {measures}).map(tuplet => {
                return Tuplet.of({}, tuplet);
            });
        });

        // Create Slurs
        const slurs = voiceTimeFrames.map(voice => {
            return Slur.groupItems(voice).map(slur => {
                const slurStartTime = _.first(slur).time;
                const slurEndTime = _.last(slur).time;
                // const systemBreak = _.includes(startTimes.map(time => time.time), legatoEndTime);
                let systemBreak;
                for (let i = 0; i < startTimes.length; i++) {
                    const systemStartTime = startTimes[i].time;
                    if (slurStartTime < systemStartTime && slurEndTime >= systemStartTime) {
                        systemBreak = systemStartTime;
                        break;
                    }
                }
                const isEnd = !!systemBreak && slur.length === 1;
                return Slur.of({systemBreak, isEnd}, slur);
            });
        });

        // legatos are grouped by voice.
        const legatos = voiceTimeFrames.map(voice => {
            return Legato.groupItems(voice).map(legato => {
                const legatoStartTime = _.first(legato).time;
                const legatoEndTime = _.last(legato).time;
                // const systemBreak = _.includes(startTimes.map(time => time.time), legatoEndTime);
                let systemBreak;
                for (let i = 0; i < startTimes.length; i++) {
                    const systemStartTime = startTimes[i].time;
                    if (legatoStartTime < systemStartTime && legatoEndTime >= systemStartTime) {
                        systemBreak = systemStartTime;
                        break;
                    }
                }
                const isEnd = !!systemBreak && legato.length === 1;
                return Legato.of({systemBreak, isEnd}, legato);
        })});

        const systemTimeContexts = partitionBySystem(createTimeContexts(score.lines, voices, measures, chordSymbols), startMeasures);

        // Create the context marking for the beginning of each system.
        map(({index}) => {
            const systemContext = systemTimeContexts[index];
            const firstTime = _.first(systemContext);
            const startTime = startTimes[index]
            const startContext = getStartContext(score, startTime);
            if (firstTime) {
                const time = firstTime.time
                if (startTime.time < time.time) {
                    // Add a new TimeContext for the startTime of the system.
                    const systemTimeContext = _.map(startContext, _.partial(createLineTimeContext, startTime));
                    systemTimeContexts[index] = [new TimeContext(systemTimeContext), ...systemContext];
                } else {
                    _.each(firstTime.lines, (timeContext, i) => {
                        if (timeContext) { // there are items at the time.
                            // add markings to the items list if they don't exist.
                            const {context, items} = timeContext;
                            if (!_.find(timeContext.items, isClef)) items.push(clone(context.clef));
                            if (!_.find(timeContext.items, isKey)) items.push(clone(context.key));
                            if (!_.find(timeContext.items, isTimeSignature)) items.push(clone(context.timeSig));
                        } else { // create a context and marking items for the line
                            firstTime.lines[i] = createLineTimeContext(startTime, startContext[i]);
                        }
                    });
                }
            } else {
                // create a timeContext with the cloned startContext markings
                const systemTimeContext = _.map(startContext, _.partial(createLineTimeContext, startTime));
                systemContext.push(new TimeContext(systemTimeContext));
            }
        }, systemsToRender);

        /////////////////////
        // Rendering Phase //
        /////////////////////

        // systemOffset is used to help calculate the vertical placement of systems.
        let systemOffset = 0;

        // Render the page title if required.
        if (score.title && _.includes(pages, 0)) {
            const titleGroup = score.title.render();
            const xTranslate = (score.length || score.pageWidth)/2;
            titleGroup.translate(xTranslate, 0);
            systemOffset = titleGroup.bounds.height;
            scoreGroup.addChild(titleGroup);
        }

        // Render the Systems
        // This also includes rendering the music (ie. notes/rests etc.) onto the
        // system. It should be possible to hook into rendering the system and Rendering
        // the music seperately.
        const systemGroups = _.map(systemsToRender, ({system, index}, i) => {
            const endMeasure = startMeasures[index] + system.measures;
            const systemMeasures = _.slice(measures, startMeasures[index], endMeasure);
            const timeContexts = systemTimeContexts[index];

            const systemGroup = System.renderTimeContexts({
                system, voices, timeContexts, chordSymbols,
                lines: score.lines,
                measures: systemMeasures,
                length: system.length || score.length
            });

            const systemTranslation = (!_.includes(pages, system.page)) ?
                score.pages[system.page].staffSpacing[i] || i * 250 :
                score.pages[system.page].staffSpacing[i] || i * 250 + _.indexOf(pages, system.page) * score.pageHeight;

            systemGroup.translate(system.indentation, systemTranslation + systemOffset);

            return systemGroup;
        });

        // render beamings
        // const beamGroups = _.flatten(beamings).map(beaming => beaming.render());

        // render tuplets
        // const tupletGroups = _.flatten(tuplets).map(tuplet => {
        //     // needs line center
        //     tuplet.render();
        // });

        // render slurs
        const slurGroups = _.flatten(slurs).map(slur => slur.render());
        scoreGroup.addChildren(slurGroups);

        // render legatos
        const legatoGroups = _.flatten(legatos).map(legato => legato.render());
        scoreGroup.addChildren(legatoGroups);

        scoreGroup.addChildren(systemGroups);
    }

    return scoreGroup;
};

Score.prototype.render = function () {
    const group = new paper.Group({
        name: TYPE
    });

    return group;
};

function isVoiceUsed (voice, lines) {
    return _.some(lines, line => _.some(line.voices, linesVoice => linesVoice === voice.name));
}

function getStartContext (score, time) {
    return score.lines.map(line => line.contextAt(time));
}

export function scoreToMeasures (score, repeats) {
    const numMeasures = _.sumBy(score.systems, system => system.measures);
    return createMeasures(numMeasures, [...score.timeSigs, ...repeats]);
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

function createTimeContexts (lines, voices, measures, chordSymbols) {
    // get the time contexts
	const lineItems = getStaffItems(lines, voices);
    // FIXME: returned contexts are incorrect when clef starts on beat other than 0.
	const lineTimes = map((line, items) => getTimeContexts(line, measures, items), lines, lineItems);

    // calculate the accidentals for each line.
	_.each(lineTimes, (times) => {
		const accidentals = getAccidentalContexts(times);
		// add accidentals to times
		_.each(times, (time, i) => time.context.accidentals = accidentals[i]);
	});

    return iterateByTime(timeContext => {
        let [symbols, ] = _.partition(chordSymbols, (sym) => {
            const symbolTime = getTime(measures, sym);
            const contextTime = _.find(timeContext, line => !!line).time;
            return equals(contextTime, symbolTime);
        });

        return new TimeContext(timeContext, symbols);
    }, lineTimes);
}

/*
 * @return [TimeContext[]]
 */
export function partitionBySystem (timeContexts, startMeasures) {
    // split staffTimes and measures
    let systemIdx = 0;

    const systemTimeContexts =  _.reduce(timeContexts, (acc, timeContext) => {
        const measure = timeContext.time.measure;
        const shouldPartition = measure >= startMeasures[systemIdx + 1];
		if (shouldPartition) {
            systemIdx++;
            while (measure >= startMeasures[systemIdx + 1]) {
                acc.push([]);
                systemIdx++;
            }
			let partition = [timeContext];
			acc.push(partition);
		} else {
            if (!acc[acc.length-1]) {
                acc.push([timeContext]);
            } else {
                acc[acc.length-1].push(timeContext);
            }
		}
		return acc;
	}, []);

    // add empty contexts for any remaining systemIdxs'
    _.each(_.drop(startMeasures, systemIdx + 2), () => systemTimeContexts.push([]));

    return systemTimeContexts;
}

function getLineByVoice (voice, lines) {
    return _.find(lines, (line) => {
        return _.indexOf(line.voices, voice) !== -1;
    });
}

function parseTitle (title) {
    if (isText(title)) {
        return title;
    } else if (_.isObject(title)) {
        return new Text(title);
    } else if (_.isString(title)) {
        return new Text({value: title});
    } else {
        return null;
    }
}

Score.getLineByVoice = getLineByVoice;

export default Score;
