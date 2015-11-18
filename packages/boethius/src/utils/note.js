import * as common from "../utils/common";
import * as placement from "../utils/placement";
import teoria from "teoria";
import _ from "lodash";

/*
 * @param bline - y position of the bline
 */
function getStemDirection (note, bLine) {
	if (note.stemDirection) {
		return note.stemDirection;
	} else if (!_.isUndefined(bLine)) {
		return (placement.getNoteHeadCenter(note.noteHead.position).y > bLine.y) ? "up" : "down";
	} else {
		return "up";
	}
}

// for use in getSteps function
const noteValues = {c: 0, d: 1, e: 2, f: 3, g: 4, a: 5, b: 6};

/*
 * @param n1 - String representing the value of a note.
 * @param n2 - String representing the value of a note.
 * @return - Number of visible steps on a staff as the difference between n1 and n2.
 */
function getSteps (n1, n2) {
	let note1 = teoria.note(n1),
		note2 = teoria.note(n2);

	let octaveDiff = note2.octave() - note1.octave(),
		noteDiff = noteValues[note2.name()] - noteValues[note1.name()];

	return (octaveDiff * 7) + noteDiff;
}

/*
 * @param bline - y position of the bline
 */
function getStemLength (note, bline) {
	let octaveHeight = Scored.config.lineSpacing * 3.5;

	if (!bline) return octaveHeight;

	let noteDistance = Math.abs(bline.y - placement.getNoteHeadCenter(note.noteHead.position).y);

	return Math.max(octaveHeight, noteDistance);
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

function getStemPoint (note, fulcrum, vector, direction) {
	if (!note) {return;}

	var duration = getDuration(note),
		// get the beam point at the center of the noteHead
		noteHead = placement.getNoteHeadCenter(note.noteHead.position),
		centerPoint = getLinePoint(noteHead.x, fulcrum, vector),
		// direction = centerPoint.y < noteHead.y ? "up" : "down",
		point = getLinePoint((direction === "up" ? note.noteHead.bounds.right : note.noteHead.bounds.left), fulcrum, vector);

	return {point, duration};
}

/*
 * @param notes Note[]
 * @param centerLineValue - String representing center line note value
 */
function getNoteStemDirections (notes, centerLineValue) {
	let averageDirection = _.sum(notes.map(note => getSteps(centerLineValue, note.pitch))) < 0 ? "up" : "down";

	return notes.map(note => averageDirection);
}

// for use in beam function
const durationToBeams = {
	8: 1, 16: 2, 32: 3, 64: 4, 128: 5, 256: 6
};

function handleBeam (beam, {point, duration}, previous, next, fulcrum, vector, direction, yDiff) {
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
 * @param line - String value of center line
 */
function beam (notes, {line="b4", fulcrum, vector, kneeGap=5.5}) {

	let numBeams = durationToBeams[_.max(_.map(notes, note => note.note.duration.value))];
	let stemDirections = getNoteStemDirections(notes, line);

	vector = vector || new paper.Point(1, 0); // defaults to a flat line
	fulcrum = fulcrum || defaultStemPoint(notes[0], getStemLength(notes[0]), stemDirections[0]);

	// beams is an array of arrays of segments, beams[0] are eighth segments, beams[1] sixteenths, etc.
	let beams = common.doTimes(numBeams, () => [[]]),
		segments = _.reduce(notes, (acc, note, i) => {
			let {point, duration} = _.last(acc),
				direction = stemDirections[i],
				current = _.last(acc),
				previous = acc[i-1],
				nextNote = notes[i+1],
				next = getStemPoint(nextNote, fulcrum, vector, stemDirections[i+1]);

			_.last(beams[0]).push(point);

			if (duration >= 16) {
				handleBeam(beams[1], current, previous, next, fulcrum, vector, direction, 5);
			}

			if (duration >= 32) {
				handleBeam(beams[2], current, previous, next, fulcrum, vector, direction, 10);
			}

			if (duration >= 64) {
				handleBeam(beams[3], current, previous, next, fulcrum, vector, direction, 15);
			}

			if (duration >= 128) {
				handleBeam(beams[4], current, previous, next, fulcrum, vector, direction, 20);
			}

			if (duration >= 256) {
				handleBeam(beams[5], current, previous, next, fulcrum, vector, direction, 25);
			}

			// Break beams
			if (duration < 16 && beams[1]) {
				beams[1].push([]);
			}

			if (duration < 32 && beams[2]) {
				beams[2].push([]);
			}

			if (duration < 64 && beams[3]) {
				beams[3].push([]);
			}

			if (duration < 128 && beams[4]) {
				beams[4].push([]);
			}

			if (duration < 256 && beams[5]) {
				beams[5].push([]);
			}

			note.drawStem(point, direction);

			return common.concat(acc, next);
		}, [getStemPoint(notes[0], fulcrum, vector, stemDirections[0])]), // initialize the accumulator with the first point

		paths = _.map(_.flatten(beams), (bar) => {
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
	slur,
	getSteps,
	getNoteStemDirections
};
