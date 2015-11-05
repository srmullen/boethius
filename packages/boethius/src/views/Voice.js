import _ from "lodash";

import constants from "../constants";
import {concat} from "../utils/common";
import * as placement from "../utils/placement";
import * as lineUtils from "../utils/line";
import * as noteUtils from "../utils/note";
import {calculateDuration} from "../utils/timeUtils";
import Note from "./Note";

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
 * @param bLine - point representing leftmost starting point of center line
 */
Voice.prototype.renderNoteDecorations = function (bLine) {
    return this.children.map(child => {
        if (child.type === constants.type.note) {
            child.drawLegerLines(bLine, Scored.config.lineSpacing);
            if (child.needsStem()) {
                let stemDirection = this.stemDirection || noteUtils.getStemDirection(child, bLine),
        			stemPoint = noteUtils.defaultStemPoint(child, noteUtils.getStemLength(child), stemDirection);
        		child.drawStem(stemPoint, stemDirection);
        		child.drawFlag();
            }
        }
    });
}

export default Voice;
