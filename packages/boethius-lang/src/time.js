import F from "fraction.js";
// import { NOTE, REST, CHORD, TIMESIG, CLEF, REPEAT } from './constants';
import { isNote, isRest, isChord, isTimeSignature, isRepeat, isClef } from './utils';

/*
 * @param item - Scored item. Given an item, return the rational duration of the item;
 * @return Number
 */
export function calculateDuration (item) {

	// The item doesn't have a duration unless it's one of the following types.
	if (!(isNote(item) || isChord(item) || isRest(item) ||isRepeat(item))) return F(0);

	const s = item.props.tuplet ? item.props.tuplet.split("/") : null;
	const tuplet = s ? new F(s[0], s[1]) : null;
	const dots = item.props.dots || 0;

	let dur = new F(1, item.props.value || 4);

	for (let i = 0; i < dots; i++) {
		dur = dur.mul(1.5);
	}

	if (tuplet && dur) {
		dur = dur.mul(s[1]).div(s[0]);
	}

	return dur;
}

/*
 * @param items - Item[]
 * @param offset - Optional amount of time that will be added to the items times.
 */
export function calculateAndSetTimes (items, offset=0) {
    return items.reduce((acc, item) => {
        const previousItem = acc[acc.length-1];

        if (previousItem) {
			setTime(item, F(getTime(previousItem)).add(calculateDuration(previousItem)).valueOf());
        } else {
			setTime(item, offset);
        }

        return acc.concat([item]);
    }, []);
}

/*
 * Sets the time in the correct position on an item.
 */
export function setTime (item, time) {
	if (isClef(item)) {
		item.time = time;
	} else {
		item.props.time = time;
	}
}

export function getTime (item) {
	if (isClef(item)) {
		return item.time;
	} else {
		return item.props.time;
	}
}
