import constants from "../constants";
import engraver from "../engraver";
import Measure from "../views/Measure";
import * as timeUtils from "../utils/timeUtils";
import * as placement from "../utils/placement";
import * as common from "../utils/common";
import noteUtils from "../utils/note";
import line from "../utils/line";
import Note from "../views/Note";
import Rest from "../views/Rest";
import measureUtils from "../utils/measure";
import _ from "lodash";

const TYPE = constants.type.line;

function parseChildren (children, numMeasures) {
	let measures = new Array(numMeasures);

	// get the Measures from children and add them to the measures array
	let [explicitMeasures, markings] = _.partition(_.filter(children, c => !!c), (child) => child.type === constants.type.measure),
		// measureMarkings = _.groupBy(markings, marking => marking.context.measure || 0);
		measureMarkings = _.groupBy(markings, marking => marking.measure || 0);

	{ // Put each measure in the right position in the measures array.
	  // If a measure does not have an index property put it in the next available location.
		let cur = 0;
		_.each(explicitMeasures, (measure) => {
			if (_.isNumber(measure.index)) {
				measures[measure.index] = measure;
				cur = measure.index + 1;
			} else {
				measures[cur] = measure;
				cur++;
			}
		});
	}

	_.each(measures, (measure, i) => {
		var previousMeasure = measures[i-1],
			startsAt = previousMeasure ? previousMeasure.startsAt + timeUtils.getMeasureDuration(previousMeasure) : 0;

		if (!measure) {
			measure = new Measure(_.extend({}, {startsAt: startsAt}), measureMarkings[i]);
		} else {
			measure.startsAt = startsAt;
		}

		measures[i] = measure;
	});

	return measures;
}

function Line ({measures=0, voices=1, staves=1, lineLength=1000, measureLength=200}, children=[]) {

	this.children = parseChildren(children, measures);

	this.staves = staves;

	this.lineLength = lineLength;

	this.measureLength = measureLength;

	this.voices = voices;

}

Line.prototype.type = TYPE;

// Line.prototype.processEvents = function (events) {
// 	// let voices = _.groupBy(events, e => e.voice);
// 	_.each(events)
// }

Line.prototype.render = function (position) {
	const group = this.group = new paper.Group({
		name: TYPE
	});

	// Was this.staves. Now this.staves is the number of staves. staves is an arry of staves.
	let staves = this.drawStaves(this.staves);

	group.addChildren(staves);

	group.strokeColor = "black";

	let stave = 0,
		remainingLength = this.lineLength;

	let measureGroups = _.reduce(this.children, (groups, measure, i, children) => {
		var // markingLength = measureUtils.getMarkingLength(measure),
			measureLength = measure.measureLength || this.measureLength || constants.measure.defaultLength, // + markingLength,
			previousGroup = _.last(groups),
			newStave = false,
			leftBarline;

		if (remainingLength <= 0) {
			stave++;
			newStave = true;
			remainingLength = this.lineLength;
			if (stave >= this.staves){
				// throw new Error("Not enough staves"); // could just add staves rather than throwing an error
				console.log("Not enough staves");
			}
		}
		if (staves[stave]) {
			leftBarline = (previousGroup && !newStave) ? previousGroup.children.barline : null; //{position: line.b(staves[stave])};
			remainingLength = remainingLength - measureLength;
			let group = measure.render(staves, leftBarline, measureLength, stave);
			Measure.addGroupEvents(group);
			groups.push(group);
			staves[stave].addChild(group);
		}
		return groups;
	}, []);

	return group;
};

Line.prototype.drawStaves = function (numStaves=1) {
	var staves = [],
		i = 0;
	for (; i < numStaves; i++) {
		staves.push(engraver.drawLine(this.lineLength));
	}
	return staves;
};

Line.prototype.note = function (note) {
	let measure = _.find(this.children, measure => note.time >= measure.startsAt);
	if (measure) {
		measure.note(note);
	}
}

