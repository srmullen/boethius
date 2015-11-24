import {doTimes, concat, map, partitionBy} from "../utils/common";
import * as placement from "../utils/placement";
import teoria from "teoria";
import _ from "lodash";

/*
 * @param note - Note for which to get the stem direction.
 * @param centerLineValue - String note pitch of center line.
 */
function getStemDirection (note, centerLineValue) {
	if (note.stemDirection) {
		return note.stemDirection;
	} else if (centerLineValue) {
		return getSteps(centerLineValue, note.pitch) < 0 ? "up" : "down";
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
 * @param note - Note to find the stem length for.
 * @param centerLineValue - String representing note value at the center line.
 */
function getStemLength (note, centerLineValue) {
	let octaveHeight = Scored.config.lineSpacing * 3.5;

	// if (!bline) return octaveHeight;
	if (!centerLineValue) return octaveHeight;

	// let noteDistance = Math.abs(bline.y - placement.getNoteHeadCenter(note.noteHead.position).y);
	let steps = getSteps(centerLineValue, note.pitch),
		noteDistance = steps * Scored.config.stepSpacing;

	return Math.max(octaveHeight, Math.abs(noteDistance));
}

function defaultStemPoint (note, stemDirection, stemLength) {
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

function calculateStemPoint (note, fulcrum, vector, direction) {
	if (!note) {return;}

	// get the beam point at the center of the noteHead
	let noteHead = placement.getNoteHeadCenter(note.noteHead.position),
		centerPoint = getLinePoint(noteHead.x, fulcrum, vector),
		point = getLinePoint((direction === "up" ? note.noteHead.bounds.right : note.noteHead.bounds.left), fulcrum, vector);

	return point;
}

/*
 * @param notes - Note[]
 * @param stemPoints - Point[] representing default stem points of the notes.
 * @return [fulcrum Point, vector Point]
 * Should this be made into two functions? Thinking here was the the value of one would affect the other.
 */
function calculateBeamFulcrumAndVector (notes, stemPoints, stemDirections) {
	let firstPoint = stemPoints[0],
		lastPoint = stemPoints[stemPoints.length-1],
		x = firstPoint.x + ((lastPoint.x - firstPoint.x) / 2);

	let vector = lastPoint.subtract(firstPoint).normalize();
	if (vector.angle < -Scored.config.maxBeamAngle) {
		vector = new paper.Point({angle: -Scored.config.maxBeamAngle, length: 1});
	} else if (vector.angle > Scored.config.maxBeamAngle) {
		vector = new paper.Point({angle: Scored.config.maxBeamAngle, length: 1});
	}

	// get stem points given minimum stem lengths
	let minStemLength = Scored.config.stepSpacing * 4.5;
	let minStemPoints = map(_.partialRight(defaultStemPoint, minStemLength), notes, stemDirections);
	// TODO: Handle stems going different directions
	let ys;
	if (stemDirections[0] === "up") {
		let minPoint = _.min(minStemPoints, p => p.y);
		ys = stemPoints.map(p => p.y < minPoint.y ? p.y : minPoint.y);
	} else if (stemDirections[0] === "down") {
		let minPoint = _.max(minStemPoints, p => p.y);
		ys = stemPoints.map(p => p.y > minPoint.y ? p.y : minPoint.y);
	}
	// y is the average of all points above the min beam point.
	let fulcrum = new paper.Point(x, _.sum(ys)/ys.length);

	return [fulcrum, vector];
}

/*
 * @param notes Note[]
 * @param centerLineValue - String representing center line note value
 */
function getAverageStemDirection (notes, centerLineValue) {
	let averageDirection = _.sum(notes.map(note => getSteps(centerLineValue, note.pitch))) < 0 ? "up" : "down";

	return notes.map(note => averageDirection);
}

// for use in beam function
const durationToBeams = {
	8: 1, 16: 2, 32: 3, 64: 4, 128: 5, 256: 6
};

function handleBeam (beam, point, duration, previousDuration, nextDuration, fulcrum, vector, direction, yDiff) {
	let lastBeam = _.last(beam),
		BEAM_DIFF = [0, yDiff],
		p16;

	if (direction === "up") { // should use vector from stemPoint to note rather than direction string
		p16 = point.add(BEAM_DIFF);
	} else {
		p16 = point.subtract(BEAM_DIFF);
	}

	// create left flag point
	if (previousDuration && previousDuration < duration && (!nextDuration || nextDuration < duration)) {
		let p = getLinePoint(p16.x - 10, fulcrum, vector),
			flag = direction === "up" ? p.add(BEAM_DIFF) : p.subtract(BEAM_DIFF);

		lastBeam.push(flag);
	}

	lastBeam.push(p16);

	// create right flag point
	if (nextDuration && !previousDuration && nextDuration < duration) {
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
function beam (notes, {line="b4", fulcrum, vector, kneeGap=5.5, stemDirection}) {

	let numBeams = durationToBeams[_.max(_.map(notes, note => note.note.duration.value))];
	let stemDirections = stemDirection ? _.fill(new Array(notes.length), stemDirection) : getAverageStemDirection(notes, line);

	let durations = notes.map(getDuration),
		stemLengths = map(_.partialRight(getStemLength, line), notes),
		stemPoints = notes.map((note, i) => defaultStemPoint(note, stemDirections[i], stemLengths[i]));

	// only calculate the fulcrum and vector if they aren't passed in as arguments
	if (fulcrum && !vector) {
		[, vector] = calculateBeamFulcrumAndVector(notes, stemPoints, stemDirections);
	} else if (vector && !fulcrum) {
		[fulcrum,] = calculateBeamFulcrumAndVector(notes, stemPoints, stemDirections);
	} else {
		[fulcrum, vector] = calculateBeamFulcrumAndVector(notes, stemPoints, stemDirections);
	}

	// beams is an array of arrays of segments, beams[0] are eighth segments, beams[1] sixteenths, etc.
	let beams = doTimes(numBeams, () => [[]]),
		segments = _.reduce(notes, (acc, note, i) => {
			let point = _.last(acc),
				duration = durations[i],
				direction = stemDirections[i],
				current = _.last(acc),
				previous = acc[i-1],
				previousDuration = durations[i-1],
				nextDuration = durations[i+1],
				nextNote = notes[i+1],
				next = calculateStemPoint(nextNote, fulcrum, vector, stemDirections[i+1]);

			_.last(beams[0]).push(point);

			if (duration >= 16) {
				handleBeam(beams[1], current, duration, previousDuration, nextDuration, fulcrum, vector, direction, 5);
			}

			if (duration >= 32) {
				handleBeam(beams[2], current, duration, previousDuration, nextDuration, fulcrum, vector, direction, 10);
			}

			if (duration >= 64) {
				handleBeam(beams[3], current, duration, previousDuration, nextDuration, fulcrum, vector, direction, 15);
			}

			if (duration >= 128) {
				handleBeam(beams[4], current, duration, previousDuration, nextDuration, fulcrum, vector, direction, 20);
			}

			if (duration >= 256) {
				handleBeam(beams[5], current, duration, previousDuration, nextDuration, fulcrum, vector, direction, 25);
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

			return concat(acc, next);
		}, [calculateStemPoint(notes[0], fulcrum, vector, stemDirections[0])]), // initialize the accumulator with the first point

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

const arrayToString = (arr) => _.reduce(arr, (acc, c) => acc + c, "");

/*
 * @param pitch - String representation of note pitch.
 * @return - {name, accidental, octave}
 */
function parsePitch (pitch) {
	let [nameAndAccidental, [...octave]] = partitionBy(pitch, (c) => !!_.isNaN(Number.parseInt(c)));

	let name = _.first(nameAndAccidental),
		accidental = arrayToString(nameAndAccidental.slice(1));

	return {name, accidental, octave: arrayToString(octave)};
}

export {
	beam,
	getDuration,
	getStemDirection,
	getStemLength,
	calculateStemPoint,
	defaultStemPoint,
	slur,
	getSteps,
	getAverageStemDirection,
	parsePitch
};
