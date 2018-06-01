import _ from "lodash";

import {partitionBy} from "./common";

/*
 * Given lines and voices, returns an array of item arrays.
 * The first array is all items to be rendered on the first line, and so on.
 * @param lines - Line[]
 * @param voices- Voice[]
 * @return Items[][]
 */
function getStaffItems (lines, voices) {
    return _.map(lines, (line) => {
        return _.reduce(line.voices, (acc, voiceConfig) => { // FIXME: duplication of getLineItems
            if (_.isString(voiceConfig)) {
                const voice = _.find(voices, voice => voice.name === voiceConfig);
                return voice ? acc.concat(voice.children) : acc;
            } else if (_.isObject(voiceConfig)) {
                // TODO: get the time frame from the voice
            } else {
                return acc;
            }
        }, []);
    });
}

/*
 * @param timeLengths - {time, length[]}[]
 * @return length[]
 */
function calculateMeasureLengths (timeLengths) {
    const noteHeadWidth = Scored.config.note.head.width;
    return _.map(partitionBy(timeLengths, ({time}) => time.measure), (measureTimes) => {
		const [markingsLength, durationedLength] = _.reduce(measureTimes, (acc, {length}) => {
			// sum the marking and duration item lengths
			return [acc[0] + length[0], acc[1] + length[1]];
		}, [0, 0]);

        const measureLength = markingsLength + (durationedLength ? durationedLength : Scored.config.measure.length) + noteHeadWidth;

        return measureLength;
	});
}

/*
 * @param numMeasures - The number of measure lengths to return.
 * @param measureLengths Number[] - The measure lengths that have been calculated already.
 * @return Number[]
 */
function addDefaultMeasureLengths (numMeasures, measureLengths) {
    const defaultMeasureLengths = [];

    for (let i = 0; i < numMeasures; i++) {
        const length = measureLengths[i];
        if (length) {
            defaultMeasureLengths.push(length);
        } else {
            defaultMeasureLengths.push(
                Scored.config.measure.length + Scored.config.note.head.width
            );
        }
    }

    return defaultMeasureLengths;
}

export {
    getStaffItems,
    calculateMeasureLengths,
    addDefaultMeasureLengths
};
