import paper from "paper";
import {filter, first, last} from "lodash";

import constants from "../constants";
import {isChord} from "../types";
import {partitionBy} from "../utils/common";
import {slur} from "../utils/note";

const TYPE = constants.type.slur;

/*
 * @param systemBreak - true if slur is across systems.
 * @param isEnd - true if slur ends on only item in children. Makes no difference is children contains multiple items.
 */
function Slur ({systemBreak, isEnd}, children = []) {
    this.systemBreak = systemBreak;
    this.isEnd = isEnd;
    this.children = children;
}

Slur.prototype.type = TYPE;

Slur.of = (context, children) => {
    return new Slur(context, children);
};

Slur.prototype.render = function () {
    const group = new paper.Group({name: TYPE});

    const firstItem = first(this.children);
    const lastItem = last(this.children);
    if (this.children.length === 1) {
        if (this.isEnd) {
            const stem = lastItem.getStemDirection();
            const end = getSlurPoint(lastItem, null, stem);
            const begin = end.subtract(20, 0);
            const handle = getSlurHandle(stem);
            group.addChild(slur(begin, end, handle));
        } else {
            const stem = firstItem.getStemDirection();
            const begin = getSlurPoint(firstItem, null, stem);
            const end = begin.add(20, 0);
            const handle = getSlurHandle(stem);
            group.addChild(slur(begin, end, handle));

        }
    } else if (this.systemBreak) {
        // TODO: Currently assumes only two notes in slur. Need to handle many notes.
        const firstStem = firstItem.getStemDirection();
        const s1Begin = getSlurPoint(firstItem, null, firstStem);
        const s1End = s1Begin.add(20, 0);
        const s1Handle = getSlurHandle(firstStem);
        const slur1 = slur(s1Begin, s1End, s1Handle);

        const lastStem = lastItem.getStemDirection();
        const s2End = getSlurPoint(lastItem, null, lastStem);
        const s2Begin = s2End.subtract(20, 0);
        const s2Handle = getSlurHandle(lastStem);
        const slur2 = slur(s2Begin, s2End, s2Handle);

        group.addChildren([slur1, slur2]);
    } else {
    	const stem = firstItem.getStemDirection();
    	const begin = getSlurPoint(firstItem, null, stem);
    	const handle = getSlurHandle(stem);
    	const end = getSlurPoint(lastItem, handle);
        group.addChild(slur(begin, end, handle));
    }
    return group;
};

Slur.groupSlurs = function (items) {
    return filter(partitionBy(items, item => item.slur), ([item]) => !!item.slur);
};

/*
 * @param item - Note or Chord.
 * @param incoming - the incoming slur handle
 * @param stemDirection - String.
 */
function getSlurPoint (item, incoming, stemDirection) {
	stemDirection = stemDirection || item.getStemDirection();

	const noteHead = isChord(item) ? item.getBaseNote(stemDirection).noteHead : item.noteHead;

	if (!incoming) {
		return stemDirection === "down" ? noteHead.bounds.center : noteHead.bounds.bottomCenter;
	} else if (incoming.y < 0) {
		return noteHead.bounds.center;
	} else {
		return noteHead.bounds.bottomCenter;
	}
}

function getSlurHandle (stemDirection) {
	const yVec = stemDirection === "up" ? 10 : -10;
	return new paper.Point([0, yVec]);
}

export default Slur;
