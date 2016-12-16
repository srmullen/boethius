import {calculateDuration, absoluteToRelativeDuration, gte, lte} from "./timeUtils";
import {clone} from "./common";
import {isNote, isRest, isChord} from "../types";

const BREAK = "BREAK";

/*
 * Breaks a durationed item so it doesn't run over boundaries such as a barline or invisible barline.
 */
export function divide (time, item) {
    if (!time) return item;

    if (gte(item.time, time)) {
        return item;
    }
    const duration = calculateDuration(item).valueOf();
    if (lte(item.time + duration, time)) {
        return item;
    }

    // get duration of new items
    const dur1 = absoluteToRelativeDuration(time - item.time);
    const dur2 = absoluteToRelativeDuration(item.time + duration - time);
    return [clone(item, {...dur1, slur: BREAK}), clone(item, {...dur2, time, slur: BREAK})];
}
