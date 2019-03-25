import _ from 'lodash';
import constants from '../constants';
import {drawTuplets} from "../engraver";
import {calculateTupletDuration, sumDurations} from "../utils/timeUtils";

function Tuplet (props, children=[]) {
    this.props = props;
    this.children = children;
}

Tuplet.prototype.type = constants.type.tuplet;

Tuplet.of = (context, children) => {
    return new Tuplet(context, children);
}

Tuplet.groupItems = function (items, {measures} = {}) {
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
            let longestDuration = _.minBy(grouping, item => item.value).value;
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

Tuplet.prototype.render = function (lineCenter) {
    return drawTuplets(this.children, lineCenter);
}

export default Tuplet;
