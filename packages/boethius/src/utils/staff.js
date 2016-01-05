import _ from "lodash";

import * as placement from "./placement";
import * as line from "./line";
import {isNote} from "../types";

/*
 * Groups and indexes voices by the lines they are to be rendered on. Voice names take priority, then order.
 * @param lines - Line[]
 * @param Voices - Voice[]
 * @return Map<Line, Voice[]>
 */
function groupVoices (lines, voices) {
    const voiceMap = new Map();
    _.each(voices, (voice, i) => {
        let voiceArr = voiceMap.get(lines[i]) || [];
        voiceMap.set(lines[i], voiceArr.concat(voice));
    });
    return voiceMap;
}

/*
 * Given lines and voices, returns an array of item arrays. The first array is all items to be rendered on the first line, and so on.
 * @param lines - Line[]
 * @param voices- Voice[]
 * @return Items[][]
 */
// FIXME: Incomplete/incorrect implementation just to get staff rendering.
function getLineItems (lines, voices) {
    let lineItems = [];
    for (let i = 0; i < lines.length; i++) {
        lineItems.push(voices[i].children);
    }
    return lineItems;
}

function calculateMeasureLengths (measures, times, noteHeadWidth, shortestDuration) {
    const lineMeasureLengths = times.map(lineTimes => line.calculateMeasureLengths(measures, lineTimes, noteHeadWidth, shortestDuration));
    const measureLengths = new Array(measures.length);
    for (let i = 0; i < measures.length; i++) {
        measureLengths[i] = _.max(_.map(lineMeasureLengths, lineMeasureLength => lineMeasureLength[i]));
    }
    return measureLengths;
}

/*
 * @param time context object
 * @return Number or undefined if there is no context
 */
function getTimeFromContext (ctx) {
    return ctx && ctx.time ? ctx.time.time : undefined;
}

/*
 * @param times context[][]
 */
function nextTimes (times) {
    const ctxs = _.map(times, _.first);

    if (!_.compact(ctxs).length) return []; // return nothing if there are no more contexts

    const nextTime = _.min(ctxs, getTimeFromContext).time.time;
    const nexts = [];
    const rests = [];
    for (let i = 0; i < ctxs.length; i++) {
        if (getTimeFromContext(ctxs[i]) === nextTime) {
            nexts.push(ctxs[i]);
            rests.push(_.rest(times[i]));
        } else {
            nexts.push(null);
            rests.push(times[i]);
        }
    }
    return [nexts, rests];
}

/*
 * @param fn - function to apply to the time context
 * @param times context[][]
 */
function iterateByTime (fn, times) {
    let [nexts, rests] = nextTimes(times);
    const ret = [];
    while (_.compact(nexts).length) {
        ret.push(fn(nexts));
        [nexts, rests] = nextTimes(rests);
    }

    return ret;
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
		let pos = placement.getYOffset(rest.group);

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

export {
    groupVoices,
    getLineItems,
    calculateMeasureLengths,
    nextTimes,
    iterateByTime,
    renderTimeContext
};
