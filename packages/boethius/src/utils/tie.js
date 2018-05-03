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

/*
 * @param points {Point[]} - Points on the tie's path.
 * @param handles {Point[]} - Handles for each segment on the path. Length must
 * 	must be one less than length of points.
 * @returm {paper.Path}
 */
export function tieV2 (points, handles) {
	const path = new paper.Path({
		segments: points,
		strokeColor: "black",
		strokeWidth: 2
	});

	// path.fullySelected = true;

	// arc the first segment
	first(path.segments).handleOut = handles[0];
	// arc the last segment
	last(path.segments).handleIn = handles[1];

	for (let i = 0; i < path.segments.length - 1; i++) {
		let handleIn, handleOut;
		const handle = handles[i];
		const offset = path.getOffsetOf(path.segments[i].point) - 10;
		// Get the tangent slightly behind the segment point so the tangent is
		// from the smooth curve rather than the sharp cutoff to the next point.
		const tangent = path.getTangentAt(offset > 0 ? offset : 0).multiply(10);

		if (i !== 0) {
			path.segments[i].handleOut = tangent;
		}
		if (i !== path.segments.length -1) {
			path.segments[i+1].handleIn = tangent;
		}
	}

	return path;
}
