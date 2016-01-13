import _ from "lodash";
import F from "fraction.js";

import constants from "../constants";
import {isPitched} from "../types";
import {concat, partitionBy, reductions} from "../utils/common";
import {beam, drawTuplets} from "../engraver";
import {getAverageStemDirection, slur} from "../utils/note";
import {calculateDuration, parseSignature, calculateTupletDuration, sumDurations} from "../utils/timeUtils";

/*
 * @param items - Item[]
 * @param offset - Optional amount of time that will be added to the items times.
 */
function calculateAndSetTimes (items, offset=0) {
    return items.reduce((acc, item) => {
        let previousItem = _.last(acc);

        if (previousItem) {
            item.time = F(previousItem.time).add(calculateDuration(previousItem)).add(offset).valueOf();
        } else {
            item.time = 0;
        }

        return concat(acc, item);
    }, []);
}

function Voice ({value, name, stemDirection}, children=[]) {
    this.value = value;

    this.name = name;

    this.children = calculateAndSetTimes(children);

    this.stemDirection = stemDirection;
}

Voice.prototype.type = constants.type.voice;

/*
 * @param items - Array of items to be grouped
 * @param groupingTime - the time the grouping should end at.
 * @return [beaming, remainingItems]
 */
function nextBeaming (items, groupingTime) {
    const item = _.first(items);
    if (!isPitched(item)) {
        return [null, _.rest(items)];
    } else if (item.value <= 4) { // and item doesn't get beamed if it is a quarter note or greater.
        return [[_.first(items)], _.rest(items)];
    } else {
        return _.partition(items, item => item.time < groupingTime);
    }
}

/*
 * Notes must have time properties for this function to work.
 * Should this function just calculate their times from the first note instead?
 * @param timeSig - TimeSignature
 * @param items - <Note, Chord>[][]
 * @return - array of note groupings.
 */
Voice.findBeaming = function findBeaming (timeSig, items) {
    if (!items.length) {
        return [];
    }

    const [, denominator] = parseSignature(timeSig);
    const groupingDurations = timeSig.beatStructure.map(beats => beats * (1/denominator));
    const baseTime = items[0].time; // the time from which the groupings are reckoned.
    const groupingTimes = _.rest(reductions((acc, el) => acc + el, groupingDurations, baseTime));

    const beamings = [];
    let groupingTimeIndex = 0;
    let [beaming, remainingItems] = nextBeaming(items, groupingTimes[groupingTimeIndex]);
    beamings.push(beaming);
    while (remainingItems.length) {
        if (remainingItems[0].time >= groupingTimes[groupingTimeIndex]) groupingTimeIndex++;
        [beaming, remainingItems] = nextBeaming(remainingItems, groupingTimes[groupingTimeIndex]);
        if (beaming) beamings.push(beaming);
    }

    return _.reject(beamings, _.isEmpty);
};

/*
 * items must have time properties.
 * @param timeSig - time signature in the current contet.
 * @param items - array if items.
 * @return - array of arrays of tuplets.
 */
Voice.groupTuplets = function groupTuplets (items) {
    if (!items.length) {
        return [];
    }

    // filter out items that don't have a tuplet after partitioning them.

    const groupings = [];
    let previousTuplet = null;
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        if (!item.tuplet) { // skip this item
            previousTuplet = null;
        } else if (item.tuplet !== previousTuplet || !_.last(groupings)) { // create a new tuplet grouping
            groupings.push([item]);
            previousTuplet = item.tuplet;
        } else { // add the item to the previous grouping.
            let grouping = _.last(groupings);
            let longestDuration = _.min(grouping, item => item.value).value;
            let currentTupletDuration = sumDurations(grouping);
            let maxTupletDuration = calculateTupletDuration(previousTuplet, longestDuration);
            if (currentTupletDuration < maxTupletDuration) { // floating point error
                grouping.push(item); // add the item to the last tuplet grouping.
            } else {
                groupings.push([item]); // create a new tuplet grouping.
            }
            // no need to update previousTuplet since it is the same
        }
    }

    return groupings;
};

Voice.groupSlurs = function (items) {
    return _.filter(partitionBy(items, item => item.slur), ([item]) => !!item.slur);
};

/*
 * @param centerLineValue - String representing note value.
 * @param notes <Note, Chord>[]
 * @param stemDirections - optional String specifying the direction of all note stems.
 */
Voice.stemAndBeam = function stemAndBeam (centerLineValue, items, stemDirections) {
	if (items.length === 1) {
		items[0].renderStem(centerLineValue, stemDirections[0]);
	} else {
		return beam(items, {line: centerLineValue, stemDirections});
	}
};

/*
 * @param Item[][] - beamings
 * @param centerLineValue - String
 * @return String[] - stem direction of every note.
 */
Voice.getAllStemDirections = function getAllStemDirections (beamings, centerLineValue) {
    return _.reduce(beamings, (acc, beaming) => {
        return acc.concat(getAverageStemDirection(beaming, centerLineValue));
    }, []);
};

Voice.renderArticulations = function (items) {
    _.each(items, (item) => {
        if (item.drawArticulations) item.drawArticulations();
    });
};

Voice.renderTuplets = function (items, centerLine) {
    const tuplets = Voice.groupTuplets(items);
    return tuplets.map(tuplet => drawTuplets(tuplet, centerLine, this.stemDirection));
};

Voice.prototype.renderSlurs = function () {
    const slurred = Voice.groupSlurs(this.children);
    return _.map(slurred, slur);
};

function gt (n1, n2) {
    return n1 > n2;
}

function gte (n1, n2) {
    return n1 >= n2;
}

/*
 * The given times must be a number because a Voice doesn't know about the measures or beats.
 * @param frm - Time to start collecting items at.
 * @param to - Time up to but not including collected items.
 * @param inclusive - Boolean, true if to time is to be included in returned items.
 * @return Item[]
 */
Voice.prototype.getTimeFrame = function getTimeFrame(frm, to, inclusive) {
    const timeFrame = [];
    const comparison = inclusive ? gt : gte;
    for (let i = 0; i < this.children.length; i++) {
        let item = this.children[i];
        if (comparison(item.time, to)) {
            break;
        } else if (item.time >= frm) {
            timeFrame.push(item);
        }
    }
    return timeFrame;
};

export default Voice;
