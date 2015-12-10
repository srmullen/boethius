import _ from "lodash";

import {calculateTimeLength} from "./placement";

/*
 * Groups and indexes voices by the lines they are to be rendered on. Voice names take priority, then order.
 * @param lines - Line[]
 * @param Voices - Voice[]
 * @return Map<Line, Voice[]>
 */
function groupVoices (lines, voices) {
    const voiceMap = new Map();
    _.each(voices, (voice, i) => {
        let voiceArr = voiceMap.get(lines[i]) || [];
        voiceMap.set(lines[i], voiceArr.concat(voice));
    });
    return voiceMap;
}

/*
 * Given lines and voices, returns an array of item arrays. The first array is all items to be rendered on the first line, and so on.
 * @param lines - Line[]
 * @param voices- Voice[]
 * @return Items[][]
 */
// FIXME: Incomplete/incorrect implementation just to get staff rendering.
function getLineItems (lines, voices) {
    let lineItems = [];
    for (let i = 0; i < lines.length; i++) {
        lineItems.push(voices[i].children);
    }
    return lineItems;
}

function calculateMeasureLengths (measures, times, noteHeadWidth, shortestDuration) {
    // group items by measure.
    let itemsInMeasure = _.groupBy(times, (item) => {
        return item.time.measure;
    });

    let measureLengths = _.map(measures, (measure, i) => {
        let measureLength = _.sum(_.map(itemsInMeasure[i], ({items}) => calculateTimeLength(items, shortestDuration)));
        measureLength += noteHeadWidth;
        return measureLength;
    });

    return measureLengths;
}

export {
    groupVoices,
    getLineItems,
    calculateMeasureLengths
};
