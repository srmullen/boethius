import paper from "paper";
import _ from "lodash";

function extractGroups (views) {
	views = _.isArray(views) ? views : [views];
	return _.map(views, function (view) {
		if (view) return view.group;
	});
}

function randomColor () {
	return new paper.Color(_.random(1000)/1000,_.random(1000)/1000,_.random(1000)/1000);
}

export {
	extractGroups,
	randomColor
};
