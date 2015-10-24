function run () {
	var measureLength = 75,
		measures = 11,
		lineLength = measureLength * measures;

	var noteFormat = function (n) {
		var val = n.duration; // replace duration with value
		n.value = val;
		delete n.duration;
		return ["note", n];
	},
		createVoice = function (notes) {
			return palestrina.melody.phrase(
				_.fill(new Array(notes.length), 1),
				dorianCpt
			).map(noteFormat);
		};

	var dorianCpt = ["a4", "a4", "g4", "a4", "b4", "c5", "c5", "b4", "d5", "c#5", "d5"];

	var dorianCantus = ["d4", "f4", "e4", "d4", "g4", "f4", "a4", "g4", "f4", "e4", "d4"];

	var dorianCptPhrase = createVoice(dorianCpt),
		dorianCantusPhrase = createVoice(dorianCantus),
		counterpoint = ["voice", {value: 0}, dorianCptPhrase],
		cantusFirmus = ["voice", {value: 1}, dorianCantusPhrase];


	var layout = scored.layout(["score", {measures: measures}, [
		["staff", {timeSig: "4/4", key: "C", measures: 6, lineLength: lineLength}],
		["staff", {lineLength: lineLength, startMeasure: 6, measures: 5}],
		["line", {voices: [0]}, [["clef", {value: "treble"}]]],
		["line", {voices: [1]}, [["clef", {value: "bass"}]]]
	]]);

	var events = scored.createEvents([counterpoint, cantusFirmus]);
	var score = scored.compose(layout, events);

	scored.render(score).translate(50, 50);
}
