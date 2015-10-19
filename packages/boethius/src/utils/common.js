import _ from "lodash";
import constants from "../constants";

const debugEvents = {
	onMouseEnter: () => {
		console.log("entered");
	},

	onMouseLeave: () => {
		console.log("left");
	},

	onMouseDown: () => {
		console.log("down");
	},

	onMouseUp: () => {
		console.log("up");
	}
}

function getEventHandlers (group) {
	if (group.name === constants.type.note ||
		group.name === constants.type.rest ||
		group.name === constants.type.clef ||
		group.name === constants.type.key  ||
		group.name === constants.type.timeSig) {
		return {
			onMouseEnter: () => {
				let bounds = group.children.bounds || group.bounds;
				bounds.fillColor = "blue";
				bounds.opacity = 0.2;
			},

			onMouseLeave: () => {
				let bounds = group.children.bounds || group.bounds;
				bounds.fillColor = "#FFF";
				bounds.opacity = 0;
			},

			onMouseDown: () => {
				let bounds = group.children.bounds || group.bounds;
				bounds.fillColor = "red";
				// console.log(item.serialize());
			},

			onMouseUp: () => {
				let bounds = group.children.bounds || group.bounds;
				bounds.fillColor = "blue";
			}
		}
	} else {
		return debugEvents;
	}
}

function addEvents (group) {
	_.extend(group, getEventHandlers(group));
}

function debugGroupEvents (group) {
	_.extend(item.group, debugEvents);
}

function concat (a, b) {
	return a.concat([b]);
}

function doTimes (times, fn) {
	var ret = [], i = 0;
	for (; i < times; i++) {
		ret.push(fn(i));
	}
	return ret;
}

function serialize (item) {
	return _.filter([item.type, item, _.map(item.children, serialize)], v => _.size(v));
}

export {
	concat,
	doTimes,
	addEvents,
	debugGroupEvents,
	serialize
}
