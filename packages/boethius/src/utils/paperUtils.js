module.exports = {
	extractGroups: function (views) {
		views = _.isArray(views) ? views : [views];
		return _.map(views, function (view) {
			if (view) return view.group;
		});
	},

	randomColor: function () {
		return new paper.Color(_.random(1000)/1000,_.random(1000)/1000,_.random(1000)/1000);
	}
}