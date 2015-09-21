
function MoveTool () {
	var tool = new paper.Tool(),
		downPoint = null;

	tool.activate();

	tool.onMouseDown = function (event) {
		downPoint = event.point;
	}

	tool.onMouseDrag = function (event) {
		var vector = downPoint.subtract(event.point);
		paper.view.center = paper.view.center.add(vector);
	}

	tool.onMouseUp = function () {
		downPoint = null;
	}
}

export default MoveTool;
