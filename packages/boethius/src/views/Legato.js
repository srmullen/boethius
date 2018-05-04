import paper from "paper";
import {filter, first, last, tail, dropRight, partition} from "lodash";

import constants from "../constants";
import {partitionBy} from "../utils/common";
import {tie, getTiePoint, getArcThru} from '../utils/tie';
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
            const end = getTiePoint(lastItem, stem);
            const begin = end.subtract(20, 0);
            const arcThru = getArcThru([begin, end], stem);
            group.addChild(tie([begin, arcThru, end]));
        } else {
            const stem = firstItem.getStemDirection();
            const begin = getTiePoint(firstItem, stem);
            const end = begin.add(20, 0);
            const arcThru = getArcThru([begin, end], stem);
            group.addChild(tie([begin, arcThru, end]));

        }
    }
    else if (this.systemBreak) {
        group.addChildren(tieOverSystemBreak(this.children, this.systemBreak));
    } else {
        group.addChild(tie(getTiePoints(this.children)));
    }

    return group;
}

/*
 * Given a collection of tieable items, returns [begin {Point}, arcThru {Point}, end {Point}].
 */
function getTiePoints (items) {
    const firstItem = first(items);
    const lastItem = last(items);
    const {top, bottom} = items.reduce((acc, item) => {

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
        const arcThru = getArcThru(bottom, firstStem);
        return [begin, arcThru, end];

    } else {
        // use top points
        const begin = first(top);
        const end = last(top);
        const arcThru = getArcThru(top, firstStem);
        return [begin, arcThru, end];
    }
}

function tieOverSystemBreak (items, systemBreak) {
    const firstItem = first(items);
    const lastItem = last(items);

    const [part1, part2] = partition(items, item => item.time < systemBreak);
    let tie1, tie2;
    const SLUR_OVERARCH = 50;
    if (part1.length === 1) {
        const firstStem = firstItem.getStemDirection();
        const s1Begin = getTiePoint(firstItem, firstStem);
        const s1End = s1Begin.add(SLUR_OVERARCH, 0);
        const arcThru1 = getArcThru([s1Begin, s1End], firstStem);
        tie1 = tie([s1Begin, arcThru1, s1End]);
    } else {
        const [begin, arcThru, end] = getTiePoints(part1);
        tie1 = tie([begin, arcThru, end.add(SLUR_OVERARCH, 0)]);
    }

    if (part2.length === 1) {
        const lastStem = lastItem.getStemDirection();
        const s2End = getTiePoint(lastItem, lastStem);
        const s2Begin = s2End.subtract(SLUR_OVERARCH, 0);
        const arcThru2 = getArcThru([s2Begin, s2End], lastStem);
        tie2 = tie([s2Begin, arcThru2, s2End]);
    } else {
        const [begin, arcThru, end] = getTiePoints(part2);
        tie2 = tie([begin.subtract(SLUR_OVERARCH, 0), arcThru, end]);
    }

    return [tie1, tie2];
}

Legato.groupLegato = function (items) {
    return filter(partitionBy(items, item => item.legato), ([item]) => !!item.legato);
};

export default Legato;
