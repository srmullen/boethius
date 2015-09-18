// var Line = require("./views/Line"),
// 	StaffView = require("./views/Staff"),
// 	Measure = require("./views/Measure"),
// 	Clef = require("./views/Clef"),
// 	Key = require("./views/Key"),
// 	TimeSignature = require("./views/TimeSignature");
//
// var layout = {
//
// 	staff: function (children, context) {
// 		var item = new StaffView(context);
// 		item.render(children);
// 		return item;
// 	},
//
// 	line: function (children, context) {
// 		var item = new Line(context, children);
// 		item.render();
// 		return item;
// 	},
//
// 	measure: function (children, context) {
// 		var item = new Measure(context, children);
// 		// item.render();
// 		return item;
// 	},
//
// 	key: function (_children, {measure=0, beat=0, value}) {
// 		return new Key({measure: measure, beat: beat, value: value});
// 	},
//
// 	clef: function (_children, {measure=0, beat=0, value}) {
// 		return new Clef({measure: measure, beat: beat, value: value});
// 	},
//
// 	timeSig: function (_children, {measure=0, beat=0, value}) {
// 		return new TimeSignature({measure: measure, beat: beat, value: value});
// 	}
// }
//
// module.exports = layout;
