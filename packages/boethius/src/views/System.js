import paper from "paper";
import _ from "lodash";

import {isMarking, isPitched, isNote, isClef, isKey, isTimeSignature} from "../types";
import {drawSystemBar} from "../engraver";
import constants from "../constants";
import {getLineItems, b, positionMarkings} from "../utils/line";
import {getStaffItems, calculateMeasureLengths, addDefaultMeasureLengths} from "../utils/system";
import {map, mapDeep, clone} from "../utils/common";
import * as placement from "../utils/placement";
import {getMeasureNumber, getTime} from "../utils/timeUtils";
import Voice from "./Voice";
import {getCenterLineValue} from "./Clef";
import Line from "./Line";
import Beaming from './Beaming';
import Tuplet from './Tuplet';
import TimeContext from './TimeContext';

const TYPE = constants.type.system;

const SYSTEM_DEFAULTS = {
	page: 0,
	measures: 4,
	lineHeights: [],
	indentation: 0
};

/*
 * @measures - the number of measures on the system.
 * @startMeasure - the index of the first measure on the stave.
 * @page - The page the system is rendered on.
 */
 // TODO: What are the children of a system now? It's more of a view onto the lines, rather than something with children in it's own right.
 // @param children <Line, Measure, Marking>[] - A marking that is given to the system will be rendered on all lines. If it is
 // 	given to a line it will only affect that line.
function System (props = {}, children = []) {
	this.props = Object.assign({}, SYSTEM_DEFAULTS, props);
	this.children = children;
	// this.markings = _.filter(children, isMarking);
}

System.render = function ({system, lines, measures, length}) {
	const group = system.render();

	const lineHeights = system.getLineHeights(lines);

	const systemStartTime = getTime(measures, {time: measures[0].startsAt});

	system.signatures = System.createSystemSignatures({measures, lines});
	const systemSignatureGroups = system.signatures.map(({clef, key, timeSig}, i) => {
		const context = lines[i].contextAt(systemStartTime);
		clef.time = systemStartTime;
		key.time = systemStartTime;
		timeSig.time = systemStartTime;
		return {
			clef: clef.render(context),
			key: key.render(context),
			timeSig: timeSig.render(context)
		};
	});

	let lineGroups;

	if (!length) {
		throw new Error('No length provided.');
	} else {
		system.lineGroups = system.renderLines(lines, length);
	}

	systemSignatureGroups.forEach(({clef, key, timeSig}, i) => {
		group.addChildren([clef, key, timeSig]);
	});

	group.addChildren(system.lineGroups);

	group.addChild(drawSystemBar(system.lineGroups));

	system.startCursors = placeSystemSignatures(system.signatures, lineHeights);

	return group;
}

System.renderTimeContexts = function ({system, lines, measures, voices, timeContexts, length}) {

	const lineHeights = system.getLineHeights(lines);

	// Create the timeContexts groups so their widths can be determined.
	const timeContextGroups = _.map(timeContexts, (timeContext, i) => {
		return timeContext.render({
			system,
			lineHeights,
			disableMarkingRendering: i === 0
		});
	});

	const shortestDuration = Scored.config.shortestDuration; // need function to calculate this.

	// signatureLengths is the amount of horizontal space the system signature take up on a line.
	const [signatureLength] = calculateSystemSignaturesLength(system.signatures);

	const timeLengths = calculateTimeLengths(timeContexts, shortestDuration);

	// Add signatureLength to the first measure.
	const measureLengths = addDefaultMeasureLengths(system.props.measures, calculateMeasureLengths(timeLengths));

	// get the minimum length of the line
	const minLineLength = _.sum(measureLengths) + signatureLength;

	const totalMarkingLength = _.sumBy(timeLengths, ({length}) => length[0]) + signatureLength;

	const measureScale = (length - signatureLength) / (minLineLength - signatureLength);
	// console.log(measureScale);

	// noteScale = (length - totalMarkingLength) / (minLineLength - totalMarkingLength);

	const scaledMeasureLengths = _.map(measureLengths, measureLength => measureLength * measureScale);

	const measureGroups = system.renderMeasures(
		measures,
		scaledMeasureLengths,
		system.lineGroups,
		signatureLength // + system.props.indentation
	);

	system.group.addChildren(measureGroups);

	const cursorFn = (possibleNextPositions, cursor) => {
		return placement.scaleCursor(measureScale, cursor, _.min(possibleNextPositions) + cursor);
	};

	// const lineCenters = _.map(lines, line => b(line.group));
	const lineCenters = system.lineGroups.map(b);
	const cursors = placeTimes(timeContexts, measures, measureLengths, cursorFn, system.startCursors);
	// add the items to the system group
	system.group.addChildren(timeContextGroups);

	// Render stems, beams, tuplets, articulations, and ledger lines.
	////////////////////////
	// Render Decorations // FIXME: Should be handled at the Score level?
	////////////////////////
	if (timeContexts) {
		const groupings = System.createGroups({timeContexts, lines, voices, measures});
		System.renderDecorations({
			system,
			timeContexts,
			lines,
			voices,
			lineCenters,
			voices,
			measures,
			groupings
		});
	}

	// FIXME: Should this be part of renderDecorations?
	const measureNumber = renderMeasureNumber(measures[0].value);
	measureNumber.translate(0, -20);
	system.group.addChild(measureNumber);
}

