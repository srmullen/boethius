import paper from "paper";
import {filter, first, last, tail, dropRight} from "lodash";

import constants from "../constants";
import {partitionBy} from "../utils/common";
import {tie, tieOverSystemBreak, getTiePoint, getTiePoints, getArcThru} from '../utils/tie';
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

Legato.groupItems = function (items) {
    return filter(partitionBy(items, item => item.legato), ([item]) => !!item.legato);
};

export default Legato;
