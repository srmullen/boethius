import _ from "lodash";
import F from "fraction.js";

import constants from "../constants";
import {isNote, isChord} from "../types";
import {concat, partitionBy, partitionWhen, mapDeep} from "../utils/common";
import {beam, drawTuplets} from "../engraver";
import * as lineUtils from "../utils/line";
import {getAverageStemDirection} from "../utils/note";
import {calculateDuration, getMeasureNumber, getBeat, parseSignature, calculateTupletDuration, sumDurations} from "../utils/timeUtils";
import TimeSignature from "./TimeSignature";
import Measure from "./Measure";
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

Voice.prototype.renderChildren = function () {
    return this.children.map((child, i) => {
        return child.render();
    });
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

   // get the beat type
   const sig = parseSignature(timeSig);
   const baseTime = items[0].time; // the time from which the groupings are reckoned.

   // remove notes that don't need beaming or flags (i.e. quarter notes and greater)
   let stemmedItems = _.groupBy(_.filter(items, item => (isNote(item) || isChord(item))), item => {
       return Math.floor(getBeat(item.time, sig, baseTime));
   });

   let groupings = [];
   for (let i = 0, beat = 0; i < timeSig.beatStructure.length; i++) { // count down through the beats for each
								                                        // beat structure and add the notes to be beamed.
       for (let beats = timeSig.beatStructure[i]; beats > 0; beats--) {
           if (stemmedItems[beat]) {
               let breakNum = 0; // for causing splits between quater notes in the same beat (i.e. tuplets);
               let beatSubdivisions = partitionBy(stemmedItems[beat], item => {
                   return item.needsFlag() ? "flag" : breakNum++;
               });
               _.each(beatSubdivisions, subdivision => groupings.push(subdivision));
           }

           beat++;
       }
   }

   return groupings;
}

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
    let currentTuplet;

    const groupings = [];
    let previousTuplet = null;
    let tupletType = null;
    let tupletDuration = 0;
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        if (!item.tuplet) { // skip this item
            previousTuplet = null;
        } else if (item.tuplet !== previousTuplet || !_.last(groupings)) { // create a new tuplet grouping
            groupings.push([item]);
            previousTuplet = item.tuplet;
            tupletType = item.value;
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
}

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
 * @param line - Line that the voice is being rendered on.
 * @param measures - Measure[]
 */
Voice.prototype.renderDecorations = function (line, measures) {
    // group children by measures
    let b = lineUtils.b(line.group),
        itemsByMeasure = _.groupBy(this.children, child => getMeasureNumber(measures, child.time)),
        stemDirection = this.stemDirection;

    _.map(itemsByMeasure, (items, measureNum) => {
        const pitched = _.filter(items, item => isNote(item) || isChord(item));
        pitched.map(note => note.drawLegerLines(b, Scored.config.lineSpacing));
    });

    // beam the notes
    _.map(itemsByMeasure, (items, measure) => {
        let context = line.contextAt(measures, {measure: Number.parseInt(measure)});
        let centerLineValue = getCenterLineValue(context.clef);
        // TODO: Should only iterate once for all grouping types. (beams, tuplets, etc.)

        // beams
        let beamings = Voice.findBeaming(context.timeSig, items);

        // get all the stemDirections
        let stemDirections = this.stemDirection ? _.fill(new Array(items.length), stemDirection) : getAllStemDirections(beamings, centerLineValue);

        let beams = _.compact(mapDeep(_.partial(stemAndBeam, centerLineValue), beamings, stemDirections));

        if (beams && beams.length) {
            line.group.addChildren(beams);
        }

        // tuplets
        let tuplets = Voice.groupTuplets(items);
        let tupletGroups = tuplets.map(tuplet => drawTuplets(tuplet, b, this.stemDirection));
        if (tupletGroups && tupletGroups.length) {
            line.group.addChildren(tupletGroups);
        }
    });
}

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
}

export default Voice;
