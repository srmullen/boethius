import _ from 'lodash';
import constants from '../constants';
import {isPitched} from "../types";
import {beam} from '../engraver';
import {reductions} from "../utils/common";
import {parseSignature, getMeasureNumber} from "../utils/timeUtils";
import {getAverageStemDirection} from "../utils/note";

function Beaming ({stemDirection}, children = []) {
    this.stemDirection = stemDirection;
    this.children = children;
}

Beaming.prototype.type = constants.type.beaming;

Beaming.prototype.render = function () {
    console.log('rendering beaming');
}

Beaming.of = (context, children) => {
    return new Beaming(context, children);
}

Beaming.groupItems = function (items, {measures}={}) {
    if (!items.length) {
        return [];
    }
	const itemsByMeasure = _.groupBy(items, child => getMeasureNumber(measures, child.time));

    // NOTE: Currently only beaming items within a measure. Should make it possible to
    // beam across measures.
    return measures.reduce((acc, measure) => {
        const measureItems = itemsByMeasure[measure.value] || [];

        if (!measureItems.length) return acc;

        const timeSig = measure.timeSig;
        const [, denominator] = parseSignature(timeSig);
        const groupingDurations = timeSig.beatStructure.map(beats => beats * (1/denominator));
        const baseTime = measureItems[0].time; // the time from which the groupings are reckoned.
        const groupingTimes = _.tail(reductions((acc, el) => acc + el, groupingDurations, baseTime));

        const beamings = [];
        let groupingTimeIndex = 0;
        let [beaming, remainingItems] = nextBeaming(measureItems, groupingTimes[groupingTimeIndex]);
        beamings.push(beaming);
        while (remainingItems.length) {
            if (remainingItems[0].time >= groupingTimes[groupingTimeIndex]) groupingTimeIndex++;
            [beaming, remainingItems] = nextBeaming(remainingItems, groupingTimes[groupingTimeIndex]);
            if (beaming) beamings.push(beaming);
        }

        return acc.concat(_.reject(beamings, _.isEmpty));
    }, []);
}

Beaming.getAllStemDirections = function (items, centerLineValues) {
    return getAverageStemDirection(items, centerLineValues);
}

Beaming.prototype.render = function (centerLineValues, stemDirections) {
    if (this.children.length === 1) {
		this.children[0].renderStem(centerLineValues[0], stemDirections[0]);
	} else {
		return beam(this.children, {line: centerLineValues[0], stemDirections});
	}
}

/*
 * @param items - Array of items to be grouped
 * @param groupingTime - the time the grouping should end at.
 * @return [beaming, remainingItems]
 */
function nextBeaming (items, groupingTime) {
    const item = _.first(items);
    if (!isPitched(item)) {
        return [null, _.tail(items)];
    } else if (item.value <= 4) { // and item doesn't get beamed if it is a quarter note or greater.
        return [[_.first(items)], _.tail(items)];
    } else {
        const splitIndex = _.findIndex(items, item => ((item.time >= groupingTime || item.value <= 4) || !isPitched(item)));
        if (splitIndex === -1) {
            return [items, []];
        } else {
            return [_.take(items, splitIndex), _.drop(items, splitIndex)];
        }
    }
}

export default Beaming;
