import _ from "lodash";
import F from "fraction.js";

import constants from "../constants";
import {isNote, isChord} from "../types";
import {concat, partitionBy, mapDeep, reductions} from "../utils/common";
import {beam, drawTuplets} from "../engraver";
import {getAverageStemDirection, slur} from "../utils/note";
import {calculateDuration, getMeasureNumber, parseSignature, calculateTupletDuration, sumDurations} from "../utils/timeUtils";
import {getCenterLineValue} from "./Clef";

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

function Voice ({value, stemDirection}, children=[]) {
    this.value = value;

    this.children = calculateAndSetTimes(children);

    this.stemDirection = stemDirection;
}

Voice.prototype.type = constants.type.voice;

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
    let remainingItems = items;
    const beatGroups = _.map(groupingTimes, (groupingTime) => {
        const [beatGroup, rem] = _.partition(remainingItems, item => item.time < groupingTime);
        remainingItems = rem;
        return beatGroup;
    });

    return _.reject(_.map(beatGroups, beatGroup => {
        return _.filter(beatGroup, item => isNote(item) || isChord(item));
    }), _.isEmpty);
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
function stemAndBeam (centerLineValue, items, stemDirections) {
	if (items.length === 1) {
		items[0].renderStem(centerLineValue, stemDirections[0]);
	} else {
		return beam(items, {line: centerLineValue, stemDirections});
	}
}

/*
 * @param Item[][] - beamings
 * @param centerLineValue - String
 * @return String[] - stem direction of every note.
 */
function getAllStemDirections (beamings, centerLineValue) {
    return _.reduce(beamings, (acc, beaming) => {
        return acc.concat(getAverageStemDirection(beaming, centerLineValue));
    }, []);
}

/*
 * Render decorations (beams, tuples, slurs, etc) on items. If an item doesn't belong to a
 * measure in the measures array then decoration for it won't be rendered.
 * @param line - Line that the voice is being rendered on.
 * @param measures - Measure[]
 */
Voice.prototype.renderDecorations = function (line, centerLine, measures) {
    // group children by measures
    let itemsByMeasure = _.groupBy(this.children, child => getMeasureNumber(measures, child.time)),
        stemDirection = this.stemDirection;

    _.map(measures, (measure) => {
        const items = itemsByMeasure[measure.value];
        const pitched = _.filter(items, item => isNote(item) || isChord(item));
        pitched.map(note => note.drawLegerLines(centerLine, Scored.config.lineSpacing));
    });

    let lineChildren = []; // array of groups to be added to the line group

    _.map(measures, (measure) => {
        const items = itemsByMeasure[measure.value];

        // Nothing to do if there are no items in the measure.
        if (!items) return;

        const context = line.contextAt(measures, {measure: measure.value});
        let centerLineValue = getCenterLineValue(context.clef);
        // TODO: Should only iterate once for all grouping types. (beams, tuplets, etc.)

        // beams
        let beamings = Voice.findBeaming(context.timeSig, items);

        // get all the stemDirections
        let stemDirections = this.stemDirection ? _.fill(new Array(items.length), stemDirection) : getAllStemDirections(beamings, centerLineValue);

        let beams = _.compact(mapDeep(_.partial(stemAndBeam, centerLineValue), beamings, stemDirections));

        if (beams && beams.length) {
            lineChildren = lineChildren.concat(beams);
        }

        // tuplets
        let tuplets = Voice.groupTuplets(items);
        let tupletGroups = tuplets.map(tuplet => drawTuplets(tuplet, centerLine, this.stemDirection));
        if (tupletGroups && tupletGroups.length) {
            lineChildren = lineChildren.concat(tupletGroups);
        }
    });

    // slurs
    const slurred = Voice.groupSlurs(this.children);
    const slurs = _.map(slurred, slur);
    if (slurs && slurs.length) {
        lineChildren = lineChildren.concat(slurs);
    }

    // articulations
    _.each(this.children, (child) => {
        if (child.drawArticulations) child.drawArticulations();
    });

    return lineChildren;
};

/*
 * The given times must be a number because a Voice doesn't know about the measures or beats.
 * @param frm - Time to start collecting items at.
 * @param to - Time up to but not including collected items.
 * @return Item[]
 */
Voice.prototype.getTimeFrame = function getTimeFrame(frm, to) {
    const timeFrame = [];
    for (let i = 0; i < this.children.length; i++) {
        let item = this.children[i];
        if (item.time >= to) {
            break;
        } else if (item.time >= frm) {
            timeFrame.push(item);
        }
    }
    return timeFrame;
};

export default Voice;
