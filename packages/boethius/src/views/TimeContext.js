import _ from "lodash";
/*
 * Representation of all items across lines that are at a given time.
 * Internal class. Not exposed as Boethius view.
 * @param lines - array of lineTimeContexts
 */
function TimeContext (lines) {

}

TimeContext.prototype.render = function () {
    const group = new paper.Group();

    return group;
}

export default TimeContext;
