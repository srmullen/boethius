import paper from "paper";
import {filter, first, last} from "lodash";

import constants from "../constants";
import {partitionBy} from "../utils/common";
import {tie, getTiePoint, getTieHandle} from '../utils/tie';

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
    } else if (this.systemBreak) {
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

        group.addChildren([tie1, tie2]);
    } else {
    	const stem = firstItem.getStemDirection();
    	const begin = getTiePoint(firstItem, null, stem);
    	const handle = getTieHandle(stem);
    	const end = getTiePoint(lastItem, handle);
        group.addChild(tie(begin, end, handle));
    }
    return group;
};

Legato.groupLegato = function (items) {
    return filter(partitionBy(items, item => item.legato), ([item]) => !!item.legato);
};

export default Legato;
