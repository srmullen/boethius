import _ from "lodash";

import {isMarking, isPitched} from "../types";
import {drawStaffBar} from "../engraver";
import constants from "../constants";
import {createMeasures} from "../utils/measure";
import {getLineItems, getTimeContexts, b, positionMarkings} from "../utils/line";
import {getStaffItems, calculateTimeLengths, calculateMeasureLengths, iterateByTime, renderTimeContext} from "../utils/staff";
import {map, mapDeep} from "../utils/common";
import {getAccidentalContexts} from "../utils/accidental";
import {calculateCursor, scaleCursor} from "../utils/placement";
import {getMeasureNumber} from "../utils/timeUtils";
import Voice from "./Voice";
import {getCenterLineValue} from "./Clef";

const TYPE = constants.type.staff;

/*
 * @measures - the number of measures on the staff.
 * @startMeasure - the index of the first measure on the stave.
 */
 // TODO: What are the children of a staff now? It's more of a view onto the lines, rather than something with children in it's own right.
 // @param children <Line, Measure, Marking>[] - A marking that is given to the staff will be rendered on all lines. If it is
 // 	given to a line it will only affect that line.
function Staff ({startMeasure=0, measures=4, lineHeights=[]}, children=[]) {
	this.startMeasure = startMeasure;

	this.measures = measures;

	this.children = children;

	this.markings = _.filter(children, isMarking);

	this.lineHeights = lineHeights;
}

Staff.render = function render (staff, {lines=[], voices=[], measures, length, startMeasure=0}) {
	/////////////////////////
	// Time Contexts Phase //
	/////////////////////////
	measures = measures || createMeasures(staff.measures, staff.markings);

	const endMeasure = startMeasure + staff.measures; // only time contexts

	const lineItems = getStaffItems(lines, voices); // only time contexts

	const lineTimes = map((line, items) => getTimeContexts(line, measures, items), lines, lineItems); // only time contexts

	// get the times that are to be rendered on the staff.
	const lineTimesToRender = _.map(lineTimes, (line) => { // used in render phase
		return _.filter(line, (time) => {
			return time.time.measure >= startMeasure && time.time.measure < endMeasure;
		});
	});

	// calculate the accidentals for each line.
	_.each(lineTimesToRender, (times) => {
		const accidentals = getAccidentalContexts(times);
		// add accidentals to times
		_.each(times, (time, i) => time.context.accidentals = accidentals[i]);
	});

	const measuresToRender = _.slice(measures, startMeasure, endMeasure); // used in render and placement phases

	// Group in order the times on each line
	const staffTimes = iterateByTime(x => x, lineTimesToRender); // used in renderand placement phases

	//////////////////
	// Render Phase //
	//////////////////
	return Staff.renderTimeContexts(staff, lines, measuresToRender, voices, staffTimes, length);
};

/*
 * @param staff - Staff
 * @param timeContexts - array of time contexts
 */
