import _ from "lodash";
import F from "fraction.js";

import constants from "../constants";
import {isPitched} from "../types";
import {concat, partitionBy, reductions} from "../utils/common";
import {beam, drawTuplets} from "../engraver";
import {getAverageStemDirection} from "../utils/note";
import {calculateDuration, parseSignature, calculateTupletDuration, sumDurations} from "../utils/timeUtils";
import {divide} from "../utils/barline";

/*
 * @param items - Item[]
 * @param offset - Optional amount of time that will be added to the items times.
 */
function calculateAndSetTimes (items, offset=0) {
    return items.reduce((acc, item) => {
        const previousItem = _.last(acc);

        if (previousItem) {
            item.time = F(previousItem.time).add(calculateDuration(previousItem)).add(offset).valueOf();
        } else {
            item.time = 0;
        }

        return concat(acc, item);
    }, []);
}

function Voice ({value, name, stemDirection}, children=[]) {
    this.name = name;

    this.children = calculateAndSetTimes(children);
    // this.children = children;

    this.stemDirection = stemDirection;
}

Voice.prototype.type = constants.type.voice;

Voice.renderArticulations = function (items) {
    _.each(items, (item) => {
        if (item.drawArticulations) item.drawArticulations();
    });
};

function gt (n1, n2) {
    return n1 > n2;
}

function gte (n1, n2) {
    return n1 >= n2;
}

/*
 * The given times must be a number because a Voice doesn't know about the measures or beats.
 * @param frm - Time to start collecting items at.
 * @param to - Time up to but not including collected items.
 * @param inclusive - Boolean, true if to time is to be included in returned items.
 * @return Item[]
 */
Voice.prototype.getTimeFrame = function getTimeFrame(frm, to, inclusive) {
    const timeFrame = [];
    const comparison = inclusive ? gt : gte;
    for (let i = 0; i < this.children.length; i++) {
        let item = this.children[i];
        if (comparison(item.time, to)) {
            break;
        } else if (item.time >= frm) {
            timeFrame.push(item);
        }
    }
    return timeFrame;
};

Voice.prototype.equals = function (voice) {
    return (
        this.type === voice.type &&
        this.name === voice.name &&
        this.stemDirection === voice.stemDirection &&
        this.children.length === voice.children.length &&
        _.every(this.children, (child, i) => child.equals(voice.children[i]))
    );
};

Voice.prototype[Symbol.iterator] = Voice.prototype.iterate = function () {
    let i = -1;
    return {
        items: this.children,
        next: function next () {
            i++;
            const item = this.items[i];

            if (!item) return {done: true};

            const time = item.time;

            const items = [];
            while (this.items[i+1] && time === this.items[i+1].time) {
                items.push(this.items[i+1]);
                i++;
            };

            return {
                done: false,
                value: [item, ...items]
            };
        }
    }
};

/*
 * Mutates children array.
 * Breaks notes extending over given time into two notes.
 * @params [time] - Times at which to break durationed items.
 */
Voice.prototype.breakDurations = function (times) {
    let timeIndex = 0;
    const children = this.children.reduce((acc, item) => {
        if (item.time >= times[timeIndex]) {
            timeIndex = _.findIndex(times, time => time > item.time);
        }
        return acc.concat(divide(times[timeIndex], item));
    }, []);
    this.children = children;
};

export default Voice;
