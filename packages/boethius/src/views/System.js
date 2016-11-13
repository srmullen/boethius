import _ from "lodash";

import {isMarking, isPitched, isNote} from "../types";
import {drawSystemBar} from "../engraver";
import constants from "../constants";
import {createMeasures} from "../utils/measure";
import {getLineItems, getTimeContexts, b, positionMarkings} from "../utils/line";
import {getStaffItems, calculateTimeLengths, calculateMeasureLengths, addDefaultMeasureLengths, iterateByTime} from "../utils/system";
import {map, mapDeep} from "../utils/common";
import {getAccidentalContexts} from "../utils/accidental";
import * as placement from "../utils/placement";
import {getMeasureNumber} from "../utils/timeUtils";
import Voice from "./Voice";
import {getCenterLineValue} from "./Clef";

const TYPE = constants.type.system;

/*
 * @measures - the number of measures on the system.
 * @startMeasure - the index of the first measure on the stave.
 */
 // TODO: What are the children of a system now? It's more of a view onto the lines, rather than something with children in it's own right.
 // @param children <Line, Measure, Marking>[] - A marking that is given to the system will be rendered on all lines. If it is
 // 	given to a line it will only affect that line.
function System ({page=0, startMeasure=0, measures=4, lineHeights=[]}, children=[]) {
	this.page = page;

	this.startMeasure = startMeasure;

	this.measures = measures;

	this.children = children;

	this.markings = _.filter(children, isMarking);

	this.lineHeights = lineHeights;
}

/*
 * @param system - System
 * @param timeContexts - array of time contexts
 */
