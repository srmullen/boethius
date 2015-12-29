import _ from "lodash";

import * as paperUtils from "../utils/paperUtils";
import * as timeUtils from "../utils/timeUtils";
import {isLine, isMarking} from "../types";
import {drawStaffBar} from "../engraver";
import constants from "../constants";
import {createMeasures} from "../utils/measure";
import {getTimeContexts, b, positionMarkings} from "../utils/line";
import {groupVoices, getLineItems, calculateMeasureLengths, nextTimes, iterateByTime, renderTimeContext} from "../utils/staff";
import {map} from "../utils/common";
import {getAccidentalContexts} from "../utils/accidental";
import {calculateCursor, calculateTimeLength, scaleCursor} from "../utils/placement";

const TYPE = constants.type.staff;

/*
 * @measures - the number of measures on the staff.
 * @startMeasure - the index of the first measure on the stave.
 */
 // TODO: What are the children of a staff now? It's more of a view onto the lines, rather than something with children in it's own right.
 // @param children <Line, Measure, Marking>[] - A marking that is given to the staff will be rendered on all lines. If it is
 // 	given to a line it will only affect that line.
function Staff ({startMeasure=0, measures=4}, children=[]) {
	this.startMeasure = startMeasure;

	this.measures = measures;

	this.children = children;

	this.markings = _.filter(children, isMarking);
}

// TODO: render the length as sum of min measure lengths if not passed in.
Staff.render = function render (staff, {lines=[], voices=[], measures, length, startMeasure=0, numMeasures}) {
	const staffGroup = staff.render();

	const endMeasure = startMeasure + numMeasures;

	measures = measures || createMeasures(numMeasures, staff.markings);

	// get the time contexts
	const lineItems = getLineItems(lines, voices);

	const lineTimes = map((line, items) => getTimeContexts(line, measures, items), lines, lineItems);

	// get the times that are to be rendered on the staff.
	const lineTimesToRender = _.map(lineTimes, (line) => {
		return _.filter(line, (time) => {
			return time.time.measure >= startMeasure && time.time.measure < endMeasure
		});
	});

	const measuresToRender = _.slice(measures, startMeasure, endMeasure);

	// calculate the accidentals for each line.
	const lineChildren = _.map(lineTimesToRender, (times, i) => {
		let accidentals = getAccidentalContexts(times);
		// add accidentals to times
		_.each(times, (time, i) => time.context.accidentals = accidentals[i]);

		return lines[i].renderItems(times);
	});

	// Group in order the times on each line
	const staffTimes = iterateByTime(x => x, lineTimesToRender);

	const noteHeadWidth = Scored.config.note.head.width;
	const shortestDuration = 0.125; // need function to calculate this.

	// calculate the minimum measure lengths
	const measureLengths = calculateMeasureLengths(measuresToRender, lineTimesToRender, noteHeadWidth, shortestDuration);

	// get the minimum length of the line
	const minLineLength = _.sum(measureLengths);

	let lineGroups, noteScale, cursorFn;

	if (!length) {
		lineGroups = staff.renderLines(lines, minLineLength);

		const measureGroups = staff.renderMeasures(measuresToRender, measureLengths, lineGroups);

		staffGroup.addChildren(measureGroups);

		cursorFn = (possibleNextPositions) => {
			return _.min(possibleNextPositions);
		}

	} else {
		lineGroups = staff.renderLines(lines, length);

		// calculate the length of every time
		const timeLengths = _.map(staffTimes, (lines) => {
			// get all items at the time
			const allItems = lines.reduce((acc, line) => line ? acc.concat(line.items) : acc, []);
			return calculateTimeLength(allItems, shortestDuration);
		});

		const totalMarkingLength = _.sum(timeLengths, ([markingLength,]) => markingLength);

		const measureScale = length / minLineLength;

		noteScale = (length - totalMarkingLength) / (minLineLength - totalMarkingLength);

		const measureGroups = staff.renderMeasures(measuresToRender, _.map(measureLengths, measureLength => measureLength * measureScale), lineGroups);

		staffGroup.addChildren(measureGroups);

		cursorFn = (possibleNextPositions, cursor) => {
			return scaleCursor(noteScale, cursor, _.min(possibleNextPositions));
		}
	}

	// add the children to each line.
	_.each(lineChildren, (children, i) => lineGroups[i].addChildren(children));

	staffGroup.addChildren(lineGroups);

	staffGroup.addChild(drawStaffBar(lineGroups));

	// place all items
	const lineCenters = _.map(lineGroups, b);
	placeTimes(staffTimes, measures, lineCenters, cursorFn);

	map((line, lineGroup, lineCenter, voice) => {
		const children = voice.renderDecorations(line, lineCenter, measuresToRender);
		lineGroup.addChildren(children);
		return children;
	}, lines, lineGroups, lineCenters, voices);

	return staffGroup;
}

function placeTimes (staffTimes, measures, lineCenters, cursorFn) {
	_.reduce(staffTimes, (cursor, ctxs, i) => {
		const lineIndices = _.filter(_.map(ctxs, (ctx, i) => ctx ? i : undefined), _.isNumber);
		const centers = _.map(lineIndices, idx => lineCenters[idx]);
		const previousTime = staffTimes[i-1] ? _.find(staffTimes[i-1], x => x).time : 0;
		const currentTime = ctxs[lineIndices[0]].time;
		// update cursor if it's a new measure
		if (currentTime.measure !== previousTime.measure) {
			let measure = measures[currentTime.measure];
			cursor = calculateCursor(measure);
		}

		// place all the markings in the time context.
		cursor = _.max(_.map(lineIndices, (idx, i) => positionMarkings(centers[i], cursor, ctxs[idx])));

		// place the items that have duration
		let possibleNextPositions = _.map(lineIndices, (idx, i) => renderTimeContext(centers[i], cursor, ctxs[idx]));

		return cursorFn(possibleNextPositions, cursor);
	}, Scored.config.note.head.width);
}

Staff.prototype.type = TYPE;

Staff.prototype.render = function (lines, startMeasure=0, numMeasures) {
	const group = new paper.Group({
		name: TYPE
	});

	return group;
};

Staff.prototype.renderLines = function (lines, length) {
	// draw each line
	let lineGroups = lines.map(line => line.render(length));

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
