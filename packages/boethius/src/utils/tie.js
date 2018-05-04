import paper from 'paper';
import {first, last} from 'lodash';
import {isChord} from "../types";

/*
 * @param item - Note or Chord.
 * @param incoming - the incoming tie handle
 * @param stemDirection - String.
 */
export function getTiePoint (item, incoming, stemDirection) {
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

export function getTieHandle (stemDirection) {
	const yVec = stemDirection === "up" ? 10 : -10;
	return new paper.Point([0, yVec]);
}

export function tie (begin, end, handle) {

	const path = new paper.Path({
		segments: [begin, end],
		strokeColor: "black",
		strokeWidth: 2
	});

	path.segments[0].handleOut = handle;
	path.segments[1].handleIn = handle;

	return path;
}

/*
 * @param points {Point[]} - Points to create in and out handles for.
 * @param direction {String} - The vertical direction the tie is arching.
 * @return [Point, Point] - handleOut for the first path segment and handleIn for the last path segement.
 */
export function getHandles (points, direction) {
	const handleOut = getHandle(points[0], points[1], direction);
	const handleIn = getHandle(points[points.length-1], points[points.length-2], direction);
	return [handleOut, handleIn];
}

function getHandle (p1, p2, direction) {
	const vec = p2.subtract(p1).normalize();
	const perp = direction === 'up' ? new paper.Point(vec.y, -vec.x) : new paper.Point(-vec.y, vec.x);
	return perp.multiply(20);
}

export function getArcThru (begin, end, stemDirection) {
    if (stemDirection === 'up') {
        const vec = end.subtract(begin);
        const center = begin.add(vec.divide(2));
        return center.add([0, 8]);
    } else {
         const vec = end.subtract(begin);
         const center = begin.add(vec.divide(2));
         return center.subtract([0, 8]);
    }
}

export function tieV3 (points) {
	const path = new paper.Path({
		fillColor: "black",
		strokeWidth: 1
	});

	path.add(points[0]);
	path.arcTo(points[1], points[2]);
	path.arcTo(points[1].add([0, 2]), points[0]);

	return path;
}
