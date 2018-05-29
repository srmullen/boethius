import paper from "paper";
import _ from "lodash";

import Note from "./Note";
import Chord from "./Chord";
import {getStaffItems, iterateByTime} from "../utils/system";
import {positionMarkings, getTimeContexts} from "../utils/line";
import {getAccidentalContexts} from "../utils/accidental";
import {equals, getTimeFromSignatures} from "../utils/timeUtils";
import {isNote, isChord, isRest, isDynamic, isPitched, isMarking, hasDuration} from "../types";
import {calculateNoteYpos, getClefBase, alignNoteHeads, getYOffset, calculateCursor, placeAt} from "../utils/placement";
import {map} from '../utils/common';

/*
 * Representation of all items across lines that are at a given time.
 * Internal class. Not exposed as Boethius view.
 * @param timeContext - array of lineTimeContexts.
 * @param symbols - array of symbols.
 */
function TimeContext (timeContext = [], symbols = []) {
    this.lines = timeContext;
    this.time = _.find(timeContext, line => !!line).time;
    this.symbols = symbols;
}

TimeContext.prototype.render = function (lineHeights) {
    const group = this.group = new paper.Group();

	const cursors = _.map(this.lines, (line, i) => {
		if (line) {
			const itemGroups = renderTime(line);

            const markings = _.filter(line.items, isMarking);
            const pitchedItems = _.filter(line.items, isPitched);
            const rests = _.filter(line.items, isRest);
            const dynamics = _.filter(line.items, isDynamic);

            const rootY = new paper.Point(0, lineHeights[i]);

            const cursor = positionMarkings(rootY, 0, line);

            if (pitchedItems.length) {
                const widestItem = _.maxBy(pitchedItems, item => item.group.bounds.width);
                placeY(rootY, line.context, widestItem);
                placeAt(cursor, widestItem);
                // mutation of notes array
                _.remove(pitchedItems, item => item === widestItem);
                _.each(pitchedItems, _.partial(placeY, rootY, line.context));

                const alignToNoteHead = isNote(widestItem) ? widestItem.noteHead : widestItem.children[0].noteHead;
        		alignNoteHeads(alignToNoteHead.bounds.center.x, pitchedItems);
            }

            rests.map(rest => {
        		rest.group.translate(rootY.add(0, getYOffset(rest)));
                placeAt(cursor, rest);
            });

            dynamics.map((dynamic) => {
        		dynamic.group.translate(rootY.add(0, Scored.config.layout.lineSpacing * 7.5));
        		placeAt(cursor, dynamic);
        	});

            group.addChildren(itemGroups);

            return cursor;
		}
	});

    // render symbols
    const minCursor = Math.min.apply(null, _.compact(cursors));
    const symbolCursor = _.isFinite(minCursor) ? minCursor : 0;
    const symbolGroups = this.symbols.map(symbol => {
        const symbolGroup = symbol.render();
        symbolGroup.translate(symbolCursor, getYOffset(symbol));
        return symbolGroup;
    });

    group.addChildren(symbolGroups);

    return group;
}

TimeContext.prototype.calculateCursor = function () {
    return this.lines.map((line) => {
        if (line) {
            const markingCursor = _.filter(line.items, isMarking).reduce((acc, marking) => calculateCursor(marking) + acc, 0);
            const durationedCursor = _.min(_.filter(line.items, hasDuration).map(calculateCursor));
            return markingCursor + durationedCursor;
        }
    });
};

function placeY (rootY, context, item) {
	const note = isNote(item) ? item : item.children[0];
	const yPos = calculateNoteYpos(note, Scored.config.lineSpacing/2, getClefBase(context.clef.value), 4);
	item.group.translate(rootY.add([0, yPos]));
};

function renderTime ({items, context}) {
	return _.map(items, item => renderItem(item, context));
};

function renderItem (item, context) {
	if (isNote(item)) {
		return renderNote(item, context);
	} else if (isChord(item)) {
		return renderChord(item, context);
	} else {
		return item.render(context);
	}
}

/*
 * @param note - Note
 * @param context - {key, timeSig, time, clef, accidentals}
 * @return paper.Group
 */
function renderNote (note, context) {
	const group = note.render(context);
	Note.renderAccidental(note, context.accidentals, context.key);
	Note.renderDots(note, context.clef);
	return group;
};

/*
 * @param Chord - Chord
 * @param context - {key, timeSig, time, clef, accidentals}
 * @return Paper.Group
 */
function renderChord (chord, context) {
	const group = chord.render(context);
	Chord.renderAccidentals(chord, context);
	return group;
};

TimeContext.createTimeContexts = function createTimeContexts (timeSignaures, lines, voices, chordSymbols) {
    // get the time contexts
	const lineItems = getStaffItems(lines, voices);
    // FIXME: returned contexts are incorrect when clef starts on beat other than 0.
	const lineTimes = map((line, items) => getTimeContexts(line, items), lines, lineItems);

    // calculate the accidentals for each line.
	_.each(lineTimes, (times) => {
		const accidentals = getAccidentalContexts(times);
		// add accidentals to times
		_.each(times, (time, i) => time.context.accidentals = accidentals[i]);
	});

    return iterateByTime(timeContext => {
        let [symbols, ] = _.partition(chordSymbols, (sym) => {
            const symbolTime = getTimeFromSignatures(timeSignaures, sym);
            const contextTime = _.find(timeContext, line => !!line).time;
            return equals(contextTime, symbolTime);
        });

        return new TimeContext(timeContext, symbols);
    }, lineTimes);
}

export default TimeContext;
