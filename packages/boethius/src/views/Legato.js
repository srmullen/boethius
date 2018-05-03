import paper from "paper";
import {filter, first, last} from "lodash";

import constants from "../constants";
import {partitionBy} from "../utils/common";
import {tie, tieV2, getTiePoint, getTieHandle, getHandles} from '../utils/tie';
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
Legato.prototype.renderV3 = function () {
    const group = new paper.Group({name: TYPE});

    const firstItem = first(this.children);
    const lastItem = last(this.children);

    const {top, bottom} = this.children.reduce((acc, item) => {
        const stemDirection = item.getStemDirection();
        if (stemDirection === 'up') {
            acc.top.push(item.noteHead.bounds.topCenter);
        } else {
            acc.top.push(item.noteHead.bounds.center);
        }
        acc.bottom.push(item.group.bounds.bottomCenter);

        return acc;
    }, {top: [], bottom: []});

    group.addChildren(top.map(point => {
        return new paper.Path.Circle({
            center: point,
            radius: 5,
            fillColor: 'red'
        });
    }));

    group.addChildren(bottom.map(point => {
        return new paper.Path.Circle({
            center: point,
            radius: 5,
            fillColor: 'blue'
        });
    }));

	const firstStem = firstItem.getStemDirection();
    const lastStem = lastItem.getStemDirection();
	const begin = getTiePoint(firstItem, null, firstStem);
	const handle = getTieHandle(firstStem);
	const end = getTiePoint(lastItem, handle);
    group.addChild(tie(begin, end, handle));

    return group;
}

// Legato version two tries to determine the handle based on the childrens min or
// max height. Direction of the tie is still based on the stem direction of the first item.
Legato.prototype.renderV2 = function () {
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
        group.addChildren(twoNoteTie(firstItem, lastItem, this.systemBreak));
    } else {
        const {low, high} = this.children.reduce((acc, item) => {
            let low, high;
            if (!acc.low) {
                low = item.noteHead.bounds.center;
            } else {
                low = item.noteHead.bounds.center.y < acc.low.y ? item.noteHead.bounds.center : acc.low;
            }

            if (!acc.high) {
                high = item.group.bounds.bottomCenter;
            } else {
                high = item.group.bounds.bottom > acc.high.y ? item.group.bounds.bottomCenter : acc.high;
            }
            return {high, low};
        }, {low: null, high: null});

    	const firstStem = firstItem.getStemDirection();
        const lastStem = lastItem.getStemDirection();
    	const begin = getTiePoint(firstItem, null, firstStem);
    	const handle = getTieHandle(firstStem);
    	const end = getTiePoint(lastItem, handle);
        if (firstStem === 'up') {
            // const handle = new paper.Point([high.x - firstItem.group.bounds.center.x, high.y]);
            const points = [begin, high, end];
            const handles = getHandles(points, 'down');
            group.addChild(tieV2(points, handles));
        } else {
            // const handle = new paper.Point([low.x - firstItem.group.bounds.center.x, low.y]);
            const points = [begin, low, end];
            const handles = getHandles(points, 'up');
            group.addChild(tieV2(points, handles));
        }
    }

    return group;
};

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

Legato.prototype.render = Legato.prototype.renderV2;

Legato.groupLegato = function (items) {
    return filter(partitionBy(items, item => item.legato), ([item]) => !!item.legato);
};

export default Legato;
