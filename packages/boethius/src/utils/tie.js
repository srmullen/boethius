import paper from 'paper';
import {first, last, dropRight, tail} from 'lodash';
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
		const middle = dropRight(tail(points));
		if (stemDirection === 'up') {
            let arcThru = middle.reduce((max, point) => {
                if (!max) return point;

                return point.y >= max.y ? point : max;
            }, null);
            if (Math.abs(arcThru.y - Math.min(begin.y, end.y)) < 10) {
                // Make sure the arc isn't too flat.
                arcThru = arcThru.add([0, 8]);
            }
			return arcThru;
		} else {
            let arcThru = middle.reduce((min, point) => {
                if (!min) return point;

                return point.y <= min.y ? point : min;
            }, null);

            if (Math.abs(arcThru.y - Math.min(begin.y, end.y)) < 10) {
                // Make sure the arc isn't too flat.
                arcThru = arcThru.subtract([0, 8]);
            }
			return arcThru;
		}
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
