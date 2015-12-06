import _ from "lodash";
import F from "fraction.js";

import constants from "../constants";
import {isNote, isChord} from "../types";
import {concat, partitionBy, partitionWhen} from "../utils/common";
import {beam, drawTuplets} from "../engraver";
import * as lineUtils from "../utils/line";
import {calculateDuration, getMeasureNumber, getBeat, parseSignature, calculateTupletDuration, sumDurations} from "../utils/timeUtils";
import TimeSignature from "./TimeSignature";
// import Note from "./Note";
import Measure from "./Measure";
import {getCenterLineValue} from "./Clef";

function Voice ({value, stemDirection}, children=[]) {
    this.value = value;

    this.children = children.reduce((acc, item) => {
        let previousItem = _.last(acc);

        if (previousItem) {
            item.time = F(previousItem.time).add(calculateDuration(previousItem)).valueOf();
        } else {
            item.time = 0;
        }

        return concat(acc, item);
    }, []);

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
 * @param items - <Note, Chord>[]
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
   let stemmedItems = _.groupBy(_.filter(items, item => (isNote(item) || isChord(item)) && item.needsStem()), item => {
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
 * @param notes <Note, Chord>[]
 * @param centerLineValue - String representing note value.
 * @param stemDirection - optional String specifying the direction of all note stems.
 */
function stemAndBeam (items, centerLineValue, stemDirection) {
	if (items.length === 1) {
		items[0].renderStem(centerLineValue, stemDirection);
	} else {
		return beam(items, {line: centerLineValue, stemDirection});
	}
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
        let beams = _.compact(beamings.map(noteGrouping => stemAndBeam(noteGrouping, centerLineValue, this.stemDirection)));
        if (beams && beams.length) {
            line.group.addChildren(beams);
        }

        // tuplets
        let tuplets = Voice.groupTuplets(items);
        let tupletGroups = tuplets.map(drawTuplets);
        if (tupletGroups && tupletGroups.length) {
            line.group.addChildren(tupletGroups);
        }
    });
}

export default Voice;
