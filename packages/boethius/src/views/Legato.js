import paper from "paper";
import {filter, first, last, tail, dropRight} from "lodash";

import constants from "../constants";
import {partitionBy} from "../utils/common";
import {tie, tieV2, tieV3, getTiePoint, getTieHandle, getHandles} from '../utils/tie';
import {getNoteHeadOffset} from '../utils/placement';

const TYPE = constants.type.legato;

/*
 * Legato creates a sigle tie over a group of notes.
 * @param systemBreak - true if legato is across systems.
 * @param isEnd - true if legato ends on only item in children. Makes no difference is children contains multiple items.
 */
function Legato ({systemBreak, isEnd}, children = []) {
    this.systemBreak = systemBreak;
    this.isEnd = isEnd;
    this.children = children;
}

Legato.prototype.type = TYPE;

Legato.of = (context, children) => {
    return new Legato(context, children);
};

// Legato render version 3 chooses the tie direction based on the minimum difference
// between the top and bottom tie points.
Legato.prototype.render = function () {
    const group = new paper.Group({name: TYPE});

    const firstItem = first(this.children);
    const lastItem = last(this.children);

    if (this.children.length === 1) {
        if (this.isEnd) {
            const stem = lastItem.getStemDirection();
            const end = getTiePoint(lastItem, null, stem);
            const begin = end.subtract(20, 0);
            const handle = getTieHandle(stem);
            group.addChild(tie(begin, end, handle));
        } else {
            const stem = firstItem.getStemDirection();
            const begin = getTiePoint(firstItem, null, stem);
            const end = begin.add(20, 0);
            const handle = getTieHandle(stem);
            group.addChild(tie(begin, end, handle));

        }
    } else if (this.children.length === 2) {
        // TODO: Incorporate this into the `else` scheme rather than use twoNoteTie function.
        group.addChildren(twoNoteTie(firstItem, lastItem, this.systemBreak));
    } else {

        const {top, bottom} = this.children.reduce((acc, item) => {

            acc.top.push(item.getTop());
            acc.bottom.push(item.getBottom());

            return acc;
        }, {top: [], bottom: []});

    	const firstStem = firstItem.getStemDirection();

        if (firstStem === 'up') {
            // use bottom points
            const begin = first(bottom);
            const end = last(bottom);
            // Only look at middle points because can't arc through first or last point.
            const middle = dropRight(tail(bottom));
            let arcThru = middle.reduce((max, point) => {
                if (!max) return point;

                return point.y >= max.y ? point : max;
            }, null);
            if (Math.abs(arcThru.y - Math.min(begin.y, end.y)) < 10) {
                // Make sure the arc isn't too flat.
                arcThru = arcThru.add([0, 5]);
            }
            group.addChild(tieV3([begin, arcThru, end]));
        } else {
            // use top points
            const begin = first(top);
            const end = last(top);
            const middle = dropRight(tail(top));
            let arcThru = middle.reduce((min, point) => {
                if (!min) return point;

                return point.y <= min.y ? point : min;
            }, null);

            if (Math.abs(arcThru.y - Math.min(begin.y, end.y)) < 10) {
                // Make sure the arc isn't too flat.
                arcThru = arcThru.subtract([0, 5]);
            }
            group.addChild(tieV3([begin, arcThru, end]));
        }

        // TODO: Make sure there is a minimum and maximum arc.
    }

    return group;
}

// Original tie algorithm.
function twoNoteTie (firstItem, lastItem, systemBreak) {
    if (systemBreak) {
        // TODO: Currently assumes only two notes in tie. Need to handle many notes.
        const firstStem = firstItem.getStemDirection();
        const s1Begin = getTiePoint(firstItem, null, firstStem);
        const s1End = s1Begin.add(20, 0);
        const s1Handle = getTieHandle(firstStem);
        const tie1 = tie(s1Begin, s1End, s1Handle);

        const lastStem = lastItem.getStemDirection();
        const s2End = getTiePoint(lastItem, null, lastStem);
        const s2Begin = s2End.subtract(20, 0);
        const s2Handle = getTieHandle(lastStem);
        const tie2 = tie(s2Begin, s2End, s2Handle);
        return [tie1, tie2];
    } else {
        const firstStem = firstItem.getStemDirection();
        const lastStem = lastItem.getStemDirection();
        const begin = getTiePoint(firstItem, null, firstStem);
        const handle = getTieHandle(firstStem);
        const end = getTiePoint(lastItem, handle);
        return [tie(begin, end, handle)];
    }
}

Legato.groupLegato = function (items) {
    return filter(partitionBy(items, item => item.legato), ([item]) => !!item.legato);
};

export default Legato;
