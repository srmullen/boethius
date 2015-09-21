function getMarkingLength (measure) {
	return _.reduce(measure.children, (acc, mark) => {
		return mark.getWidth() + acc;
	}, 0);
}

export {
	getMarkingLength
}
