"use strict";

function HighlightTool (options) {

	_.each(options.views, this.addView, this);

	HighlightTool.tool.onMouseMove = $.proxy(function (event) {

		var toHighlight = this.getViewToHighlight(event.item);

		if (toHighlight) {
			this.highlight(toHighlight);
		};
		this.removeHighlight(toHighlight);
	}, this);

	// The view to highlight on hover.
	// Color is optional.
	var addView = function (view, color) {
		var decoratedView = this.decorateView(view, color);

		var gid = view.group.id;
		HighlightTool.views[gid] = decoratedView;
	}

	var highlight = function (toHighlight) {
		var group = toHighlight.view.group;

		group.children[0].fillColor = toHighlight.color;
		group.children[0].opacity = 0.5;
		HighlightTool.highlighted[group.id] = group;
	}

	var removeHighlight = function (toHighlight) {
		_.each(HighlightTool.highlighted, function (value, key) {
			if (toHighlight && toHighlight.view.group.id == key) {} else { // uses double equals because key must be a string
				value.children[0].opacity = 0;
				delete HighlightTool.highlighted[key];
			};
		}, this);
	}

	var decorateView = function (view, color) {
		var viewObj = {
			"LineView": {color: 'green'},
			"MeasureView": {color: "blue"},
			"NoteView": {color: 'red'}
		}[view.name];

		viewObj.view = view;

		return viewObj;
	}

	var getViewToHighlight = function (item) {
		if (item) {
			return HighlightTool.views[item.id];
		};
	}

	var toHighlight = function (item) {
		if (item && HighlightTool.views[item.id])
			return true;
		return false;
	}

	var isHighlighted = function (item) {
		if (item && HighlightTool.highlighted(item.id))
			return true;
		return false;
	}

}

HighlightTool.views = {};
HighlightTool.highlighted = {};
HighlightTool.tool = new paper.Tool();

export {HighlightTool};