// measures only contains the MeasureViews that are being rendered on this system.
// Perhaps it should get all the measures and start and end times. That way Rendering
// on a system doesn't have to begin and end at measure boundaries.
System.renderSystemAndContexts = function ({system, lines, measures, voices, timeContexts, length}) {
	// create the system group that all items will be added to.
	const systemGroup = system.render();

	const lineHeights = system.getLineHeights(lines);

	const systemStartTime = getTime(measures, {time: measures[0].startsAt});

	// Create the context marking for the beginning of each system.
	const systemSignatures = System.createSystemSignatures({measures, lines});
	const systemSignatureGroups = systemSignatures.map(({clef, key, timeSig}, i) => {
		const context = lines[i].contextAt(systemStartTime);
		clef.time = systemStartTime;
		key.time = systemStartTime;
		timeSig.time = systemStartTime;
		return {
			clef: clef.render(context),
			key: key.render(context),
			timeSig: timeSig.render(context)
		};
	});

	// Create the timeContexts groups so their widths can be determined.
	const timeContextGroups = _.map(timeContexts, (timeContext, i) => {
		return timeContext.render({lineHeights, disableMarkingRendering: i === 0});
	});

	const shortestDuration = Scored.config.shortestDuration; // need function to calculate this.

	// signatureLengths is the amount of horizontal space the system signature take up on a line.
	const [signatureLength] = calculateSystemSignaturesLength(systemSignatures);

	const timeLengths = calculateTimeLengths(timeContexts, shortestDuration);

	// Add signatureLength to the first measure.
	const measureLengths = addDefaultMeasureLengths(system.props.measures, calculateMeasureLengths(timeLengths));

	// get the minimum length of the line
	const minLineLength = _.sum(measureLengths) + signatureLength;

	let lineGroups, noteScale, cursorFn;

	if (!length) {
		lineGroups = system.renderLines(lines, minLineLength);

		const measureGroups = system.renderMeasures(measures, measureLengths, lineGroups, signatureLength);

		systemGroup.addChildren(measureGroups);

		cursorFn = (possibleNextPositions, cursor) => {
			return _.min(possibleNextPositions) + cursor;
		};

	} else {
		lineGroups = system.renderLines(lines, length);

		const totalMarkingLength = _.sumBy(timeLengths, ({length}) => length[0]) + signatureLength;

		const measureScale = (length - signatureLength) / (minLineLength - signatureLength);

		// noteScale = (length - totalMarkingLength) / (minLineLength - totalMarkingLength);

		const scaledMeasureLengths = _.map(measureLengths, measureLength => measureLength * measureScale);

		const measureGroups = system.renderMeasures(
			measures,
			scaledMeasureLengths,
			lineGroups,
			signatureLength
		);

		systemGroup.addChildren(measureGroups);

		cursorFn = (possibleNextPositions, cursor) => {
			return placement.scaleCursor(measureScale, cursor, _.min(possibleNextPositions) + cursor);
		};
	}

	systemSignatureGroups.forEach(({clef, key, timeSig}, i) => {
		systemGroup.addChildren([clef, key, timeSig]);
	});

	// add the items to the system group
	systemGroup.addChildren(timeContextGroups);

	systemGroup.addChildren(lineGroups);

	systemGroup.addChild(drawSystemBar(lineGroups));

	/////////////////////
	// Placement Phase //
	/////////////////////
	const lineCenters = _.map(lineGroups, b);
	const startCursors = placeSystemSignatures(systemSignatures, lineHeights);
	const cursors = placeTimes(timeContexts, measures, measureLengths, cursorFn, startCursors);

	// Render stems, beams, tuplets, articulations, and ledger lines.
	////////////////////////
	// Render Decorations // FIXME: Should be handled at the Score level?
	////////////////////////
	if (timeContexts) {
		const groupings = System.createGroups({timeContexts, lines, voices, measures});
		System.renderDecorations({
			timeContexts,
			lines,
			voices,
			lineGroups,
			lineCenters,
			voices,
			measures,
			groupings
		});
	}

	// FIXME: Should this be part of renderDecorations?
	const measureNumber = renderMeasureNumber(measures[0].value);
	measureNumber.translate(0, -20);
	systemGroup.addChild(measureNumber);

	return systemGroup;
};

