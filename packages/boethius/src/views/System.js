import paper from "paper";
import _ from "lodash";

import {isMarking, isPitched, isNote, isClef, isKey, isTimeSignature} from "../types";
import {drawSystemBar} from "../engraver";
import constants from "../constants";
import {getLineItems, b, positionMarkings} from "../utils/line";
import {
	calculateMeasureLengths,
	calculateSystemLength,
	addDefaultMeasureLengths
} from "../utils/system";
import {map, mapDeep, clone} from "../utils/common";
import * as placement from "../utils/placement";
import {getMeasureNumber, getTime, addTimes} from "../utils/timeUtils";
import Voice from "./Voice";
import {getCenterLineValue} from "./Clef";
import Line from "./Line";
import Beaming from './Beaming';
import Tuplet from './Tuplet';
import TimeContext from './TimeContext';

const TYPE = constants.type.system;

const SYSTEM_DEFAULTS = {
	page: 0,
	duration: {measure: 4},
	lineHeights: [],
	indentation: 0
};

function processProps (props) {
	if (_.isNumber(props.endsAt)) {
		return Object.assign({}, {
			page: 0,
			lineHeights: [],
			indentation: 0
		}, props);
	} else {
		return Object.assign({}, SYSTEM_DEFAULTS, props);
	}
}

/**
 * @param measures - the number of measures on the system.
 * @param {Time} startsAt - the time the system begins rendering. (inclusive)
 * @param {Time} endsAt - the time system ends rendering. (exclusive)
 * @param {Number} page - The page the system is rendered on.
 */
function System (props = {}, children = []) {
	this.props = processProps(props);
	this.children = children;
}

/**
 * Get the time as a Time object rather than just a number.
 * @param {Measure[]} - Array of measure for calculating the time.
 * @return {Time}
 */
System.prototype.getStartTime = function (measures) {
	return getTime(measures, this.props.startsAt);
}

/**
 * @param {Measure[]} - Array of measure for calculating the time.
 * @return {Time}
 */
System.prototype.getEndTime = function (measures) {
	if (_.isNumber(this.props.endsAt)) {
		return getTime(measures, this.props.endsAt);
	} else {
		return addTimes(measures, this.props.startsAt, this.props.duration);
	}
}

System.prototype.getDuration = function (measures) {
	return this.getEndTime(measures).time - this.getStartTime(measures).time;
}

/**
 * @param {System} system
 * @param {Line[]} lines
 * @param {Measure[]} systemMeasures - The measures that are rendered on the system.
 * @param {Measure[]} measures - All measures of the score.
 * @param {Number} length - The length of the system in pixels.
 */
System.render = function ({system, lines, length}) {
	const group = system.render();

	let lineGroups;

	if (!length) {
		throw new Error('No length provided.');
	} else {
		system.lineGroups = system.renderLines(lines, length);
	}

	group.addChildren(system.lineGroups);

	group.addChild(drawSystemBar(system.lineGroups));

	return group;
}

