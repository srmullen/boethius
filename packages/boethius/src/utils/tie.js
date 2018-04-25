import paper from 'paper';
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
