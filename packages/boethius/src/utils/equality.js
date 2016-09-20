import {curry} from "lodash";

// Object mapping types to equality functions
const types = {note, rest, clef, dynamic};

/*
 * Compare pojos according to Boethius equality semantics.
 * @param item1 - Object
 * @param item2 - Object
 * @returh Bool
 */
export function equals (item1, item2) {
    if (!item1.type || !item2.type) throw "No type: Equality checks require a type";

    if (!equalType(item1, item2)) return false;

    return types[item1.type](item1, item2);
}

function equalType (item1, item2) {
    return item1.type === item2.type;
}

// ({type}, {type}) => {type} => {type} => Bool
const equalItem = curry((fn, item1, item2) => {
     return equalType(item1, item2) && fn(item1, item2);
});

function note (item1, item2) {
    return (
		item1.value === item2.value &&
		item1.pitch === item2.pitch &&
		item1.dots === item2.dots &&
		item1.tuplet === item2.tuplet &&
		item1.time === item2.time &&
		item1.voice === item2.voice &&
		item1.slur === item2.slur &&
		item1.staccato === item2.staccato &&
		item1.tenuto === item2.tenuto &&
		item1.portato === item2.portato
	);
}

function rest (item1, item2) {
    return (
		item1.voice === item2.voice &&
		item1.value === item2.value &&
		item1.dots === item2.dots &&
		item1.tuplet === item2.tuplet &&
		item1.time === item2.time &&
		item1.slur === item2.slur
	);
}

function clef (item1, item2) {
    return (
		item1.value === item2.value &&
		item1.measure === item2.measure &&
		item1.beat === item2.beat
	);
}

function dynamic (item1, item2) {
    return (
        item1.value === item2.value &&
        item1.time === item2.time
    );
}

export const noteEquals = equalItem(note);
export const restEquals = equalItem(rest);
export const clefEquals = equalItem(clef);
export const dynamicEquals = equalItem(dynamic);
