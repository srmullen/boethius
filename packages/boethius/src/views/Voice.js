import _ from "lodash";

import constants from "../constants";
import {concat} from "../utils/common";
import * as placement from "../utils/placement";
import * as lineUtils from "../utils/line";
import {calculateDuration} from "../utils/timeUtils";

function Voice ({value}, children=[]) {
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
}

Voice.prototype.type = constants.type.voice;

Voice.prototype.renderChildren = function () {
    return this.children.map((child, i) => {
        return child.render();
    });
}

export default Voice;
