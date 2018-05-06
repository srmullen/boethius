import paper from 'paper';
import {first, last, dropRight, tail, partition} from 'lodash';
import {isChord} from "../types";

/*
 * @param item - Note or Chord.
 * @param incoming - the incoming tie handle
 * @param stemDirection - String.
 */
export function getTiePoint (item, stemDirection) {
	stemDirection = stemDirection || item.getStemDirection();

	const noteHead = isChord(item) ? item.getBaseNote(stemDirection).noteHead : item.noteHead;

	return stemDirection === "down" ? noteHead.bounds.center : noteHead.bounds.bottomCenter;
}

function getHandle (p1, p2, direction) {
	const vec = p2.subtract(p1).normalize();
	const perp = direction === 'up' ? new paper.Point(vec.y, -vec.x) : new paper.Point(-vec.y, vec.x);
	return perp.multiply(20);
}

export function getArcThru (points, stemDirection) {
	const begin = first(points);
	const end = last(points);
	if (points.length === 2) {
	    if (stemDirection === 'up') {
	        const vec = end.subtract(begin);
	        const center = begin.add(vec.divide(2));
	        return center.add([0, 8]);
	    } else {
	         const vec = end.subtract(begin);
	         const center = begin.add(vec.divide(2));
	         return center.subtract([0, 8]);
	    }
	} else {
		// const middle = dropRight(tail(points));
		if (stemDirection === 'up') {
            let arcThru = points.reduce((max, point) => {
                if (!max) return point;

                return point.y >= max.y ? point : max;
            }, null);
			if (arcThru === begin || arcThru === end) {
				// If the highest point is either the first or last point of the
				// tie, then find the middle of the tie and put some arc in it.
				const vec = end.subtract(begin);
				const middle = begin.add(vec.divide(2));
				arcThru = middle.add([0, 8]);
			} else if (Math.abs(arcThru.y - Math.min(begin.y, end.y)) < 10) {
                // Make sure the arc isn't too flat.
                arcThru = arcThru.add([0, 8]);
            }
			return arcThru;
		} else {
            let arcThru = points.reduce((min, point) => {
                if (!min) return point;

                return point.y <= min.y ? point : min;
            }, null);
			if (arcThru === begin || arcThru === end) {
				// If the highest point is either the first or last point of the
				// tie, then find the middle of the tie and put some arc in it.
				const vec = end.subtract(begin);
				const middle = begin.add(vec.divide(2));
				arcThru = middle.subtract([0, 8]);
			} else if (Math.abs(arcThru.y - Math.min(begin.y, end.y)) < 10) {
                // Make sure the arc isn't too flat.
                arcThru = arcThru.subtract([0, 8]);
            }
			return arcThru;
		}
	}
}

const SLUR_OVERARCH = 50;

export function tieOverSystemBreak (items, systemBreak) {
    const firstItem = first(items);
    const lastItem = last(items);

    const [part1, part2] = partition(items, item => item.time < systemBreak);
    let tie1, tie2;
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

/*
 * Given a collection of tieable items, returns [begin {Point}, arcThru {Point}, end {Point}].
 */
export function getTiePoints (items) {
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

export function tie (points) {
	const path = new paper.Path({
		fillColor: "black",
		strokeWidth: 1
	});

	path.add(points[0]);
	path.arcTo(points[1], points[2]);
	path.arcTo(points[1].add([0, 2]), points[0]);

	return path;
}
