import _ from "lodash";

import * as paperUtils from "../utils/paperUtils";
import * as timeUtils from "../utils/timeUtils";
import {isLine, isMarking} from "../types";
import engraver from "../engraver";
import constants from "../constants";
import Measure from "./Measure";
import {getTimeContexts} from "../utils/line";
import {groupVoices, getLineItems} from "../utils/staff";
import {map} from "../utils/common";
import {getAccidentalContexts} from "../utils/accidental";

const TYPE = constants.type.staff;

/*
 * @measures - the number of measures on the staff.
 * @startMeasure - the index of the first measure on the stave.
 */
 // TODO: What are the children of a staff now? It's more of a view onto the lines, rather than something with children in it's own right.
 // TODO: Should Staff implement lilypond types such as StaffGroup, ChoirStaff, GrandStaff, and PianoStaff?
 // @param children <Line, Measure, Marking>[] - A marking that is given to the staff will be rendered on all lines. If it is
 // 	given to a line it will only affect that line.
function Staff ({startMeasure=0, measures}, children=[]) {
	this.startMeasure = startMeasure;

	this.measures = measures;

	this.children = children;

	this.lines = _.filter(children, isLine);

	this.markings = _.filter(children, isMarking);
}

Staff.render = function render (staff, voices) {
	const staffGroup = staff.render();

	const measures = Measure.createMeasures(5, staff.markings);

	// get the time contexts
	const lineItems = getLineItems(staff.lines, voices);

	const lineTimes = map((line, items) => getTimeContexts(line, measures, items), staff.lines, lineItems);

	// calculate the accidentals for each line.
	_.each(lineTimes, (times, i) => {
		let accidentals = getAccidentalContexts(times);
		// add accidentals to times
		_.each(times, (time, i) => time.context.accidentals = accidentals[i]);

		staff.lines[i].renderItems(times);
	});

	return staffGroup;
}

Staff.prototype.type = TYPE;

Staff.prototype.render = function (lines, startMeasure=0, numMeasures) {
	const group = this.group = new paper.Group({
		name: TYPE
	});

	// draw each line
	let lineGroups = this.lines.map(line => line.render(1000));

	group.addChildren(lineGroups);

	_.each(lineGroups, (lineGroup, j) => {
		lineGroup.translate([0, 120 * j]);
	});

	group.addChild(engraver.drawStaffBar(lineGroups));

	return group;
};

Staff.prototype.renderMeasures = function (lines, lineGroups, startMeasure, numMeasures) {
	const measureLength = this.lineLength / numMeasures,
		  measureGroups = [];
	for (let i = startMeasure; i < startMeasure + numMeasures; i++) {
		// get the measure from each line
		let measures = _.map(lines, line => line.children[i]);

		// render each measure
		measureGroups.push(_.map(measures, (measure, j) => {
			let lineGroup = lineGroups[j],
				leftBarline = _.last(measureGroups) ? _.last(measureGroups)[j].children.barline : null,
				measureGroup = measure.render(lineGroup, leftBarline, measureLength),
				childGroups = measure.renderChildren(lineGroup, measure.barlines[0]);

			lineGroup.addChild(measureGroup);
			lineGroup.addChildren(childGroups);
			return measureGroup;
		}));
	}
}

export default Staff;
