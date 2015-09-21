"use strict";

/**
 * The Context is the base file for a canvas context.
 */
const Context = function (canvas) {

	this.background = paper.project.layers[0];
	this.foreground = new paper.Layer();
	this.background.activate();
}

export default Context;
