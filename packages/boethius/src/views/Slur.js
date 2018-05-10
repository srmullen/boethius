import paper from 'paper';
import {filter} from 'lodash';

import constants from '../constants';
import {isChord} from "../types";
import {partitionBy} from "../utils/common";
import {tie, tieOverSystemBreak, getTiePoint, getArcThru} from "../utils/tie";

const TYPE = constants.type.slur;

/*
 * Slur creates a tie between every note in the group.
 */
function Slur({systemBreak, isEnd}, children = []) {
    this.children = children;
    this.systemBreak = systemBreak;
    this.isEnd = isEnd;
}

Slur.prototype.type = TYPE;

Slur.of = (context, children) => {
    return new Slur(context, children);
}

Slur.prototype.render = function () {
    const group = new paper.Group({name: TYPE});

    for (let i = 0; i < this.children.length - 1; i++) {
        const fromItem = this.children[i];
        const toItem = this.children[i+1];
        if (this.systemBreak && fromItem.time < this.systemBreak && toItem.time >= this.systemBreak) {
            group.addChildren(tieOverSystemBreak([fromItem, toItem], this.systemBreak));
        } else {
            const stem = fromItem.getStemDirection();
        	const begin = getTiePoint(fromItem, stem);
        	const end = getTiePoint(toItem, stem);
            const arcThru = getArcThru([begin, end], stem);
            group.addChild(tie([begin, arcThru, end]));
        }
    }

    return group;
}

Slur.groupItems = (items) => {
    return filter(partitionBy(items, item => item.slur), ([item]) => !!item.slur);
}

export default Slur;
