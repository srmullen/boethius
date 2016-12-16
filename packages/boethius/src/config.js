import _ from "lodash";

const Config = (function () {
	const FONT_SIZE = 32;
	const FONT_FAMILY = "gonville";

	const defaultConfig = {
		fontSize: FONT_SIZE,
		fontFamily: FONT_FAMILY,
		shortestDuration: 0.0625, // sixteenth note
		// shortestDuration: 0.03125,
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
			lineDistance: 100,
			stepSpacing: null

		},
		measure: {
			length: 100
		},
		maxBeamAngle: 13, // angle in degrees. angle can range from -maxBeamAngle to +maxBeamAngle
		minStemLength: 10
	};

	function Config (configuration) {

		const config = _.extend({}, defaultConfig, configuration);

		return processConfig(config);
	}

	function processConfig (config) {
		config.note.head.width = fontSizeToNoteHeadWidth(config.fontSize);
		config.note.head.yOffset = fontSizeToNoteHeadYOffset(config.fontSize);
		config.layout.lineSpacing = config.lineSpacing = fontSizeToLineSpacing(config.fontSize, config.fontFamily);
		config.layout.stepSpacing = config.stepSpacing = config.layout.lineSpacing / 2;

		return config;
	}

	function fontSizeToLineSpacing(fontSize) {
		// Can't access paper at this point because the context hasn't been setup.
		// The height of the noteHead font is 1.2 * fontSize. This was figured out just by experimenting in the browser console.
		// var height = fontSize * 1.2;
		const height = fontSize;

		return (5 * height) / 18;
	}

	/*
	 * @param fontSize - unimplemented
	 * returns the y distance between the center of the font bounds and the center of the note head.
	 */
	function fontSizeToNoteHeadYOffset () {
		return 9; // FIXME: This will not scale. Needs to change based on different font sizes.
	}

	/*
	 * @param fontSize - unimplemented
	 */
	function fontSizeToNoteHeadWidth () {
		return 10.5;
	}

	/*
	 * @param fontSize - unimplemented
	 */
	function fontSizeToNoteHeadHeight () {
		return 10;
	}

	return Config;
})();

export default Config;