System.renderTimeContexts = function (system, lines, measures, voices, timeContexts, length) {
	// create the system group that all items will be added to.
	const systemGroup = system.render();

	// returns an array of arrays. The index of each inner array maps the rendered items to the line they need to be added to.
	const lineChildren = _.map(timeContexts, (timeContext) => {
		return _.map(timeContext, (lineTimeContext, i) => {
			if (lineTimeContext) return lines[i].renderTime(lineTimeContext);
		});
	});

	const shortestDuration = 0.125; // need function to calculate this.

	const timeLengths = calculateTimeLengths(timeContexts, shortestDuration);

	const measureLengths = addDefaultMeasureLengths(system.measures, calculateMeasureLengths(timeLengths));

	// get the minimum length of the line
	const minLineLength = _.sum(measureLengths);

	let lineGroups, noteScale, cursorFn;

	if (!length) {
		lineGroups = system.renderLines(lines, minLineLength);

		const measureGroups = system.renderMeasures(measures, measureLengths, lineGroups);

		systemGroup.addChildren(measureGroups);

		cursorFn = (possibleNextPositions) => {
			return _.min(possibleNextPositions);
		};

	} else {
		lineGroups = system.renderLines(lines, length);

		const totalMarkingLength = _.sum(timeLengths, ({length}) => length[0]);

		const measureScale = length / minLineLength;

		noteScale = (length - totalMarkingLength) / (minLineLength - totalMarkingLength);

		const measureGroups = system.renderMeasures(measures, _.map(measureLengths, measureLength => measureLength * measureScale), lineGroups);

		systemGroup.addChildren(measureGroups);

		cursorFn = (possibleNextPositions, cursor) => {
			return placement.scaleCursor(noteScale, cursor, _.min(possibleNextPositions));
		};
	}

	// add the children to each line.
	_.each(lineChildren, (systemItems) => {
		_.each(systemItems, (lineItems, i) => {
			if (lineItems) lineGroups[i].addChildren(lineItems);
		});
	});

	systemGroup.addChildren(lineGroups);

	systemGroup.addChild(drawSystemBar(lineGroups));

	/////////////////////
	// Placement Phase //
	/////////////////////
	const lineCenters = _.map(lineGroups, b);
	const cursors = placeTimes(timeContexts, measures, lineCenters, cursorFn);

	if (timeContexts) {
		const startTime = _.find(_.first(timeContexts), ctx => !!ctx).time;
		const endTime = _.find(_.last(timeContexts), ctx => !!ctx).time;
		map((line, lineGroup, lineCenter) => {
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
	}

	return systemGroup;
};

function placeTimes (systemTimes, measures, lineCenters, cursorFn) {
	return _.reduce(systemTimes, (cursors, ctxs, i) => {
		const lineIndices = _.filter(_.map(ctxs, (ctx, i) => ctx ? i : undefined), _.isNumber);
		const centers = _.map(lineIndices, idx => lineCenters[idx]);
		const previousTime = systemTimes[i-1] ? _.find(systemTimes[i-1], x => x).time : 0;
		const currentTime = ctxs[lineIndices[0]].time;
		let cursor = _.last(cursors);
		// update cursor if it's a new measure
		if (currentTime.measure !== previousTime.measure) {
			const measure = _.find(measures, measure => measure.value === currentTime.measure);
			cursor = placement.calculateCursor(measure);
		}

		// place all the markings in the time context.
		cursor = _.max(_.map(lineIndices, (idx, i) => positionMarkings(centers[i], cursor, ctxs[idx])));

		// place the items that have duration
		const possibleNextPositions = _.map(lineIndices, (idx, i) => renderTimeContext(centers[i], cursor, ctxs[idx]));

		return cursors.concat(cursorFn(possibleNextPositions, cursor));
	}, [Scored.config.note.head.width]);
}


function renderTimeContext (lineCenter, cursor, {items, context}) {
    const {
		note: notes,
		rest: rests,
		chord: chords,
        dynamic: dynamics
	} = _.groupBy(items, item => item.type);

	let possibleNextPositions = [];

	const pitchedItems = _.compact([].concat(notes, chords));

	if (pitchedItems.length) {
		// get widest note. that will be placed first.
		let widestItem = _.max(pitchedItems, item => item.group.bounds.width),
			placeY = (item) => {
				let note = isNote(item) ? item : item.children[0];
				let yPos = placement.calculateNoteYpos(note, Scored.config.lineSpacing/2, placement.getClefBase(context.clef.value));
				item.group.translate(lineCenter.add([0, yPos]));
			},
			placeX = (item) => {
				placement.placeAt(cursor, item);
			},
			place = (item) => {
				placeY(item);
				placeX(item);
				return placement.calculateCursor(item);
			};


		possibleNextPositions = possibleNextPositions.concat(place(widestItem));

		_.remove(pitchedItems, item => item === widestItem); // mutation of notes array

		_.each(pitchedItems, placeY);

		const alignToNoteHead = isNote(widestItem) ? widestItem.noteHead : widestItem.children[0].noteHead;
		placement.alignNoteHeads(alignToNoteHead.bounds.center.x, pitchedItems);

		possibleNextPositions = possibleNextPositions.concat(_.map(pitchedItems, placement.calculateCursor));
	}

	possibleNextPositions = possibleNextPositions.concat(_.map(rests, rest => {
		let pos = placement.getYOffset(rest);

		rest.group.translate(lineCenter.add(0, pos));
		placement.placeAt(cursor, rest);

		return placement.calculateCursor(rest);
	}));

    // place dynamics.
	// Stems and slurs are not rendered at this point so it's hard to get the best position for the dynamic.
	_.map(dynamics, (dynamic) => {
		// const lowestPoint = _.max(_.map(pitchedItems, item => item.group.bounds.bottom));
		dynamic.group.translate(lineCenter.add(0, Scored.config.layout.lineSpacing * 5.5));
		placement.placeAt(cursor, dynamic);
	});

	// next time is at smallest distance
	cursor = _.min(possibleNextPositions);

	return cursor;
}

/*
 * mutates systemGroup
 */
function renderDecorations (systemGroup, voices) {
	const decorationGroups = renderSlurs(voices);
	decorationGroups.map(group => systemGroup.addChildren(group));
	return systemGroup;
}

function renderSlurs (voices) {
	return _.map(voices, voice => {
		// slurs only need to know voice
		return voice.renderSlurs();
	});
}

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

System.prototype.type = TYPE;

System.prototype.render = function () {
	const group = new paper.Group({
		name: TYPE
	});

	return group;
};

System.prototype.renderLines = function (lines, length) {
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

System.prototype.renderMeasures = function (measures, lengths, systemGroup) {
	let measureGroups = _.reduce(measures, (groups, measure, i) => {
		let measureLength = lengths[i],
			previousGroup = _.last(groups),
			leftBarline;

		leftBarline = previousGroup ? _.last(previousGroup.children) : null;
		let measureGroup = measure.render(systemGroup, leftBarline, measureLength);

		groups.push(measureGroup);
		return groups;
	}, []);

	return measureGroups;
};

export default System;