System.createSystemSignatures = function ({measures, lines}) {
	const startTime = getTime(measures, {time: measures[0].startsAt});
	return getStartContexts(lines, startTime);
}

System.createGroups = function ({timeContexts, lines, voices, measures}) {
	if (timeContexts.length) {
		const startTime = _.first(timeContexts).time;
		const endTime = _.last(timeContexts).time;

		return lines.reduce((acc, line) => {
			const lineItems = getLineItems(line, voices, startTime.time, endTime.time);

			acc.beamings = acc.beamings.concat(lineItems.map((voice, i) => {
				return Beaming.groupItems(voice, {measures}).map(beaming => {
					const stemDirection = getStemDirection(lineItems, i);
					return Beaming.of({line, stemDirection}, beaming);
				});
			}));

			acc.tuplets = acc.tuplets.concat(lineItems.map(voice => {
				return Tuplet.groupItems(voice, {measures}).map(tuplet => {
					return Tuplet.of({line}, tuplet);
				});
			}));

			return acc;
		}, {beamings: [], tuplets: []});
	} else {
		return {beamings: [], tuplets: []};
	}
}

System.renderDecorations = function ({system, timeContexts, lines, lineCenters, voices, measures, groupings}) {
	if (timeContexts.length) {
		const startTime = _.first(timeContexts).time;
		const endTime = _.last(timeContexts).time;

		const { beamings, tuplets } = groupings;

		_.each(_.flatten(beamings), (beaming) => {
			const centerLineValues = _.map(beaming.children, item => {
				const contextTime = getTime(measures, item);
				const context = beaming.props.line.contextAt(contextTime);
				return getCenterLineValue(context.clef);
			});

			const stemDirections = beaming.props.stemDirection
				? _.fill(new Array(beaming.children.length), beaming.props.stemDirection)
				: Beaming.getAllStemDirections(beaming.children, centerLineValues);

			const beam = beaming.render(centerLineValues, stemDirections);
			beaming.props.line.group.addChild(beam);
		});

		_.each(_.flatten(tuplets), tuplet => {
			const lineCenter = b(tuplet.props.line.group);
			const group = tuplet.render(lineCenter);
			tuplet.props.line.group.addChild(group);
		});

		lines.forEach((line, i) => {
			const lineCenter = b(system.lineGroups[i]);
			const lineItems = getLineItems(line, voices, startTime.time, endTime.time);
			// render decorations that only require knowledge of the line.
			_.each(lineItems, voiceItems => {
				renderLedgerLines(voiceItems, lineCenter);
				Voice.renderArticulations(voiceItems); // items must have stem direction already
			});
		});
	}
}

