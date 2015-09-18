// var _ = require("../bower_components/lodash/lodash.min");
var _ = require("lodash");

var Config = (function () {
	var FONT_SIZE = 32,
		FONT_FAMILY = "gonville";

	var defaultConfig = {
		fontSize: FONT_SIZE,
		fontFamily: FONT_FAMILY,
		note: {
			minWidth: 45,
			head: {
				width: fontSizeToNoteHeadWidth(FONT_SIZE),
				height: fontSizeToNoteHeadHeight(FONT_SIZE),
				yOffset: fontSizeToNoteHeadYOffset(FONT_SIZE)
			},
			accidental: {
				xOffset: fontSizeToNoteHeadWidth(FONT_SIZE),
				yOffset: -fontSizeToNoteHeadHeight(FONT_SIZE)
			}
		},
		layout: {
			lineSpacing: null,
			lineLength: 1000,
			lineDistance: 100

		},
		maxBarAngle: 45, // angle in degrees. angle can range from -maxBarAngle to +maxBarAngle
		minStemLength: 10
	}

	function Config (configuration) {

		var config = _.extend({}, defaultConfig, configuration);

		return processConfig(config);
	};

	function processConfig (config) {
		config.note.head.width = fontSizeToNoteHeadWidth(config.fontSize);
		config.note.head.yOffset = fontSizeToNoteHeadYOffset(config.fontSize);
		config.layout.lineSpacing = config.lineSpacing = fontSizeToLineSpacing(config.fontSize, config.fontFamily);

		return config
	};

	function fontSizeToLineSpacing(fontSize, fontFamily) {
		// Can't access paper at this point because the context hasn't been setup.
		// The height of the noteHead font is 1.2 * fontSize. This was figured out just by experimenting in the browser console.
		// var height = fontSize * 1.2;
		var height = fontSize;

		return (5 * height) / 18;
	};

	/*
	 * returns the y distance between the center of the font bounds and the center of the note head.
	 */
	function fontSizeToNoteHeadYOffset (fontSize) {
		return 9; // FIXME: This will not scale. Needs to change based on different font sizes.
	};

	function fontSizeToNoteHeadWidth (fontSize) {
		return 13;
	};

	function fontSizeToNoteHeadHeight (fontSize) {
		return 10;
	}

	return Config;
})();

module.exports = Config;
