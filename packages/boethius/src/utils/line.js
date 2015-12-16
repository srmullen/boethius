import _ from "lodash";
import {getTime} from "./timeUtils";
import {isMarking, isNote} from "../types";
import * as placement from "./placement";

const {getStaffSpace, calculateTimeLength} = placement;

function lineGetter (name) {
	return function (lineGroup) {
		if (lineGroup instanceof paper.PlacedSymbol) {
			return lineGroup.symbol.definition.children[name].segments[0].point;
		} else {
			return lineGroup.children[name].segments[0].point;
		}
	}
}

const f = lineGetter("F"),
	  d = lineGetter("D"),
	  b = lineGetter("B"),
	  g = lineGetter("G"),
	  e = lineGetter("E");

/*
 * getClosestLine :: line -> (point -> noteName)
 */
function getClosestLine (line) {
	const lineGroup = line.staves[0],
	      positions = [f(lineGroup), d(lineGroup), b(lineGroup), g(lineGroup), e(lineGroup)];
	return function (point) {
		let diffs = _.map(positions, (p) => Math.abs(point.y - p.y));
		return _.indexOf(diffs, _.min(diffs));
	}
}

/*
 * getClosestLine :: line -> (point -> measure)
 */
function getMeasure (line) {
	const positions = _.map(line.children, measure => measure.barlines[0].position);
	return function (point) {
		let diffs = _.map(positions, p => point.x - p.x);
		return line.children[_.indexOf(diffs, _.min(_.filter(diffs, diff => diff >= 0)))];
	}
}

/*
 * @param line - Line
 * @param measures - Measure[]
 * @param voices - Item[]
 * @return [...{time, items, context}] Array ordered by time
 */
function getTimeContexts (line, measures, items) {
	let allItems = line.markings.concat(items);

	let times = _.sortBy(_.map(_.groupBy(allItems, (item) => {
		return getTime(measures, item).time;
	}), (v, k) => {
		let time = getTime(measures, v[0]);
		return {time, items: v, context: line.contextAt(measures, time)};
	}), ({time}) => time.time);

	return times;
}

function calculateMeasureLengths (measures, times, noteHeadWidth, shortestDuration) {
	// group items by measure.
	let itemsInMeasure = _.groupBy(times, (item) => {
		return item.time.measure;
	});

	let measureLengths = _.map(measures, (measure, i) => {
		let measureLength = _.sum(_.map(itemsInMeasure[i], ({items}) => calculateTimeLength(items, shortestDuration)));
		measureLength += noteHeadWidth;
		return measureLength;
	});

	return measureLengths;
}

function renderTimeContext (lineCenter, cursor, {time, items, context}) {
	let {
		clef: clefs,
		key: keys,
		timeSig: timeSigs,
		note: notes,
		rest: rests,
		chord: chords
	} = _.groupBy(items, item => item.type);

	// place the markings
	// Will there ever be more than one marking of a type at a time? Definately note for Line. Maybe for Staff.
	if (clefs) cursor = placement.placeMarking(lineCenter, cursor, clefs[0]);
	if (keys) cursor = placement.placeMarking(lineCenter, cursor, keys[0]);
	if (timeSigs) cursor = placement.placeMarking(lineCenter, cursor, timeSigs[0]);

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
		let pos = placement.getYOffset(rest.group);

		rest.group.translate(lineCenter.add(0, pos));
		placement.placeAt(cursor, rest);

		return placement.calculateCursor(rest);
	}));

	// next time is at smallest distance
	cursor = _.min(possibleNextPositions);

	return cursor;
}

export {
	f,
	d,
	b,
	g,
	e,
	getClosestLine,
	getMeasure,
	getTimeContexts,
	calculateMeasureLengths,
	renderTimeContext
}
