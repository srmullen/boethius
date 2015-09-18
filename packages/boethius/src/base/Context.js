"use strict";

/**
 * The Context is the base file for a canvas context.
 */
var Context = function (canvas) {

	this.background = paper.project.layers[0];
	this.foreground = new paper.Layer();
	this.background.activate();
}

module.exports = Context;