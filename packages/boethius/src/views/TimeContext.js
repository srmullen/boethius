import _ from "lodash";

import Line from "./Line";

/*
 * Representation of all items across lines that are at a given time.
 * Internal class. Not exposed as Boethius view.
 * @param lines - array of lineTimeContexts
 */
function TimeContext (timeContext) {
    this.lines = timeContext;
    this.time = _.find(timeContext, line => !!line).time;
}

TimeContext.prototype.render = function () {
    const group = new paper.Group();

	const itemGroups = _.map(this.lines, (lineTimeContext) => {
		if (lineTimeContext) {
			return Line.renderTime(lineTimeContext);
		}
	});

    _.each(itemGroups, items => group.addChildren(items));

    return group;
}

export default TimeContext;