Staff.renderTimeContexts = function (staff, lines, measures, voices, timeContexts, length) {
	const staffGroup = staff.render();

	// returns an array of arrays. The index of each inner array maps the rendered items to the line they need to be added to.
	const lineChildren = _.map(timeContexts, (timeContext) => {
		return _.map(timeContext, (lineTimeContext, i) => {
			if (lineTimeContext) return lines[i].renderTime(lineTimeContext);
		});
	});

	const shortestDuration = 0.125; // need function to calculate this.

	const timeLengths = calculateTimeLengths(timeContexts, shortestDuration);

	const measureLengths = calculateMeasureLengths(timeLengths);

	// get the minimum length of the line
	const minLineLength = _.sum(measureLengths);

	let lineGroups, noteScale, cursorFn;

	if (!length) {
		lineGroups = staff.renderLines(lines, minLineLength);

		const measureGroups = staff.renderMeasures(measures, measureLengths, lineGroups);

		staffGroup.addChildren(measureGroups);

		cursorFn = (possibleNextPositions) => {
			return _.min(possibleNextPositions);
		};

	} else {
		lineGroups = staff.renderLines(lines, length);

		const totalMarkingLength = _.sum(timeLengths, ({length}) => length[0]);

		const measureScale = length / minLineLength;

		noteScale = (length - totalMarkingLength) / (minLineLength - totalMarkingLength);

		const measureGroups = staff.renderMeasures(measures, _.map(measureLengths, measureLength => measureLength * measureScale), lineGroups);

		staffGroup.addChildren(measureGroups);

		cursorFn = (possibleNextPositions, cursor) => {
			return scaleCursor(noteScale, cursor, _.min(possibleNextPositions));
		};
	}

	// add the children to each line.
	_.each(lineChildren, (staffItems) => {
		_.each(staffItems, (lineItems, i) => {
			if (lineItems) lineGroups[i].addChildren(lineItems);
		});
	});

	staffGroup.addChildren(lineGroups);

	staffGroup.addChild(drawStaffBar(lineGroups));

	/////////////////////
	// Placement Phase //
	/////////////////////
	const lineCenters = _.map(lineGroups, b);
	placeTimes(timeContexts, measures, lineCenters, cursorFn);

	map((line, lineGroup, lineCenter) => {
		const startTime = _.find(_.first(timeContexts), ctx => !!ctx).time;
		const endTime = _.find(_.last(timeContexts), ctx => !!ctx).time;
		const lineItems = getLineItems(line, voices, startTime.time, endTime.time);

		_.each(lineItems, (lineVoice, i) => {
			const itemsByMeasure = _.groupBy(lineVoice, child => getMeasureNumber(measures, child.time));
			_.each(measures, (measure) => {
				const items = itemsByMeasure[measure.value] || [];

				// Nothing to do if there are no items in the measure.
				if (!items) return;

				// stems and beams need to know both line and voice
				const context = line.contextAt({measure: measure.value});
				const centerLineValue = getCenterLineValue(context.clef);
				const beamings = Voice.findBeaming(context.timeSig, items);
				const stemDirection = getStemDirection(lineItems, i);
				const stemDirections = stemDirection ?
					_.fill(new Array(items.length), stemDirection) :
					Voice.getAllStemDirections(beamings, centerLineValue);
				const beams = _.compact(mapDeep(_.partial(Voice.stemAndBeam, centerLineValue), beamings, stemDirections));
				lineGroup.addChildren(beams);

				// tuplet groups need to know voice and line
				const tupletGroups = Voice.renderTuplets(items, lineCenter);
				lineGroup.addChildren(tupletGroups);
			});
		});

		// render decorations that only require knowledge of the line.
		_.each(lineItems, voiceItems => {
			renderLedgerLines(voiceItems, lineCenter);
			Voice.renderArticulations(voiceItems); // items must have stem direction already
		});

	}, lines, lineGroups, lineCenters);

	_.each(voices, voice => {
		// slurs only need to know voice
		const slurGroups = voice.renderSlurs();
		staffGroup.addChildren(slurGroups);
	});

	return staffGroup;
};

/*
 * @param Items[][] - Array of voices on the line
 * @param voiceIndex - the index of the voice to get the stemDirection for.
 * @return - String if the voice has a required stemDirection, else undefined.
 */
function getStemDirection (lineItems, voiceIndex) {
	if (lineItems.length === 2) return (voiceIndex === 0) ? "up" : "down";
}

function renderLedgerLines (items, centerLine) {
	const pitched = _.filter(items, isPitched);
    pitched.map(note => note.drawLegerLines(centerLine, Scored.config.lineSpacing));
}

function placeTimes (staffTimes, measures, lineCenters, cursorFn) {
	_.reduce(staffTimes, (cursor, ctxs, i) => {
		const lineIndices = _.filter(_.map(ctxs, (ctx, i) => ctx ? i : undefined), _.isNumber);
		const centers = _.map(lineIndices, idx => lineCenters[idx]);
		const previousTime = staffTimes[i-1] ? _.find(staffTimes[i-1], x => x).time : 0;
		const currentTime = ctxs[lineIndices[0]].time;
		// update cursor if it's a new measure
		if (currentTime.measure !== previousTime.measure) {
			const measure = _.find(measures, measure => measure.value === currentTime.measure);
			cursor = calculateCursor(measure);
		}

		// place all the markings in the time context.
		cursor = _.max(_.map(lineIndices, (idx, i) => positionMarkings(centers[i], cursor, ctxs[idx])));

		// place the items that have duration
		const possibleNextPositions = _.map(lineIndices, (idx, i) => renderTimeContext(centers[i], cursor, ctxs[idx]));

		return cursorFn(possibleNextPositions, cursor);
	}, Scored.config.note.head.width);
}

Staff.prototype.type = TYPE;

Staff.prototype.render = function () {
	const group = new paper.Group({
		name: TYPE
	});

	return group;
};

Staff.prototype.renderLines = function (lines, length) {
	// draw each line
	let lineHeight = this.lineHeights[0] || 0;
	const defaultHeight = 120;
	const lineGroups = lines.map((line, i) => {
		const group = line.render(length);
		group.translate([0, lineHeight]);
		lineHeight = (this.lineHeights[i+1] || defaultHeight) + lineHeight;
		return group;
	});

	return lineGroups;
};

Staff.prototype.renderMeasures = function (measures, lengths, staffGroup) {
	let measureGroups = _.reduce(measures, (groups, measure, i) => {
		let measureLength = lengths[i],
			previousGroup = _.last(groups),
			leftBarline;

		leftBarline = previousGroup ? previousGroup.children.barline : null;
		let measureGroup = measure.render(staffGroup, leftBarline, measureLength);

		groups.push(measureGroup);
		return groups;
	}, []);

	return measureGroups;
};

export default Staff;
