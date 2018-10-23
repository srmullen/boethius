import paper from "paper";
import _ from "lodash";

import { drawFermata } from '../engraver';
import Note from "./Note";
import Chord from "./Chord";
import {getStaffItems} from "../utils/system";
import {positionMarkings, b, f} from "../utils/line";
import {getAccidentalContexts} from "../utils/accidental";
import {equals, getTimeFromSignatures, iterateByTime} from "../utils/timeUtils";
import {isNote, isChord, isRest, isDynamic, isPitched, isMarking, hasDuration} from "../types";
import {
  calculateNoteYpos, getClefBase, alignNoteHeads, getYOffset, calculateCursor, placeAt, getArticulationPoint
} from "../utils/placement";
import {map} from '../utils/common';

/*
 * Representation of all items across lines that are at a given time.
 * Internal class. Not exposed as Boethius view.
 * @param timeContext - array of lineTimeContexts.
 * @param symbols - array of symbols.
 */
function TimeContext ({time=mustProvideTime(), lines = [], voices = [], items = [], symbols = []}) {
    this.lines = lines;
    // this.time = _.find(timeContext, line => !!line).time;
    this.time = time;
    this.voices = voices;
    this.items = items;
    this.symbols = symbols;
}

TimeContext.prototype.render = function ({system, lineHeights, disableMarkingRendering}) {
  const group = this.group = new paper.Group();

  // create the groups for each line.
  const lineItems = _.map(this.lines, (line, i) => {
		if (line) {
      // Get items on the line.
      const items = this.items.filter(item => {
        if (disableMarkingRendering && isMarking(item)) {
          return false;
        } else {
          return (item && item.line === line);
        }
      });

			const itemGroups = renderTime(this.time, items);

      const markings = _.filter(items, isMarking);
      const pitchedItems = _.filter(items, isPitched);
      const rests = _.filter(items, isRest);
      const dynamics = _.filter(items, isDynamic);

      return {markings, pitchedItems, rests, dynamics, itemGroups};
		}
	});

  // Place the markings.
  const markingCursors = lineItems.map((items, i) => {
    if (items) {
      const rootY = new paper.Point(f(system.lineGroups[i]));
      return positionMarkings(rootY, rootY.x, items.markings);
    }
  });

  // Place durationed items.
  const durationCursors = this.lines.map((line, i) => {
    if (line) {
      const {pitchedItems, rests, dynamics, itemGroups} = lineItems[i];
      const cursor = _.max(markingCursors);
      const rootY = new paper.Point(f(system.lineGroups[i]));

      // let widestItem = null;
      if (pitchedItems.length) {
        const widestItem = _.maxBy(pitchedItems, item => item.group.bounds.width);
        placeY(rootY, line.contextAt(this.time), widestItem);
        placeAt(cursor, widestItem);
        const notWidestItems = _.filter(pitchedItems, item => item !== widestItem);
        _.each(notWidestItems, _.partial(placeY, rootY, line.contextAt(this.time)));

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
    }
  });

  // render symbols
  const minCursor = Math.min.apply(null, _.compact(markingCursors));
  const symbolCursor = _.isFinite(minCursor) ? minCursor : 0;
  const symbolGroups = this.symbols.map(symbol => {
    const symbolGroup = symbol.render();
    symbolGroup.translate(symbolCursor, getYOffset(symbol));
    return symbolGroup;
  });

  group.addChildren(symbolGroups);

  return group;
}

TimeContext.prototype.renderArticulations = function ({system}) {
  this.lines.forEach((line, i) => {
    if (line) {
      const lineItems = this.items.filter(item => item.line === line);
      // Determine if there is a fermata at this time.
      const hasFermata = lineItems.some(item => item.fermata && item.line === line);
      if (hasFermata) {
        const widestItem = _.maxBy(lineItems, item => hasDuration(item) ? item.group.bounds.width : -Infinity);
        const itemTop = _.minBy(lineItems, item => item.group.bounds.top)
        const rootY = new paper.Point(f(system.lineGroups[i]));
        let point = null;
        if (isChord(widestItem)) {
          const stemDirection = widestItem.getStemDirection();
          if (stemDirection === 'up') {
            const y = (itemTop ? Math.min(itemTop.group.bounds.top, rootY.y) : rootY.y) - Scored.config.layout.lineSpacing;
            point = new paper.Point(widestItem.getBaseNote(stemDirection).noteHead.bounds.center.x, y);
          } else {
            point = getArticulationPoint(widestItem.getBaseNote(stemDirection), stemDirection);
          }
        } else if (isNote(widestItem)) {
          if (widestItem.getStemDirection() === 'up') {
            const y = (itemTop ? Math.min(itemTop.group.bounds.top, rootY.y) : rootY.y) - Scored.config.layout.lineSpacing;
            point = new paper.Point(widestItem.noteHead.bounds.center.x, y);
          } else {
            const y = itemTop ? Math.min(itemTop.group.bounds.top, rootY.y) : rootY.y;
            point = new paper.Point(widestItem.noteHead.bounds.center.x, y);
          }
        } else {
          const y = (itemTop ? Math.min(itemTop.group.bounds.top, rootY.y) : rootY.y) - Scored.config.layout.lineSpacing;
          point = new paper.Point(itemTop.group.bounds.center.x, y);
        }
        const fermata = drawFermata(point);
        this.group.addChild(fermata);
      }
    }
  });
}

TimeContext.prototype.calculateCursor = function () {
  return this.lines.map((line) => {
    // find items on the line that have been rendered.
    const items = this.items.filter(item => item.line === line && item.group);
    const markingCursor = _.filter(items, isMarking).reduce((acc, marking) => calculateCursor(marking) + acc, 0);
    const durationedCursor = _.min(_.filter(items, hasDuration).map(calculateCursor));
    return [markingCursor, durationedCursor];
  });
};

function placeY (rootY, context, item) {
	const note = isNote(item) ? item : item.children[0];
	const yPos = calculateNoteYpos(note, Scored.config.lineSpacing/2, getClefBase(context.clef.value), 4);
	item.group.translate(rootY.add([0, yPos]));
};

function renderTime (time, items) {
    return items.map(item => {
        const context = item.line.contextAt(time);
        return renderItem(item, context);
    });
}

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

function setLineOnItems (lines, voices) {
    return _.forEach(lines, (line) => {
        return _.reduce(line.voices, (acc, voiceConfig) => {
            if (_.isString(voiceConfig)) {
                const voice = _.find(voices, voice => voice.name === voiceConfig);
                // return voice ? acc.concat(voice.children) : acc;
                if (voice) {
                    voice.children.forEach(child => child.line = line);
                }
            } else {
                return acc;
            }
        }, []);
    });
}

/*
 * @param line - Line
 * @param voices - Item[]
 * @return [...{time, items, context}] Array ordered by time
 */
function getTimeContexts (line, items) {
	const allItems = line.markings.concat(items);

	const times = _.map(_.groupBy(allItems, (item) => {
		return getTimeFromSignatures(line.timeSignatures, item).time;
	}), (v) => {
		const time = getTimeFromSignatures(line.timeSignatures, v[0]);
		return {time, items: v, context: line.contextAt(time)};
	});

	const sortedTimes = _.sortBy(times, ({time}) => time.time);

	return sortedTimes;
}

// function getTimeContexts (voice) {
// 	const allItems = line.markings.concat(items);
//
// 	const times = _.map(_.groupBy(allItems, (item) => {
// 		return getTimeFromSignatures(line.timeSignatures, item).time;
// 	}), (v) => {
// 		const time = getTimeFromSignatures(line.timeSignatures, v[0]);
// 		return {time, items: v, context: line.contextAt(time)};
// 	});
//
// 	const sortedTimes = _.sortBy(times, ({time}) => time.time);
//
// 	return sortedTimes;
// }

// TODO: Handle accidentals context.
TimeContext.createTimeContexts = function createTimeContexts (timeSignaures, lines, voices, chordSymbols) {
    // get the time contexts
    setLineOnItems(lines, voices);
	const lineItems = getStaffItems(lines, voices);
	const lineTimes = map((line, items) => getTimeContexts(line, items), lines, lineItems);
    // const timeContexts = voices.map(getTimeContexts);

    // calculate the accidentals for each line.
	_.each(lineTimes, (times) => {
		const accidentals = getAccidentalContexts(times);
		// add accidentals to times
		_.each(times, (time, i) => time.context.accidentals = accidentals[i]);
	});

    const timeFn = (item) => {
        return getTimeFromSignatures(timeSignaures, item);
    }
    return iterateByTime(timeFn, (time, items) => {
        let [symbols, ] = _.partition(chordSymbols, (sym) => {
            const symbolTime = getTimeFromSignatures(timeSignaures, sym);
            return equals(time, symbolTime);
        });

        return new TimeContext({time, lines, voices, items: _.compact(items), symbols});
    }, [...voices, ...lines].map(voice => voice.children));
}

function mustProvideTime () {
    throw new Error('TimeContext must be provided a time');
}

export default TimeContext;
