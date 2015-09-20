function run () {
	var measureLength = 75,
		measures = 12,
		lineLength = measureLength * measures;

	var layout = ["staff", {timeSig: "4/4", key: "C", clef: "treble", lineLength: lineLength, measureLength: measureLength}, [
			["line", {measures: 12, line: 0}, [["clef", {value: "treble"}]]],
			["line", {measures: 12, line: 1}, [["clef", {value: "treble"}]]]
		]],
		notes = Scored.melody.phrase([1, 1, 1, 1], ["c4", "d4", "e4", "f4"]).map(function (n) {
			return ["note", n];
		}),
		cantusFirmus = ["voice", {value: 1, readOnly: true}, notes];

	scored.render(layout);
	var events = scored.createEvents({}, [], cantusFirmus);
	console.log(events);
	// scored.renderEvents(events);
}
