import _ from "lodash";

import Note from "./Note";
import Chord from "./Chord";
import {isNote, isChord} from "../types";

/*
 * Representation of all items across lines that are at a given time.
 * Internal class. Not exposed as Boethius view.
 * @param lines - array of lineTimeContexts
 */
function TimeContext (timeContext) {
    this.lines = timeContext;
    this.time = _.find(timeContext, line => !!line).time;
}

TimeContext.prototype.render = function () {
    const group = new paper.Group();

	const itemGroups = _.map(this.lines, (lineTimeContext) => {
		if (lineTimeContext) {
			return renderTime(lineTimeContext);
		}
	});

    _.each(itemGroups, items => group.addChildren(items));

    return group;
}

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
