import * as paperUtils from "../utils/paperUtils";
import * as timeUtils from "../utils/timeUtils";
import {isLine, isMarking} from "../types";
import engraver from "../engraver";
import constants from "../constants";
import Measure from "./Measure";
import _ from "lodash";


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

	this.voices = new Map();

	// setup voiceMap
	for (let i = 0, lineNum = 0; i < children.length; i++) {
		let voices = children[i].voices || 1;
		for (let j = 0; j < voices; j++) {
			this.voices.set(lineNum, children[i]);
			lineNum++;
		}
	}
}

Staff.render = function render (staff, voices) {
	let staffGroup = staff.render();
	let measures = Measure.createMeasures(5, staff.markings);
	return staffGroup;
}

Staff.prototype.type = TYPE;

Staff.prototype.getLine = function (voice) {
	return this.voices.get(voice) || this.children[0];
}

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
