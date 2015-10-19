function run () {
	var measureLength = 75,
		measures = 11,
		lineLength = measureLength * measures;

	var notes = palestrina.melody.phrase([1, 1, 1, 1], ["c4", "d4", "e4", "f4"]).map(function (n) {
			var val = n.duration; // replace duration with value
			n.value = val;
			delete n.duration;
			return ["note", n];
		}),
		cantusFirmus = ["voice", {value: 1, readOnly: true}, notes];

	var layout = scored.layout(
		layout = ["staff", {staves: 1, timeSig: "4/4", key: "C", measures: measures, lineLength: lineLength, measureLength: measureLength}, [
			["line", {line: 0}, [["clef", {value: "treble"}]]],
			["line", {line: 1}, [["clef", {value: "bass"}]]]
		]]);
	// var layout = scored.layout(["line", {measures: 4}, [["clef"]]]);
	var events = scored.createEvents(cantusFirmus);
	// var events = scored.createEvents([]);
	var score = scored.compose(layout, events);

	scored.render(score).translate(50, 50);
	console.log(events);
	console.log(notes);
	console.log(score);
}