Line.prototype.rest = function (rest) {
	let measure = _.find(this.children, measure => note.time >= measure.startsAt);
	if (measure) {
		measure.rest(rest);
	}
}

// Line.prototype.note = function (context, xPos) {
// 	var noteView = new Note(context),
// 		measure = this.at().measure,
// 		yPos = placement.calculateNoteYpos(noteView, Scored.config.lineSpacing/2, placement.getClefBase(this.context.clef)),
// 		position = this.measures[measure].barlines[0].position.add(xPos, yPos);
//
// 	this.addToMeasure(measure, noteView);
// 	noteView.render(position);
//
// 	if (noteView.note.duration.value > 1) {
// 		let stemPoint = noteUtils.defaultStemPoint(noteView, noteUtils.getStemLength(noteView), "up");
// 		noteView.drawStem(stemPoint, "up");
// 	}
//
// 	this.incrementTime(noteView.context.duration, this.context.timeSig);
//
// 	this.group.addChild(noteView.group);
//
// 	return noteView;
// };
//
// Line.prototype.rest = function (context, cursor) {
// 	var rest = new Rest(context),
// 		measure = this.at().measure;
//
// 	this.addToMeasure(measure, rest);
// 	var position = this.measures[measure].barlines[0].position.add(cursor, 0);
// 	rest.render(position);
//
// 	this.incrementTime(rest.context.duration, this.context.timeSig);
//
// 	this.group.addChild(rest.group);
//
// 	return rest;
// };

/*
 * returns the clef, time signature and accidentals at the given time.
 */
Line.prototype.contextAt = function (time) {
	// get the measure that contains the time
	var measure = _.find(this.measures, (measure) => measure.context.startsAt + timeUtils.getMeasureDuration(measure) > time),
		measureIndex = _.indexOf(this.measures, measure),
		// get the timeSig of the measure. All measures must have a timeSig that doesn't change throughout its duration.
		timeSig = measure.context.timeSig,
		beat = timeUtils.getBeat(time - measure.context.startsAt, timeUtils.sigToNums(timeSig)),
		// doesn't take into account beats, assumes children in sorted by time.
		possibleItems = _.filter(this.children, (item) => item.context.measure <= measureIndex),
		clef = _.max(_.filter(possibleItems, (item) => item.type === "clef"), (item) => item.context.measure),
		key = _.max(_.filter(possibleItems, (item) => item.type === "key"), (item) => item.context.measure);

	return {timeSig, clef: clef.value, key: key.value};
};

Line.prototype.setLength = function (length) {
	var lineNames = ["F", "D", "B", "G", "E"],
		p1, p2;
	_.each(this.staves, (staff) => {
		var lines = _.filter(staff.children, child => _.contains(lineNames, child.name));
		for (var i = 0; i < lines.length; i++) {
			p1 = lines[i].segments[0].point;
			p2 = lines[i].segments[1].point;
			p2.x = p1.x + length;
		}
	});

	paper.view.update();
};

/*
 * @param index {number} - the measure to be adjusted
 * @param length {number} - the new length of the measure
 */
Line.prototype.setMeasureLength = function (index, length) {
	var measure = this.children[index],
		oldLength = measure.getLength(),
		lengthDiff = length - oldLength;

	if (lengthDiff) { // no need to do anything if there's no differnece in the length
		measure.setLength(length);
		for (var i = index + 1; i < this.children.length; i++) {
			this.children[i].translate([lengthDiff, 0]);
		}
	}
};

Line.prototype.setPosition = function (position) {
	this.group.setPosition(position);
	return this;
};

Line.prototype.translate = function (vector) {
	this.group.translate(vector);
	return this;
};

Line.prototype.addToMeasure = function (measure, item) {
	if (this.measures[measure]) { // measure already exists
		this.measures[measure][item.type](item);
	} else {
		throw new Error("Measure " + measure + " doesn't exist.");
	}
};

export default Line;
