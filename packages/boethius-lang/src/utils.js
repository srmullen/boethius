import { NOTE, REST, CHORD, TIMESIG, CLEF, REPEAT } from './constants';

export function isNote (item) {
	return item.type === NOTE;
}

export function isChord (item) {
	return item.type === CHORD;
}

export function isRest (item) {
	return item.type === REST;
}

export function isTimeSignature (item) {
    return item.type === TIMESIG;
}

export function isRepeat (item) {
    return item.type === REPEAT;
}

export function isClef (item) {
	return item.type === CLEF;
}

export function isMusic (item) {
    return isNote(item) || isChord(item) || isRest(item);
}
