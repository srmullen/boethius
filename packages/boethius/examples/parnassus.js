function run () {
	var measureLength = 75,
		measures = 12,
		lineLength = measureLength * measures;

	var notes = palestrina.melody.phrase([1, 1, 1, 1], ["c4", "d4", "e4", "f4"]).map(function (n) {
			return ["note", n];
		}),
		cantusFirmus = ["voice", {value: 0, readOnly: true}, notes];

	var layout = scored.layout(
		layout = ["staff", {staves: 1, timeSig: "4/4", key: "C", measures: 12, lineLength: lineLength, measureLength: measureLength}, [
			["line", {measures: 12, line: 0}, [["clef", {value: "treble"}]]],
			["line", {measures: 12, line: 1}, [["clef", {value: "bass"}]]]
		]]);
	// var layout = scored.layout(["line", {measures: 4}, [["clef"]]]);
	// var events = scored.createEvents(cantusFirmus);
	var events = scored.createEvents([]);
	var score = scored.compose(layout, events);

	scored.render(score).translate(50, 50);
	console.log(events);
}
