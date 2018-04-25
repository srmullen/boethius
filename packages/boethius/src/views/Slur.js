import paper from 'paper';
import {filter} from 'lodash';

import constants from '../constants';
import {isChord} from "../types";
import {partitionBy} from "../utils/common";
import {tie, getTiePoint, getTieHandle} from "../utils/tie";

const TYPE = constants.type.slur;

/*
 * Slur creates a tie between every note in the group.
 */
function Slur({}, children = []) {
    this.children = children;
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
        const stem = fromItem.getStemDirection();
    	const begin = getTiePoint(fromItem, null, stem);
    	const handle = getTieHandle(stem);
    	const end = getTiePoint(toItem, handle);
        group.addChild(tie(begin, end, handle));
    }

    return group;
}

Slur.groupSlurs = (items) => {
    return filter(partitionBy(items, item => item.slur), ([item]) => !!item.slur);
}

export default Slur;
