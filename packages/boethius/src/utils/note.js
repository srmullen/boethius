import * as common from "../utils/common";
import * as placement from "../utils/placement";
import _ from "lodash";

/*
 * @param bline - y position of the bline
 */
function getStemDirection (note, bLine) {
	if (note.stemDirection) {
		return note.stemDirection;
	} else if (!_.isUndefined(bLine)) {
		// return "down"; // FIXME: figure out when adding notes to lines
		// return (note.noteHead.position.y <= bLine.y) ? "down" : "up";
		return (placement.getNoteHeadCenter(note.noteHead.position).y > bLine.y) ? "up" : "down";
	} else {
		return "up";
	}
}

/*
 * @param bline - y position of the bline
 */
function getStemLength (/*note, bline, octaveHeight*/) {
	return Scored.config.lineSpacing * 3.5;
}

function defaultStemPoint (note, stemLength, stemDirection) {
	var frm, to;
	if (stemDirection === "up") {
		frm = note.noteHead.bounds.rightCenter.add(0, Scored.config.note.head.yOffset);
		to = frm.subtract([0, stemLength]);
	} else {
		frm = note.noteHead.bounds.leftCenter.add(0, Scored.config.note.head.yOffset);
		to = frm.add([0, stemLength]);
	}
	return to;
}

function getDuration (note) {
	return note ? note.note.duration.value : undefined;
}

/*
 * Given an x coordinate, fulcrum and vector, returns the point on the line
 */
function getLinePoint (x, fulcrum, vector) {
	var shift = x - fulcrum.x;
	return fulcrum.add(shift, vector.y / vector.x * shift);
}

function getStemPoint (note, fulcrum, vector) {
	if (!note) {return;}

	var duration = getDuration(note),
		// get the beam point at the center of the noteHead
		noteHead = placement.getNoteHeadCenter(note.noteHead.position),
		centerPoint = getLinePoint(noteHead.x, fulcrum, vector),
		direction = centerPoint.y < noteHead.y ? "up" : "down",
		point = getLinePoint((direction === "up" ? note.noteHead.bounds.right : note.noteHead.bounds.left), fulcrum, vector);

	return {point, direction, duration};
}

const durationToBars = {
	8: 1, 16: 2, 32: 3, 64: 4, 128: 5, 256: 6
};

function handleBeam (beam, {point, direction, duration}, previous, next, fulcrum, vector, yDiff) {
	let lastBeam = _.last(beam),
		BEAM_DIFF = [0, yDiff],
		p16;

	if (direction === "up") { // should use vector from stemPoint to note rather than direction string
		p16 = point.add(BEAM_DIFF);
	} else {
		p16 = point.subtract(BEAM_DIFF);
	}

	// create left flag point
	if (previous && previous.duration < duration && (!next || next.duration < duration)) {
		let p = getLinePoint(p16.x - 10, fulcrum, vector),
			flag = direction === "up" ? p.add(BEAM_DIFF) : p.subtract(BEAM_DIFF);

		lastBeam.push(flag);
	}

	lastBeam.push(p16);

	// create right flag point
	if (next && !previous && next.duration < duration) {
		// let flag = getLinePoint(p16.x + 10, fulcrum, vector).subtract(BEAM_DIFF);
		let p = getLinePoint(p16.x + 10, fulcrum, vector),
			flag = direction === "up" ? p.add(BEAM_DIFF) : p.subtract(BEAM_DIFF);
		lastBeam.push(flag);
	}
}

/*
 * @param notes - collection of the notes to bar.
 * @param fulcrum - a point that the bar passes through
 * @param vector - the vector of the bar
 */
function beam (notes, fulcrum, vector) {
	vector = vector || new paper.Point(1, 0); // defaults to a flat line
	fulcrum = fulcrum || defaultStemPoint(notes[0], getStemLength(notes[0]), getStemDirection(notes[0]));

	let numBars = durationToBars[_.max(_.map(notes, note => note.note.duration.value))];
		// bars is an array of arrays of segments, bars[0] are eighth segments, bars[1] sixteenths, etc.
	let bars = common.doTimes(numBars, () => [[]]),
		segments = _.reduce(notes, (acc, note, i) => {
			let {point, direction, duration} = _.last(acc),
				current = _.last(acc),
				previous = acc[i-1],
				nextNote = notes[i+1],
				next = getStemPoint(nextNote, fulcrum, vector);

			_.last(bars[0]).push(point);

			if (duration >= 16) {
				handleBeam(bars[1], current, previous, next, fulcrum, vector, 5);
			}

			if (duration >= 32) {
				handleBeam(bars[2], current, previous, next, fulcrum, vector, 10);
			}

			if (duration >= 64) {
				handleBeam(bars[3], current, previous, next, fulcrum, vector, 15);
			}

			if (duration >= 128) {
				handleBeam(bars[4], current, previous, next, fulcrum, vector, 20);
			}

			if (duration >= 256) {
				handleBeam(bars[5], current, previous, next, fulcrum, vector, 25);
			}

			// Break bars
			if (duration < 16 && bars[1]) {
				bars[1].push([]);
			}

			if (duration < 32 && bars[2]) {
				bars[2].push([]);
			}

			if (duration < 64 && bars[3]) {
				bars[3].push([]);
			}

			if (duration < 128 && bars[4]) {
				bars[4].push([]);
			}

			if (duration < 256 && bars[5]) {
				bars[5].push([]);
			}

			note.drawStem(point, direction);

			return common.concat(acc, next);
		}, [getStemPoint(notes[0], fulcrum, vector)]), // initialize the accumulator with the first point

		paths = _.map(_.flatten(bars), (bar) => {
			return new paper.Path({
				segments: bar,
				strokeColor: "black",
				strokeWidth: 3
			});
		});

	// what group should this be added to?
	return new paper.Group({
		name: "beam",
		children: paths
	});
}

/*
 * @param incoming - the incoming slur handle
 */
function getSlurPoint (note, incoming, stemDirection) {
	stemDirection = stemDirection || getStemDirection(note);

	if (!incoming) {
		return stemDirection === "down" ? note.noteHead.bounds.center : note.noteHead.bounds.bottomCenter;
	} else if (incoming.y < 0) {
		return note.noteHead.bounds.center;
	} else {
		return note.noteHead.bounds.bottomCenter;
	}
}

function getSlurHandle (stemDirection) {
	let yVec = stemDirection === "up" ? 10 : -10;
	return new paper.Point([0, yVec]);
}

function slur (notes) {
	let firstNote = notes[0],
		lastNote = _.last(notes),
		firstStem = getStemDirection(firstNote),
		begin = getSlurPoint(firstNote, null, firstStem),
		handle = getSlurHandle(firstStem),
		end = getSlurPoint(lastNote, handle),
		center = begin.add(end.subtract(begin).divide(2)).add([0, 4]);

	let path = new paper.Path({
		segments: [begin, end],
		strokeColor: "black",
		strokeWidth: 2
	});

	path.segments[0].handleOut = handle;
	path.segments[1].handleIn = handle;
}

export {
	beam,
	getDuration,
	getStemDirection,
	getStemLength,
	getStemPoint,
	defaultStemPoint,
	slur
};
