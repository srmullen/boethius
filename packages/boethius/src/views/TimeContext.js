import _ from "lodash";

import Note from "./Note";
import Chord from "./Chord";
import {isNote, isChord, isRest, isDynamic, isPitched} from "../types";
import {calculateNoteYpos, getClefBase, alignNoteHeads, getYOffset} from "../utils/placement";

/*
 * Representation of all items across lines that are at a given time.
 * Internal class. Not exposed as Boethius view.
 * @param lines - array of lineTimeContexts
 */
function TimeContext (timeContext) {
    this.lines = timeContext;
    this.time = _.find(timeContext, line => !!line).time;
}

TimeContext.prototype.render = function (lineHeights) {
    const group = new paper.Group();

	const itemGroups = _.map(this.lines, (line, i) => {
		if (line) {
			const itemGroups = renderTime(line);

            const pitchedItems = _.filter(line.items, isPitched);
            const rests = _.filter(line.items, isRest);
            const dynamics = _.filter(line.items, isDynamic);

            const rootY = new paper.Point(0, lineHeights[i]);
            if (pitchedItems.length) {
                const widestItem = _.max(pitchedItems, item => item.group.bounds.width);
                placeY(rootY, line.context, widestItem);
                // mutation of notes array
                _.remove(pitchedItems, item => item === widestItem);
                _.each(pitchedItems, _.partial(placeY, rootY, line.context));

                const alignToNoteHead = isNote(widestItem) ? widestItem.noteHead : widestItem.children[0].noteHead;
        		alignNoteHeads(alignToNoteHead.bounds.center.x, pitchedItems);
            }

            rests.map(rest => {
        		rest.group.translate(rootY.add(0, getYOffset(rest)));
            });

            dynamics.map((dynamic) => {
        		// const lowestPoint = _.max(_.map(pitchedItems, item => item.group.bounds.bottom));
        		dynamic.group.translate(rootY.add(0, Scored.config.layout.lineSpacing * 7.5));
        		// placement.placeAt(cursor, dynamic);
        	});

            return itemGroups;
		}
	});

    _.each(itemGroups, (items) => {
        group.addChildren(items);
    });

    return group;
}

function placeY (lineCenter, context, item) {
	const note = isNote(item) ? item : item.children[0];
	const yPos = calculateNoteYpos(note, Scored.config.lineSpacing/2, getClefBase(context.clef.value), 4);
	item.group.translate(lineCenter.add([0, yPos]));
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

export default TimeContext;
