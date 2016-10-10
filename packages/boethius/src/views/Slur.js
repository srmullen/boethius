import {filter} from "lodash";

import {partitionBy} from "../utils/common";
import {slur} from "../utils/note";

/*
 * @param systemBreak - true if slur is across systems.
 */
function Slur ({systemBreak}, children = []) {
    this.systemBreak = systemBreak;
    this.children = children;
}

Slur.of = (context, children) => {
    return new Slur(context, children);
};

Slur.prototype.render = function () {
    return slur(this.children);
};

Slur.groupSlurs = function (items) {
    return _.filter(partitionBy(items, item => item.slur), ([item]) => !!item.slur);
};

export default Slur;
