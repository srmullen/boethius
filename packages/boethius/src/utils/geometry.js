/*
 * Given an x coordinate, fulcrum and vector, returns the point on the line
 */
function getLinePoint (x, fulcrum, vector) {
	var shift = x - fulcrum.x;
	return fulcrum.add(shift, vector.y / vector.x * shift);
}

export {
    getLinePoint
}