System.renderSystemMarkings = function ({system, measures, lines}) {
	const lineHeights = system.getLineHeights(lines);

	const systemStartTime = system.getStartTime(measures);

	system.signatures = System.createSystemSignatures(systemStartTime, lines);
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

	systemSignatureGroups.forEach(({clef, key, timeSig}, i) => {
		system.group.addChildren([clef, key, timeSig]);
	});

	system.startCursors = placeSystemSignatures(system.signatures, lineHeights);
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

	// Get the total num of measures the system spans, even if it's only partial measures.
	const numMeasures = systemMeasureCount(system, measures);
	const measureLengths = addDefaultMeasureLengths(numMeasures, calculateMeasureLengths(timeLengths));

	// get the minimum length of the line
	const minLineLength = _.sum(measureLengths) + signatureLength;

	const totalMarkingLength = _.sumBy(timeLengths, ({length}) => length[0]) + signatureLength;

	const measureScale = (length - signatureLength) / (minLineLength - signatureLength);
	// const systemDuration = system.getDuration(measures);
	// const baseSystemLength = calculateSystemLength(timeLengths);
	// const scale = (length - signatureLength) / (systemDuration / shortestDuration);

	const scaledMeasureLengths = _.map(measureLengths, measureLength => measureLength * measureScale);

	const measuresToRender = getMeasuresToRender(system, measures);

	const measureGroups = system.renderMeasures(
		measuresToRender,
		scaledMeasureLengths,
		system.lineGroups,
		signatureLength
	);

	system.group.addChildren(measureGroups);

	const cursorFn = (possibleNextPositions, cursor) => {
		const [maxMarkingSize, minDurationSize] = _.reduce(possibleNextPositions,
			([prevMarkingSize, prevDurSize],[markingSize = -Infinity, durSize = Infinity]) => {
				return [
					Math.max(prevMarkingSize, markingSize),
					Math.min(prevDurSize, durSize)
				];
			},
			[-Infinity, Infinity]
		);
		return placement.scaleCursor(measureScale, cursor, maxMarkingSize + minDurationSize + cursor);
	};

	const lineCenters = system.lineGroups.map(b);
	const cursors = placeTimes(timeContexts, measures, cursorFn, system.startCursors);
	// add the items to the system group
	system.group.addChildren(timeContextGroups);

	// Render stems, beams, tuplets, articulations, and ledger lines.
	////////////////////////
	// Render Decorations // FIXME: Should be handled at the Plugin level?
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
}

/**
 * @param {System} system - The system on which measure bars are to be rendered.
 * @param {Measure[]} measures - All measure in the score.
 */
function getMeasuresToRender (system, measures) {
	const startsAt = system.getStartTime(measures);
	const endsAt = system.getEndTime(measures);
	const startIndex = measures.findIndex(measure => {
		return (
			startsAt.time >= measure.startsAt &&
			startsAt.time < measure.getEndTime()
		);
	});
	let endIndex = -1;
	for (let i = 0; i < measures.length; i++) {
		const endTime = measures[i].getEndTime();
		if (endTime === endsAt.time) {
			endIndex = i;
			break;
		}
		if (endTime > endsAt.time) {
			endIndex = i - 1;
			break;
		}
	}
	return measures.slice(startIndex, endIndex + 1);
}

/**
 * Return the number of measures rendered on the system, Even if they aren't
 * complete measures.
 * @param {System} system
 * @param {Measure[]} measures
 * @return {Number}
 */
function systemMeasureCount (system, measures) {
	const endTime = system.getEndTime(measures);
	if (endTime.beat === 0) {
		return (endTime.measure - system.getStartTime(measures).measure);
	} else {
		return (endTime.measure - system.getStartTime(measures).measure) + 1;
	}
}

System.createSystemSignatures = function (startTime, lines) {
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

System.prototype.getLineGroup = _.memoize(function (lineID) {
	return this.lineGroups.find(group => group.name === lineID);
});

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
			const lineGroup = system.getLineGroup(beaming.props.line.id);
			lineGroup.addChild(beam);
		});

		_.each(_.flatten(tuplets), tuplet => {
			const lineGroup = system.getLineGroup(tuplet.props.line.id);
			const lineCenter = b(lineGroup);
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

		timeContexts.map(timeContext => {
			timeContext.renderArticulations({system});
		});
	}

	// FIXME: Should this be part of Measure rendering? Reimplement for startsAt property.
	// if (system.props.startsAt) {
	// 	const time = getTime(measures, {time: system.props.startsAt});
	// 	const measureNumber = renderMeasureNumber(time.measure);
	// 	measureNumber.translate(0, -20);
	// 	system.group.addChild(measureNumber);
	// }
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

function placeTimes (timeContexts, measures, cursorFn, startCursors) {
	return _.reduce(timeContexts, (cursors, timeContext, i) => {
		const previousTime = _.last(cursors).time || {measure: 0};
		const currentTime = timeContext.time;
		let cursor = _.last(cursors) ? _.last(cursors).cursor : Scored.config.note.head.width;
		// update cursor if it's a new measure
		if (currentTime.measure !== previousTime.measure) {
			// const measure = _.find(measures, measure => measure.value === currentTime.measure);
			const measure = _.find(measures, measure => measure.value === previousTime.measure);
			cursor = placement.calculateCursor(measure);
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
