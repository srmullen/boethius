import _ from "lodash";

import {partitionBy} from "./common";
import * as placement from "./placement";
import {isNote} from "../types";

/*
 * Given lines and voices, returns an array of item arrays. The first array is all items to be rendered on the first line, and so on.
 * @param lines - Line[]
 * @param voices- Voice[]
 * @return Items[][]
 */
function getLineItems (lines, voices) {
    return _.map(lines, (line) => {
        return _.reduce(line.voices, (acc, voiceConfig) => {
            if (_.isString(voiceConfig)) {
                const voice = _.find(voices, voice => voice.name === voiceConfig);
                return acc.concat(voice.children);
            } else if (_.isObject(voiceConfig)) {
                // TODO: get the time frame from the voice
            } else {
                return acc;
            }
        }, []);
    });
}

/*
 * @param timeContexts - array of lineContexts.
 * @param shortestDuration - float representation of shortest duration in the measure.
 * @return {time: Time, [markingLength, durationedLength]}
 */
function calculateTimeLengths (timeContexts, shortestDuration) {
    return _.map(timeContexts, (lineContexts) => {
		// get the time
		const time = _.find(lineContexts, ctx => !!ctx).time;

		// get all items at the time
		const allItems = lineContexts.reduce((acc, line) => {
			return line ? acc.concat(line.items) : acc;
		}, []);

		const timeLength = placement.calculateTimeLength(allItems, shortestDuration);

		return {time, length: timeLength};
	});
}

/*
 * @param timeLengths - {time, length[]}[]
 * @return length[]
 */
function calculateMeasureLengths (timeLengths) {
    const noteHeadWidth = Scored.config.note.head.width;
    return _.map(partitionBy(timeLengths, ({time}) => time.measure), (measureTimes) => {
		return _.sum(measureTimes, ({length}) => {
			// sum the marking and duration item lengths
			return _.sum(length);
		}) + noteHeadWidth;
	});
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
    getLineItems,
    calculateTimeLengths,
    calculateMeasureLengths,
    nextTimes,
    iterateByTime,
    renderTimeContext
};
