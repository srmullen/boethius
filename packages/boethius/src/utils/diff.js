import {every} from "lodash";

/*
 * @param previous - Voice
 * @param next - Voice
 * @return - Array of times to rerender of ALL
 */
export function voices (previous, next) {
    const pIterable = previous.iterate();
    const nIterable = next.iterate();
    const times = [];

    let pFrame = pIterable.next();
    let nFrame = nIterable.next();
    while (!(pFrame.done && nFrame.done)) {
        const pTime = getFrameTime(pFrame);
        const nTime = getFrameTime(nFrame);
        if (pTime === nTime) {
            // compare the values
            if (!(pFrame.value.length === nFrame.value.length &&
                every(pFrame.value, (item, i) => item.equals(nFrame.value[i])))) {
                    times.push(pTime);
            }

            // Advance the time of both frames
            pFrame = pIterable.next();
            nFrame = nIterable.next();
        } else if (pTime < nTime) {
            times.push(pTime);
            pFrame = pIterable.next();
        } else if (pTime > nTime) {
            times.push(nTime);
            nFrame = nIterable.next();
        }
    }

    return times;
};

function getFrameTime (frame) {
    return !frame.done ? frame.value[0].time : Infinity;
}

/*
 * @param previous - [Number]
 * @param next - [Number]
 * @return Array of indices at which the given arrays differ.
 */
export function arrays (previous, next) {
    const length = Math.max(previous.length, next.length);
    const ret = [];
    for (let i = 0; i < length; i++) {
        if (previous[i] !== next[i]) ret.push(i);
    }
    return ret;
}

/*
 * @param current {Score} - the currently rendered score.
 * @param next {Score} - the score that is to be rendered next.
 * @return - true if measures have changed, false otherwise.
 * TODO: Need to handle timeSig changes.
 */
export function measures (current, next) {
    const currentNum = _.sum(current.systems, system => system.measures);
    const nextNum = _.sum(next.systems, system => system.measures);

    return currentNum !== nextNum;
}
