import _ from "lodash";

import constants from "./constants";

// FIXME: Might be better to use instanceof operator. But that requires importing types which causes circulat dependencies.
/*
 * @param type - String
 * @param item - Scored item.
 * @return - Boolean. True if items type is equal to type.
 */
function isType (type, item) {
    return type === item.type;
}

const isChord = _.partial(isType, constants.type.chord);
const isClef = _.partial(isType, constants.type.clef);
const isKey = _.partial(isType, constants.type.key);
const isLine = _.partial(isType, constants.type.line);
const isMeasure = _.partial(isType, constants.type.measure);
const isNote = _.partial(isType, constants.type.note);
const isRest = _.partial(isType, constants.type.rest);
const isScore = _.partial(isType, constants.type.score);
const isStaff = _.partial(isType, constants.type.staff);
const isTimeSignature = _.partial(isType, constants.type.timeSig);
const isVoice = _.partial(isType, constants.type.voice);
const isMarking = item => isClef(item) || isKey(item) || isTimeSignature(item);

export {
    isChord,
    isClef,
    isKey,
    isLine,
    isMeasure,
    isNote,
    isRest,
    isScore,
    isStaff,
    isTimeSignature,
    isVoice,
    isMarking
};
