import _ from "lodash";

import constants from "./constants";

// FIXME: Might be better to use instanceof operator. But that requires importing types which causes circulat dependencies.
/*
 * @param type - String
 * @param item - Scored item.
 * @return - Boolean. True if items type is equal to type.
 */
function isType (type, item) {
    return item && type === item.type;
}

const isChord = _.partial(isType, constants.type.chord);
const isChordSymbol = _.partial(isType, constants.type.chordSymbol);
const isClef = _.partial(isType, constants.type.clef);
const isDynamic = _.partial(isType, constants.type.dynamic);
const isKey = _.partial(isType, constants.type.key);
const isLine = _.partial(isType, constants.type.line);
const isMeasure = _.partial(isType, constants.type.measure);
const isNote = _.partial(isType, constants.type.note);
const isRest = _.partial(isType, constants.type.rest);
const isScore = _.partial(isType, constants.type.score);
const isSlur = _.partial(isType, constants.type.slur);
const isSystem = _.partial(isType, constants.type.system);
const isTimeSignature = _.partial(isType, constants.type.timeSig);
const isVoice = _.partial(isType, constants.type.voice);
const isRepeat = _.partial(isType, constants.type.repeat);
const isText = _.partial(isType, constants.type.text);
const isMarking = item => isClef(item) || isKey(item) || isTimeSignature(item) || isRepeat(item);
const isPitched = item => isNote(item) || isChord(item);
const hasDuration = item => isNote(item) || isChord(item) || isRest(item);

export {
    isChord,
    isChordSymbol,
    isClef,
    isDynamic,
    isKey,
    isLine,
    isMeasure,
    isNote,
    isRest,
    isRepeat,
    isScore,
    isSlur,
    isSystem,
    isText,
    isTimeSignature,
    isVoice,
    isMarking,
    isPitched,
    hasDuration
};
