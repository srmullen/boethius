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

// Currently unused.
function drawTimeBounds (items, children) {
	var groups = _.filter(paperUtils.extractGroups(items), x => x);

	if (!groups.length) {return;}

	var furthestLeft = _.min(groups, function (group) {
		return group.bounds.left;
	});

	var minDur;
	if (!items[0].context.duration) { // test if its a layout event
		minDur = _.max(groups, function (group) {
			return group.bounds.right;
		});
	} else {
		minDur = _.min(items, function (item) {
			return item.context.duration;
		}).group;
	}


	var left = furthestLeft.bounds.left,
		right = minDur.bounds.right;

	// use the lines for top and bottom
	var top = children[0].group.bounds.top,
		bottom = _.last(children).group.bounds.bottom;

	var bounds = new paper.Path.Rectangle(new paper.Point(left, top), new paper.Point(right, bottom));

	// bounds.strokeColor = paperUtils.randomColor();
	// bounds.fillColor = paperUtils.randomColor();
	// bounds.opacity = 0.3;
	// bounds.strokeWidth = 2;

	return bounds;
}


export {
	extractGroups,
	randomColor
}
