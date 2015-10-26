function run () {
	var noteFormat = function (n) {
			var val = n.duration; // replace duration with value
			n.value = val;
			delete n.duration;
			return ["note", n];
		},
		createVoice = function (notes) {
			return palestrina.melody.phrase(
				_.fill(new Array(notes.length), 1),
				notes
			).map(noteFormat);
		},
		renderPhrases = function (topVoice, bottomVoice) {
			var topPhrase = createVoice(topVoice),
				bottomPhrase = createVoice(bottomVoice),
				top = ["voice", {value: 0}, topPhrase],
				bottom = ["voice", {value: 1}, bottomPhrase];

			var layout = scored.layout(["score", {measures: topVoice.length}, [
				["staff", {key: "C", measures: topVoice.length, lineLength: 750}],
				["line", {timeSig: "3/4", voices: [0]}, [["clef", {value: "treble"}]]],
				["line", {timeSig: "3/4", voices: [1]}, [["clef", {value: "bass"}]]]
			]]);

			var events = scored.createEvents([top, bottom]);
			var score = scored.compose(layout, events);

			return scored.render(score);
		};

	var dorianCptU = ["a4", "a4", "g4", "a4", "b4", "c5", "c5", "b4", "d5", "c#5", "d5"];
	var dorianCptL = ["d3", "d3", "a3", "f3", "e3", "d3", "f3", "c4", "d4", "c#4", "d4"];
	var dorianCantus = ["d4", "f4", "e4", "d4", "g4", "f4", "a4", "g4", "f4", "e4", "d4"];

	renderPhrases(dorianCptU, dorianCantus).translate(50, 50);
	renderPhrases(dorianCantus, dorianCptL).translate(50, 300);

	var phrygianCantus = ["e4", "c4", "d4", "c4", "a3", "a4", "g4", "e4", "f4", "e4"];
	var phrygianCptU =   ["b4", "c5", "f4", "g4", "a4", "c5", "b4", "e5", "d5", "e4"];
	var phrygianCptL =   ["e3", "a3", "d3", "e3", "f3", "f3", "c4", "c4", "d4", "e4"];

	renderPhrases(phrygianCptU, phrygianCantus).translate(50, 550);
	renderPhrases(phrygianCantus, phrygianCptL).translate(50, 800);

	// Example with two staves.
	// var layout = scored.layout(["score", {measures: measures}, [
	// 	["staff", {timeSig: "4/4", key: "C", measures: 6, lineLength: lineLength}],
	// 	["staff", {lineLength: lineLength, startMeasure: 6, measures: 5}],
	// 	["line", {voices: [0]}, [["clef", {value: "treble"}]]],
	// 	["line", {voices: [1]}, [["clef", {value: "bass"}]]]
	// ]]);


}