function calculateTimeLengths (timeContexts, shortestDuration) {
    return _.map(timeContexts, (timeContext) => {
		// get all items at the time
		// const allItems = timeContext.lines.reduce((acc, line) => {
		// 	return line ? acc.concat(line.items) : acc;
		// }, []);

		const timeLength = placement.calculateTimeLength(_.compact(timeContext.items), shortestDuration);

		return {time: timeContext.time, length: timeLength};
	});
}

function calculateSystemSignaturesLength (signatures) {
	const allItems = signatures.reduce((acc, {clef, key, timeSig}) => {
		return acc.concat(clef, key, timeSig);
	}, []);
	return placement.calculateTimeLength(allItems, 0);
}

function placeSystemSignatures (systemSignatures, lineHeights) {
	const leftMargin = Scored.config.note.head.width;
	return systemSignatures.map(({clef, key, timeSig}, i) => {
		const rootY = new paper.Point(0, lineHeights[i]);
		const cursor = positionMarkings(rootY, leftMargin, [clef, key, timeSig]);
		const time = clef.time;
		return {time, cursor};
	});
}

function placeTimes (timeContexts, measures, measureLengths, cursorFn, startCursors) {
	return _.reduce(timeContexts, (cursors, timeContext, i) => {
		// const lineIndices = _.filter(_.map(timeContext.lines, (ctx, i) => ctx ? i : undefined), _.isNumber);
		// const previousTime = _.last(cursors) ? _.last(cursors).time : 0;
		const previousTime = _.last(cursors).time || {measure: 0};
		const currentTime = timeContext.time;
		let cursor = _.last(cursors) ? _.last(cursors).cursor : Scored.config.note.head.width;
		// update cursor if it's a new measure
		if (currentTime.measure !== previousTime.measure) {
			const measure = _.find(measures, measure => measure.value === currentTime.measure);
			// cursor = placement.calculateCursor(measure);
			cursor = placement.calculateCursor(measure);
			// cursor = _.sum(measureLengths.slice(0, measure.value)) + Scored.config.note.head.width;
		}

		timeContext.group.translate(cursor, 0);
		const possibleNextPositions = timeContext.calculateCursor();

		return cursors.concat({time: currentTime, cursor: cursorFn(possibleNextPositions, cursor)});
	}, startCursors);
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

function renderMeasureNumber (measureNumber) {
	return new paper.PointText({
		content: measureNumber,
		fontFamily: 'gonvillealpha',
		fontSize: Scored.config.fontSize / 1.5,
		fillColor: "black"
	});
}

System.prototype.type = TYPE;

System.prototype.render = function () {
	const group = this.group = new paper.Group({
		name: TYPE
	});

	return group;
};

System.prototype.getLineHeights = function (lines) {
	const defaultHeight = 120;
	return lines.reduce((heights, line, i) => {
		return heights.concat((this.props.lineHeights[i+1] || defaultHeight) + _.last(heights));
	}, [this.props.lineHeights[0] || 0]);
};

System.prototype.renderLines = function (lines, length) {
	// draw each line
	const lineHeights = this.getLineHeights(lines);
	const lineGroups = lines.map((line, i) => {
		const group = line.render(length);
		group.translate([0, lineHeights[i]]);
		return group;
	});

	return lineGroups;
};

System.prototype.renderMeasures = function (measures, lengths, systemGroup, offset=0) {
	let xPos = 0;
	const measureGroups = _.reduce(measures, (groups, measure, i) => {
		const measureLength = i === 0 ? lengths[i] + offset : lengths[i];
		const previousGroup = _.last(groups);

		const leftBarline = previousGroup ? _.last(previousGroup.children) : null;
		const measureGroup = measure.render(systemGroup, leftBarline, xPos, measureLength);

		xPos += measureLength;

		groups.push(measureGroup);
		return groups;
	}, []);

	return measureGroups;
};

function getStartContexts (lines, time) {
    return lines.map(line => line.contextAt(time));
}

/*
 * @param time - Time object.
 * @param context - Return value of line.contextAt.
 * @return TimeContext object {context, time, items}
 */
export function createLineTimeContext (time, context) {
    const items = [clone(context.clef), clone(context.key), clone(context.timeSig)];
    return {context, items, time};
}

export default System;
