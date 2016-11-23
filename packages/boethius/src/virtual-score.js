import _ from "lodash";

import Voice from "./views/Voice";
import Note from "./views/Note";
import Rest from "./views/Rest";
import Chord from "./views/Chord";
import System from "./views/System";
import Line from "./views/Line";
import Measure, {createMeasures} from "./views/Measure";
import Clef from "./views/Clef";
import Key from "./views/Key";
import TimeSignature from "./views/TimeSignature";
import Dynamic from "./views/Dynamic";
import ChordSymbol from "./views/ChordSymbol";
import Score, {scoreToMeasures, getSystemTimeContexts, createLineTimeContext, renderDecorations} from "./views/Score";

import constants from "./constants";
import {map, reductions, partitionWhen, clone, concat, set} from "./utils/common";
import {getTimeContexts} from "./utils/line";
import {getStaffItems, iterateByTime} from "./utils/system";
import {getAccidentalContexts} from "./utils/accidental";
import {getTime} from "./utils/timeUtils";
import * as diff from "./utils/diff";
import {parse} from "./utils/parser";
import {isClef, isKey, isTimeSignature} from "./types";

const RENDERALL = "RENDERALL";

let cache = {
    score: {},
    startMeasures: [],
    // [Voice]
    voices: [],
    systemGroups: []
};
let scoreGroup, measures, systems, startMeasures, systemGroups;

/*
 * @param score {Score} - the score to render.
 * @param voices {Voice[]}
 * @param pages {Number[]} - the page to render.
 */
export default function render (score, {voices=[], pages=[1]}) {
    // FIXME: voiceDiff currently unused.
    const voiceDiff = diffAllVoices(cache.voices, voices);

    if (!cache.score || diff.measures(cache.score, score)) {
        measures = scoreToMeasures(score);
    }

    // const systemHeights = score.systemHeights;
    const heightsDiff = diff.arrays(cache.score.systemHeights || [], score.systemHeights);
    if (scoreGroup && cache.score.systemHeights && heightsDiff.length) {
        heightsDiff.map((i) => {
            if (cache.systemGroups[i]) {
                cache.systemGroups[i].translate(0, score.systemHeights[i] - cache.score.systemHeights[i]);
            }
        });
    } else {
        if (scoreGroup) {
            scoreGroup.remove();
        }

        // Create the Score Group. No actual rendering is done here.
        scoreGroup = score.render();

        // get the start measure for each System.
        startMeasures = reductions((acc, stave) => acc + stave.measures, score.systems, 0);

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

        const systemsToRender = _.reduce(score.systems, (acc, system, i) => {
            return _.contains(pages, system.page) ? concat(acc, [system, systemTimeContexts[i], i]) : acc;
        }, []);

        systemGroups = _.reduce(systemsToRender, (acc, [system, timeContext, i]) => {
            const endMeasure = startMeasures[i] + system.measures;
            const systemMeasures = _.slice(measures, startMeasures[i], endMeasure);

            const systemGroup = System.renderTimeContexts(system, score.lines, systemMeasures, voices, timeContext, score.length);

            // Add height of previously rendered pages
            const systemTranslation = (!_.contains(pages, system.page - 1)) ?
                score.systemHeights[i] :
                score.systemHeights[i] + _.indexOf(pages, system.page) * score.pageHeight;

            systemGroup.translate(0, systemTranslation);

            return set(acc, i, systemGroup);
        }, []);

        scoreGroup.addChildren(systemGroups);

        renderDecorations(scoreGroup, voices);
    }

    // set cache items
    if (score) cache.score = score;
    if (startMeasures) cache.startMeasures = startMeasures;
    if (systemGroups) cache.systemGroups = systemGroups;
    if (voices) cache.voices = voices;

    return scoreGroup;
};

function diffAllVoices (previous, next) {
    const previousVoices = _.groupBy(previous, voice => voice.name);
    const nextVoices = _.groupBy(next, voice => voice.name);

    const voices = previousVoices.length > nextVoices.length ? previousVoices : nextVoices;
    // loop over longer voice list
    let times = [];
    for (let name in voices) {
        if (!previousVoices[name] || !nextVoices[name]) return RENDERALL;
        times = times.concat(diff.voices(previousVoices[name][0], nextVoices[name][0]));
    }

    return _.uniq(_.sortBy(times));
}

function createVoiceScoredObjects (voices) {
    return voices.map(parse);
}
