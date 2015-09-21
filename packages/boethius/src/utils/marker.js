// function drawMarker (cursor, lines, color) {
// 	var xPos = lines[0].group.bounds.left + cursor,
// 		top = lines[0].group.bounds.top,
// 		bottom = _.last(lines).group.bounds.bottom;
//
// 	var cursorLine = new paper.Path([xPos, top], [xPos, bottom]);
// 	cursorLine.strokeColor = color;
// 	cursorLine.strokeWidth = 2;
// 	return cursorLine;
// }
//
// function update (marker, xPos, offset=0) {
// 	marker.position.x = offset + xPos;
// }
//
// module.exports = {
// 	drawMarker: drawMarker,
// 	update: update
// }
