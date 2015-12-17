import _ from "lodash";

import * as paperUtils from "../utils/paperUtils";
import * as timeUtils from "../utils/timeUtils";
import {isLine, isMarking} from "../types";
import engraver from "../engraver";
import constants from "../constants";
import Measure from "./Measure";
import {getTimeContexts, b} from "../utils/line";
import {groupVoices, getLineItems, calculateMeasureLengths, nextTimes, iterateByTime, renderTimeContext, positionMarkings} from "../utils/staff";
import {map} from "../utils/common";
import {getAccidentalContexts} from "../utils/accidental";
import {calculateCursor} from "../utils/placement";

const TYPE = constants.type.staff;

/*
 * @measures - the number of measures on the staff.
 * @startMeasure - the index of the first measure on the stave.
 */
 // TODO: What are the children of a staff now? It's more of a view onto the lines, rather than something with children in it's own right.
 // TODO: Should Staff implement lilypond types such as StaffGroup, ChoirStaff, GrandStaff, and PianoStaff?
 // @param children <Line, Measure, Marking>[] - A marking that is given to the staff will be rendered on all lines. If it is
 // 	given to a line it will only affect that line.
function Staff ({startMeasure=0, measures}, children=[]) {
	this.startMeasure = startMeasure;

	this.measures = measures;

	this.children = children;

	this.lines = _.filter(children, isLine);

	this.markings = _.filter(children, isMarking);

	// add the markings to each line.
	// _.each(this.lines, line => line.addMarkings(this.markings));
}

Staff.render = function render (staff, voices) {
	const staffGroup = staff.render();

	const lineGroups = staff.renderLines();

	staffGroup.addChildren(lineGroups);

	staffGroup.addChild(engraver.drawStaffBar(lineGroups));

	const measures = Measure.createMeasures(5, staff.markings);

	// get the time contexts
	const lineItems = getLineItems(staff.lines, voices);

	const lineTimes = map((line, items) => getTimeContexts(line, measures, items), staff.lines, lineItems);

	// calculate the accidentals for each line.
	_.each(lineTimes, (times, i) => {
		let accidentals = getAccidentalContexts(times);
		// add accidentals to times
		_.each(times, (time, i) => time.context.accidentals = accidentals[i]);

		staff.lines[i].renderItems(times);
	});

	const noteHeadWidth = Scored.config.note.head.width;
	const shortestDuration = 0.125; // need function to calculate this.

	// const measureLengths = _.map(lineTimes, lineTimeCtx => calculateMeasureLengths(measures, lineTimeCtx, noteHeadWidth, shortestDuration));
	const measureLengths = calculateMeasureLengths(measures, lineTimes, noteHeadWidth, shortestDuration)
	console.log(measureLengths);
	const measureGroups = staff.renderMeasures(measures, measureLengths, lineGroups);

	staffGroup.addChildren(measureGroups);

	// place all items
	const staffTimes = iterateByTime(x => x, lineTimes);
	_.reduce(staffTimes, (cursor, ctxs, i) => {
		const lineIndices = _.filter(_.map(ctxs, (ctx, i) => ctx ? i : undefined), _.isNumber);
		const lineCenters = _.map(lineIndices, idx => b(lineGroups[idx]));
		const previousTime = staffTimes[i-1] ? _.find(staffTimes[i-1], x => x).time : 0;
		const currentTime = ctxs[lineIndices[0]].time;
		// update cursor if it's a new measure
		if (currentTime.measure !== previousTime.measure) {
			let measure = measures[currentTime.measure];
			cursor = calculateCursor(measure);
		}

		// place all the markings in the time context.
		cursor = _.max(_.map(lineIndices, (idx, i) => positionMarkings(lineCenters[i], cursor, ctxs[idx])));

		// place the items that have duration
		let possibleNextPositions = _.map(lineIndices, (idx, i) => renderTimeContext(lineCenters[i], cursor, ctxs[idx]));

		return _.min(possibleNextPositions);
	}, noteHeadWidth);

	map((line, voice) => {
		return voice.renderDecorations(line, measures);
	}, staff.lines, voices);

	return staffGroup;
}

Staff.prototype.type = TYPE;

Staff.prototype.render = function (lines, startMeasure=0, numMeasures) {
	const group = this.group = new paper.Group({
		name: TYPE
	});

	return group;
};

Staff.prototype.renderLines = function () {
	// draw each line
	let lineGroups = this.lines.map(line => line.render(1000));

	_.each(lineGroups, (lineGroup, j) => {
		lineGroup.translate([0, 120 * j]);
	});

	return lineGroups;
}

Staff.prototype.renderMeasures = function (measures, lengths, staffGroup) {
	let measureGroups = _.reduce(measures, (groups, measure, i, children) => {
		let measureLength = lengths[i],
			previousGroup = _.last(groups),
			leftBarline;

		leftBarline = previousGroup ? previousGroup.children.barline : null;
		let measureGroup = measure.render(staffGroup, leftBarline, measureLength);

		groups.push(measureGroup);
		return groups;
	}, []);

	return measureGroups;
}

export default Staff;
