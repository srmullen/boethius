import _ from "lodash";

import constants from "../constants";
import {isNote, isChord} from "../types";
import {concat} from "../utils/common";
import * as lineUtils from "../utils/line";
import {calculateDuration, getMeasureNumber} from "../utils/timeUtils";
import Note from "./Note";
import Measure from "./Measure";
import {getCenterLineValue} from "./Clef";

function Voice ({value, stemDirection}, children=[]) {
    this.value = value;

    this.children = children.reduce((acc, item) => {
        let previousItem = _.last(acc);

        if (previousItem) {
            item.time = previousItem.time + (calculateDuration(previousItem) || 0);
        } else {
            item.time = 0;
        }

        return concat(acc, item);
    }, []);

    this.stemDirection = stemDirection;
}

Voice.prototype.type = constants.type.voice;

Voice.prototype.renderChildren = function () {
    return this.children.map((child, i) => {
        return child.render();
    });
}

/*
 * @param line - Line that the voice is being rendered on.
 * @param measures - Measure[]
 */
Voice.prototype.renderDecorations = function (line, measures) {
    // group children by measures
    let b = lineUtils.b(line.group),
        itemsByMeasure = _.groupBy(this.children, child => getMeasureNumber(measures, child.time)),
        stemDirection = this.stemDirection;

    _.map(itemsByMeasure, (items, measureNum) => {
        // let notes = _.filter(items, item => item.type === constants.type.note);
        const pitched = _.filter(items, item => isNote || isChord);
        pitched.map(note => note.drawLegerLines(b, Scored.config.lineSpacing));
    });

    // beam the notes
    _.map(itemsByMeasure, (items, measure) => {
        let context = line.contextAt(measures, {measure: Number.parseInt(measure)});
        let centerLineValue = getCenterLineValue(context.clef);
        let beamings = Note.findBeaming(context.timeSig, items);
        let beams = _.compact(beamings.map(noteGrouping => Note.renderDecorations(noteGrouping, centerLineValue, this.stemDirection)));
        if (beams && beams.length) {
            line.group.addChildren(beams);
        }
    });
}

export default Voice;
