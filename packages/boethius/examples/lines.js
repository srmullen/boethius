var line;
function run () {
	// testMarkings();
	// testBeatStructures();

	// simpleLine().translate(25, 50);

	testStacatoLegato().translate(25, 50);
	testDots().translate(25, 150);
	testDynamics().translate(25, 250);

	// eighthBeamings().translate(25, 50);
	// sixteenthBeamings().translate(25, 150);
	// testAccidentals("c").translate(25, 250);
	// testTimeSigs().translate(25, 350);
	//
	// testChords().translate(25, 50);
	// testChordsTwoVoices().translate(25, 150);
	// testTriplets().translate(25, 250);

	// renderingNotesOnLine().translate(25, 50);
	// oneVoice().translate(25, 150);
	// twoVoices().translate(25, 250);
	// testTripletsTwoVoices().translate(25, 350);

	// testMeasureRendering().translate(25, 50);
	// testSlurs().translate(25, 50);
}

function testClefKeyTimeSig (clefValue, keyValue, timeSigValue) {
	var clef = scored.clef({value: clefValue, measure: 0});
	var key = scored.key({value: keyValue, measure: 0});
	var timeSig = scored.timeSig({value: timeSigValue, measure: 0});
	var line = scored.line({}, [clef, key, timeSig]);
	return scored.render(line, {});
}

function testKey (key, yPos) {
	testClefKeyTimeSig("treble", key, "4/4").translate(25, yPos);
	testClefKeyTimeSig("bass", key, "4/4").translate(200, yPos);
	testClefKeyTimeSig("alto", key, "4/4").translate(350, yPos);
	testClefKeyTimeSig("tenor", key, "4/4").translate(500, yPos);
}

function testMarkings () {
	var yPos = 50;

	testKey("C", yPos); yPos += 75;
	testKey("G", yPos); yPos += 75;
	testKey("D", yPos); yPos += 75;
	testKey("A", yPos); yPos += 75;
	testKey("E", yPos); yPos += 75;
	testKey("B", yPos); yPos += 75;
	testKey("F#", yPos); yPos += 75;
	testKey("C#", yPos); yPos += 75;
	testKey("F", yPos); yPos += 75;
	testKey("Bb", yPos); yPos += 75;
	testKey("Eb", yPos); yPos += 75;
	testKey("Ab", yPos); yPos += 75;
	testKey("Db", yPos); yPos += 75;
	testKey("Gb", yPos); yPos += 75;
	testKey("Cb", yPos); yPos += 75;
}

function fourBars () {
	var treble = scored.clef({value: "treble", measure: 0}),
		bass = scored.clef({value: "bass", measure: 1}),
		alto = scored.clef({value: "alto", measure: 2}),
		tenor = scored.clef({value: "tenor", measure: 3}),
		line = scored.line({measures: 4}, [treble, bass, alto, tenor]);

	scored.render(line, {length: 1000}).translate(20, 400);
	return line;
}

function renderingNotesOnLine () {
	var trebleLine = scored.line({}, [scored.clef({measure: 0}),
									  scored.key({value: "C", measure: 0}),
									  scored.timeSig({value: "4/4", measure: 0}),
									  scored.clef({value: "bass", measure: 1})
								  ]);
	var voice = scored.voice({}, [scored.note({pitch: "a4", value: 8}), scored.note({pitch: "c5", value: 4, dots: 1}), scored.note({pitch: "b4", value: 2}),
								  scored.note({pitch: "c5", value: 2}), scored.note({pitch: "d4", value: 4}), scored.rest({value: 4})]);

	// return scored.render(trebleLine, {length: 800, voices: [voice], numMeasures: 2});
	return scored.render(trebleLine, {voices: [voice], numMeasures: 2});
}

function simpleLine () {
	var trebleLine = scored.line({}, [scored.clef({measure: 0}),
									  scored.key({measure: 0}),
									  scored.timeSig({value: "4/4", measure: 0})
								  ]);
	var voice = scored.voice({}, [scored.note({pitch: "a4", value: 4}), scored.note({pitch: "a4", value: 4}),
								  scored.note({pitch: "a4", value: 4}), scored.note({pitch: "a4", value: 4}),
								  scored.note({pitch: "a4", value: 1})
							  ]);

	return scored.render(trebleLine, {length: 400, voices: [voice], numMeasures: 2});
}

function oneVoice () {
	var line = scored.line({}, [scored.clef({value: "treble", measure: 0}),
								scored.key({value: "C", measure: 0}),
								scored.timeSig({value: "4/4", measure: 0}),
								scored.clef({value: "bass", measure: 2})
							]);

	var measure1 = palestrina.melody.phrase(_.fill(new Array(16), 16),
			["a4", "b4", "a4", "b4", "a4", "b4", "a4", "b4", "a4", "b4", "a4", "b4", "a4", "b4", "a4", "b4"]),
		measure2 = palestrina.melody.phrase(_.fill(new Array(8), 8),
			["a4", "b4", "a4", "b4", "a4", "b4", "a4", "b4"]),
		measure3 = palestrina.melody.phrase(_.fill(new Array(4), 4),
			["a4", "b4", "a4", "b4"]),
		measure4 = palestrina.melody.phrase(_.fill(new Array(2), 2),
			["a4", "b4"]),
		measure5 = [{duration: 1}];

	var voice = scored.voice({}, _.map([].concat(measure1, measure2, measure3, measure4, measure5), function (n) {
		return scored.note({value: n.duration, pitch: n.pitch});
	}));

	return scored.render(line, {length: 1000, voices: [voice], numMeasures: 5});
}

function twoVoices () {
	var line = scored.line({}, [scored.clef({value: "treble", measure: 0}),
								scored.key({value: "C", measure: 0}),
								scored.timeSig({value: "4/4", measure: 0})]);
	var notes1 = _.fill(new Array(16), 16).concat(_.fill(new Array(8), 8)).concat(_.fill(new Array(4), 4)).concat(_.fill(new Array(2), 2)).concat(_.fill(new Array(1), 1));
	var notes2 = _.fill(new Array(4), 4).concat(
		_.fill(new Array(2), 2)).concat(
			_.fill(new Array(8), 8)).concat(
				_.fill(new Array(8), 8)).concat(
					_.fill(new Array(16), 16));
	var voice1 = scored.voice({stemDirection: "up"}, _.map(notes1, function (n) {return scored.note({value: n, pitch: "c#5"})}));
	var voice2 = scored.voice({stemDirection: "down"}, _.map(notes2, function (n) {return scored.note({value: n})}));

	return scored.render(line, {length: 1300, voices: [voice1, voice2], numMeasures: 5});
}

function eighthBeamings () {
	var line = scored.line({}, [scored.clef({value: "treble", measure: 0}),
								scored.key({measure: 0}),
								scored.timeSig({value: "4/4", measure: 0})
							]);

	var measure1 = palestrina.melody.phrase(_.fill(new Array(8), 8),
			["g3", "g3", "d6", "d6", "a4", "b4", "c5", "d5"]),
		measure2 = palestrina.melody.phrase(_.fill(new Array(8), 8),
			["a4", "ab4", "a4", "a#4", "a4", "e4", "f4", "g4"]),
		measure3 = palestrina.melody.phrase(_.fill(new Array(8), 8),
			["g3", "a3", "b3", "c4", "d4", "e4", "f4", "g4"]),
		measure4 = palestrina.melody.phrase(_.fill(new Array(8), 8),
			["g4", "a4", "d5", "c5", "e5", "e4", "d5", "f4"]);

	var voice = scored.voice({}, _.map([].concat(measure2, measure1, measure3, measure4), function (n) {
		return scored.note({value: n.duration, pitch: n.pitch});
	}));

	return scored.render(line, {voices: [voice], numMeasures: 4});
}

function sixteenthBeamings () {
	var line = scored.line({}, [scored.clef({value: "treble", measure: 0}),
								scored.key({measure: 0}),
								scored.timeSig({value: "4/4", measure: 0})
							]);

	var measure1 = palestrina.melody.phrase(_.fill(new Array(16), 16),
			["g4", "a4", "b4", "c5", "a4", "b4", "c5", "d5", "d5", "c5", "b4", "a4", "c5", "b4", "a4", "g4"]),
		measure2 = palestrina.melody.phrase(_.fill(new Array(16), 16),
			["a4", "a#4", "b4", "ab4", "d4", "e4", "f4", "g4", "a4", "b4", "c5", "d5", "e5", "f5", "g5", "a5"]),
		measure3 = palestrina.melody.phrase(_.fill(new Array(16), 16),
			["g3", "a3", "b3", "c4", "d4", "e4", "f4", "g4", "a4", "b4", "c5", "d5", "e5", "f5", "g5", "a5"].reverse()),
		measure4 = palestrina.melody.phrase(_.fill(new Array(16), 16),
			["g4", "a4", "d5", "c5", "e5", "e4", "d5", "f4", "e4", "d5", "f4", "e5", "g3", "g4", "g5", "b4"]);

	// broken beamings
	var measure5 = palestrina.melody.phrase(
		[16, 16, 8, 16, 8, 16, 8, 16, 16, 16, 8, 16],
		_.fill(new Array(16), "a4")
	)

	var voice = scored.voice({}, _.map([].concat(measure5, measure2, measure1, measure4, measure3), function (n) {
		return scored.note({value: n.duration, pitch: n.pitch});
	}));

	return scored.render(line, {voices: [voice], numMeasures: 5});
}

function testAccidentals (key) {
	var line = scored.line({}, [scored.clef({value: "treble", measure: 0}),
								scored.key({value: key, measure: 0}),
								scored.timeSig({value: "4/4", measure: 0})
							]);
	var n = scored.note; // just to shorten the voice declaration
	var voice = scored.voice({}, [

		n({pitch: "c#4", value: 16}), n({pitch: "d4", value: 16}), n({pitch: "eb4", value: 16}), n({pitch: "c4", value: 16}),
		n({pitch: "c#4", value: 16}), n({pitch: "c4", value: 16}), n({pitch: "c4", value: 16}), n({pitch: "c4", value: 16}),
		n({pitch: "e4", value: 16}), n({pitch: "c4", value: 16}), n({pitch: "c4", value: 16}), n({pitch: "c4", value: 16}),
		n({pitch: "eb4", value: 16}), n({pitch: "c4", value: 16}), n({pitch: "c4", value: 16}), n({pitch: "c4", value: 16}),

		n({pitch: "e4", value: 16}), n({pitch: "eb4", value: 16}), n({pitch: "e4", value: 16}), n({pitch: "eb4", value: 16}),
		n({pitch: "c#4", value: 16}), n({pitch: "c#4", value: 16}), n({pitch: "c4", value: 16}), n({pitch: "c4", value: 16}),
		n({pitch: "e4", value: 16}), n({pitch: "c4", value: 16}), n({pitch: "c4", value: 16}), n({pitch: "c4", value: 16}),
		n({pitch: "eb4", value: 16}), n({pitch: "eb5", value: 16}), n({pitch: "bb4", value: 16}), n({pitch: "c#4", value: 16}),

	]);

	return scored.render(line, {voices: [voice], numMeasures: 2});
}

function testTimeSigs () {
	var line = scored.line({}, [scored.clef({value: "bass", measure: 0}),
								scored.key({value: "c", measure: 0}),
								scored.timeSig({value: "3/4", measure: 0}),
								scored.timeSig({value: "4/4", measure: 2}),
								scored.timeSig({value: "3/4", measure: 4})
							]);
	var n = scored.note; // just to shorten the voice declaration
	var voice = scored.voice({}, [

		n({pitch: "c#4", value: 4}), n({pitch: "d4", value: 4}), n({pitch: "eb4", value: 4}), n({pitch: "c4", value: 4}),
		n({pitch: "c#4", value: 4}), n({pitch: "c4", value: 4}), n({pitch: "c4", value: 4}), n({pitch: "c4", value: 4}),
		n({pitch: "e4", value: 4}), n({pitch: "c4", value: 4}), n({pitch: "c4", value: 4}), n({pitch: "c4", value: 4}),

		// n({pitch: "c#4", value: 16}), n({pitch: "c4", value: 16}), n({pitch: "c4", value: 16}), n({pitch: "c4", value: 16}),
		// n({pitch: "e4", value: 16}), n({pitch: "c4", value: 16}), n({pitch: "c4", value: 16}), n({pitch: "c4", value: 16}),

		n({pitch: "c#4", value: 4}), n({pitch: "c4", value: 4}), n({pitch: "c4", value: 4}), n({pitch: "c4", value: 4}),
		n({pitch: "e4", value: 4}), n({pitch: "c4", value: 4}), n({pitch: "c4", value: 4}), n({pitch: "c4", value: 4}),

		scored.rest({value: 4}), scored.rest({value: 4}), scored.rest({value: 4})
	]);

	return scored.render(line, {voices: [voice], numMeasures: 7});
}

function testChords () {
	var trebleLine = scored.line({}, [scored.clef({measure: 0}),
									  scored.timeSig({value: "4/4", measure: 0}),
									  scored.key({value: "C", measure: 0})
								  ]);
	var c = scored.chord;
	var n = scored.note;
	var voice = scored.voice({}, [
		c({value: 8}, ["c4", "e4", "g4"]), c({value: 8}, ["d4", "f4", "a4"]), n({pitch: "d5"}), c({dots: 1}, ["d4", "e4", "f4"]), c({value: 8}, ["c5", "a4"]),

		n({pitch: "g4", value: 16}), c({value: 16}, ["f4", "ab4"]), n({pitch: "b4", value: 16}), c({value: 16}, ["ab4", "c5"]),
		n({pitch: "a4", value: 16}), c({value: 16}, ["g4", "bb4"]), n({pitch: "c#5", value: 16}), c({value: 16}, ["b4", "d5"]),
		n({pitch: "b4", value: 16}), c({value: 16}, ["a4", "c5"]), n({pitch: "d5", value: 16}), c({value: 16}, ["c5", "e5"]),
		n({pitch: "c5", value: 16}), c({value: 16}, ["f4", "a4"]), n({pitch: "b4", value: 16}), c({value: 16}, ["a4", "c5"]),

		n({pitch: "g4", value: 16}), c({value: 16}, ["f4", "a4"]), n({pitch: "b4", value: 16}), c({value: 16}, ["a4", "c5"]),
		n({pitch: "g4", value: 16}), c({value: 16}, ["f4", "a4"]), n({pitch: "b4", value: 16}), c({value: 16}, ["a4", "c5"]),
		n({pitch: "g4", value: 16}), c({value: 16}, ["f4", "a4"]), n({pitch: "b4", value: 16}), c({value: 16}, ["a4", "c5"]),
		n({pitch: "g4", value: 16}), c({value: 16}, ["f4", "a4"]), n({pitch: "b4", value: 16}), c({value: 16}, ["a4", "c5"]),

		c({value: 8}, ["g3", "g4"]), c({value: 8}, ["g4", "g5"]), c({value: 8}, ["b4", "c5"]), c({value: 8}, ["g4", "e5"]),
		c({value: 8}, ["g3", "g4"]), c({value: 8}, ["f4", "a4"]), c({value: 8}, ["a5", "a6"]), c({value: 8}, ["a4", "c5"]),

		c({value: 1}, ["g3", "d4", "b4", "g5"])
	  ]);

	return scored.render(trebleLine, {length: 1500, voices: [voice], numMeasures: 5});
}

function testChordsTwoVoices () {
	var line = scored.line({}, [scored.clef({value: "treble", measure: 0}),
								scored.key({value: "C", measure: 0}),
								scored.timeSig({value: "4/4", measure: 0})]);

	var notes1 = _.fill(new Array(16), 16).concat(_.fill(new Array(8), 8)).concat(_.fill(new Array(4), 4)).concat(_.fill(new Array(2), 2)).concat(_.fill(new Array(1), 1));
	var notes2 = _.fill(new Array(4), 4).concat(
		_.fill(new Array(2), 2)).concat(
			_.fill(new Array(8), 8)).concat(
				_.fill(new Array(8), 8)).concat(
					_.fill(new Array(16), 16));

	// var voice1 = scored.voice({stemDirection: "up"}, _.map(notes1, function (n) {return scored.note({value: n, pitch: "c#5"})}));
	// var voice2 = scored.voice({stemDirection: "down"}, _.map(notes2, function (n) {return scored.chord({value: n}, ["f#4", "a4"])}));

	var voice1 = scored.voice({stemDirection: "up"}, _.map(notes1, function (n) {return scored.chord({value: n}, ["a4", "c#5"])}));
	var voice2 = scored.voice({stemDirection: "down"}, _.map(notes2, function (n) {return scored.note({value: n, pitch: "f#4"})}));

	return scored.render(line, {length: 1000, voices: [voice1, voice2], numMeasures: 5});
}

function testTriplets () {
	var line = scored.line({}, [scored.clef({value: "treble", measure: 0}),
								scored.key({value: "C", measure: 0}),
								scored.timeSig({value: "4/4", measure: 0})]);
	var n = scored.note;

	var a3eigth = {pitch: "a3", value: 8, tuplet: "3/2"};
	var quartersAndEights = [
		n({pitch: "g4", value: 4, tuplet: "3/2"}), n({pitch: "a4", value: 4, tuplet: "3/2"}), n({pitch: "b4", value: 4, tuplet: "3/2"}),
		n({value: 8, tuplet: "3/2"}), n({value: 8, tuplet: "3/2"}), n({value: 4, tuplet: "3/2"}), n({value: 4, tuplet: "3/2"}),

		n({pitch: "c5", value: 4, tuplet: "3/2"}), n({pitch: "c5", value: 8, tuplet: "3/2"}), n({pitch: "c5", value: 8, tuplet: "3/2"}), n({pitch: "c5", value: 4, tuplet: "3/2"}),
		n({value: 4, tuplet: "3/2"}), n({value: 4, tuplet: "3/2"}), n({value: 8, tuplet: "3/2"}), n({value: 8, tuplet: "3/2"})
	];

	var eighthsAndSixteenths = [
		n(a3eigth), n(a3eigth), n(a3eigth),
		n({value: 16, tuplet: "3/2"}), n({value: 16, tuplet: "3/2"}), n({value: 8, tuplet: "3/2"}), n({value: 8, tuplet: "3/2"}),
		n({value: 8, tuplet: "3/2"}), n({value: 16, tuplet: "3/2"}), n({value: 16, tuplet: "3/2"}), n({value: 8, tuplet: "3/2"}),
		n({value: 8, tuplet: "3/2"}), n({value: 8, tuplet: "3/2"}), n({value: 16, tuplet: "3/2"}), n({value: 16, tuplet: "3/2"}),

		n({value: 16, tuplet: "3/2"}), n({value: 16, tuplet: "3/2"}), n({value: 16, tuplet: "3/2"}), n({value: 16, tuplet: "3/2"}), n({value: 8, tuplet: "3/2"}),
		n({value: 16, tuplet: "3/2"}), n({value: 16, tuplet: "3/2"}), n({value: 8, tuplet: "3/2"}), n({value: 16, tuplet: "3/2"}), n({value: 16, tuplet: "3/2"}),
		n({value: 8, tuplet: "3/2"}), n({value: 16, tuplet: "3/2"}), n({value: 16, tuplet: "3/2"}), n({value: 8, tuplet: "3/2"}),
		n({value: 16, tuplet: "3/2"}), n({value: 16, tuplet: "3/2"}), n({value: 16, tuplet: "3/2"}), n({value: 16, tuplet: "3/2"}), n({value: 16, tuplet: "3/2"}), n({value: 16, tuplet: "3/2"})
	];

	var voice = scored.voice({}, [].concat(quartersAndEights));

	return scored.render(line, {length: 1000, voices: [voice], numMeasures: 5});
}

function testTripletsTwoVoices () {
	var line = scored.line({}, [scored.clef({value: "treble", measure: 0}),
								scored.key({value: "C", measure: 0}),
								scored.timeSig({value: "4/4", measure: 0})]);
	var n = scored.note;

	var c5 = {pitch: "c5", value: 4, tuplet: "3/2"};
	var c4 = {pitch: "c4", value: 4, tuplet: "3/2"};
	var c6 = {pitch: "c6", value: 4, tuplet: "3/2"};
	var quarters = [
		n(c5), n(c5),
		n(c5), n(c5), n(c5), n(c5),
		n(c4), n(c4), n(c4), n(c4), n(c4), n(c4),
		n(c6), n(c6), n(c6),
	];

	var a4 = {pitch: "a4", value: 8, tuplet: "3/2"};
	var a3 = {pitch: "a3", value: 8, tuplet: "3/2"};
	var eighths = [
		n(a4), n(a4), n(a4), n(a4), n(a4), n(a4), n(a4), n(a4), n(a4), n(a4), n(a4), n(a4),

		n(a3), n(a3), n(a3), n(a3), n(a3), n(a3), n(a3), n(a3), n(a3), n(a3), n(a3), n(a3),

		// n({value: 16, tuplet: "3/2"}), n({value: 16, tuplet: "3/2"}), n({value: 16, tuplet: "3/2"}), n({value: 16, tuplet: "3/2"}), n({value: 8, tuplet: "3/2"}),
		// n({value: 16, tuplet: "3/2"}), n({value: 16, tuplet: "3/2"}), n({value: 8, tuplet: "3/2"}), n({value: 16, tuplet: "3/2"}), n({value: 16, tuplet: "3/2"}),
		// n({value: 8, tuplet: "3/2"}), n({value: 16, tuplet: "3/2"}), n({value: 16, tuplet: "3/2"}), n({value: 8, tuplet: "3/2"}),
		// n({value: 16, tuplet: "3/2"}), n({value: 16, tuplet: "3/2"}), n({value: 16, tuplet: "3/2"}), n({value: 16, tuplet: "3/2"}), n({value: 16, tuplet: "3/2"}), n({value: 16, tuplet: "3/2"})
	];

	var voice1 = scored.voice({stemDirection: "up"}, [].concat(quarters));
	var voice2 = scored.voice({stemDirection: "down"}, [].concat(eighths));

	return scored.render(line, {length: 1000, voices: [voice1, voice2], numMeasures: 5});
}

function testMeasureRendering (startMeasure, measures) {
	var line = scored.line({}, [scored.clef({value: "treble", measure: 0}),
								scored.key({value: "C", measure: 0}),
								scored.timeSig({value: "4/4", measure: 0})]);
	var n = scored.note;

	var voice = scored.voice({}, [
		n({value:1, pitch: "c4"}), n({value:1, pitch: "d4"}), n({value:1, pitch: "e4"}), n({value:1, pitch: "f4"}),
		n({value:1, pitch: "g4"}), n({value:1, pitch: "a4"}), n({value:1, pitch: "b4"}), n({value:1, pitch: "c5"}),
		n({value:1, pitch: "d5"}), n({value:1, pitch: "e5"}), n({value:1, pitch: "f5"}), n({value:1, pitch: "g5"})
	]);

	var measures = Scored.utils.measure.createMeasures(12, line.children);
	return scored.render(line, {length: 1000, voices: [voice], measures: measures, startMeasure: 5, numMeasures: 6});
}

function testSlurs () {
	var line = scored.line({}, [scored.clef({value: "treble", measure: 0}),
								scored.key({value: "C", measure: 0}),
								scored.timeSig({value: "4/4", measure: 0})]);

	var n = scored.note;

	var voice = scored.voice({}, [
		// test groups of two, same direction stem.
		n({value: 8, pitch: "a4", slur: "1"}), n({value: 8, pitch: "a4", slur: "1"}), n({value: 8, pitch: "c5", slur: "2"}), n({value: 8, pitch: "c5", slur: "2"}),
		n({value: 8, pitch: "a4", slur: "3"}), n({value: 8, pitch: "b4", slur: "3"}), n({value: 8, pitch: "c5", slur: "4"}), n({value: 8, pitch: "b4", slur: "4"}),

		// test groups of four, same direction stems
		n({value: 8, pitch: "a4", slur: "5"}), n({value: 8, pitch: "a4", slur: "5"}), n({value: 8, pitch: "a4", slur: "5"}), n({value: 8, pitch: "f4", slur: "5"}),
		n({value: 8, pitch: "c5", slur: "6"}), n({value: 8, pitch: "c5", slur: "6"}), n({value: 8, pitch: "c5", slur: "6"}), n({value: 8, pitch: "b4", slur: "6"}),

		// groups of two, oposite direction stems
		n({slur: "7", pitch: "a4"}), n({slur: "7", pitch: "c5"}), n({slur: "8", pitch: "c5"}), n({slur: "8", pitch: "a4"})
	]);

	return scored.render(line, {voices: [voice], numMeasures: 4});
}

function testStacatoLegato () {
	var line = scored.line({}, [scored.clef({value: "treble", measure: 0}),
								scored.key({value: "C", measure: 0}),
								scored.timeSig({value: "4/4", measure: 0})]);

	var n = scored.note;
	var c = scored.chord;

	var voice = scored.voice({}, [
		n({pitch: "a4", staccato: true}), n({pitch: "a4", tenuto: true}), n({pitch: "c5", staccato: true}), n({pitch: "c5", tenuto: true}),
		n({value: 2, pitch: "a4", portato: true}), n({value: 2, pitch: "c5", portato: true}),
		c({staccato: true}, ["f4", "g4", "a4"]), c({tenuto: true}, ["f4", "g4", "a4"]),
		c({staccato: true}, ["c5", "d5", "e5"]), c({tenuto: true}, ["c5", "d5", "e5"]),
		c({value: 2, portato: true}, ["f4", "g4", "a4"]), c({value: 2, portato: true}, ["c5", "d5", "e5"])
	]);

	return scored.render(line, {voices: [voice], numMeasures: 4});
}

function testDots () {
	var line = scored.line({}, [scored.clef({value: "treble", measure: 0}),
								scored.key({value: "C", measure: 0}),
								scored.timeSig({value: "4/4", measure: 0})]);

	var n = scored.note;
	var c = scored.chord;
	var r = scored.rest;

	// need to test notes, chords and rests with at least two dots each.
	var voice = scored.voice({}, [
		n({pitch: "a4", value: 4, dots: 1}), r({value: 8}), n({pitch: "b4", value: 4, dots: 1}), r({value: 8}),

		c({value: 4, dots: 1}, ["a4", "c5"]), r({value: 8}),
		c({value: 4, dots: 1}, ["a4", "b4"]), r({value: 8}),
		c({value: 4, dots: 1}, ["a4", "b4", "c5"]), r({value: 8}),
		c({value: 4, dots: 1}, ["f4", "f5"]), r({value: 8}),
		r({value: 4, dots: 1}), r({value: 8}), r({value: 8, dots: 1}), r({value: 16}), r({value: 16}),
	]);

	return scored.render(line, {voices: [voice], numMeasures: 4});
}

function testDynamics () {
	var line = scored.line({}, [scored.clef({value: "treble", measure: 0}),
								scored.key({value: "C", measure: 0}),
								scored.timeSig({value: "4/4", measure: 0})]);

	var n = scored.note;
	var c = scored.chord;
	var d = scored.dynamic;

	// need to test notes, chords and rests with at least two dots each.
	var voice = scored.voice({}, [
		n({pitch: "a4", value: 4}), n({pitch: "b4", value: 4}),
		d({value: "p"}),
		c({value: 4}, ["a4", "c5"]),
		c({value: 4}, ["a4", "b4"]),
		d({value: "ffff"}),
		c({value: 4}, ["a4", "b4", "c5"]),
		c({value: 4}, ["f4", "f5"]),
		c({value: 4}, ["a4", "b4", "c5"]),
		c({value: 4}, ["f4", "f5"])
	]);

	return scored.render(line, {voices: [voice], numMeasures: 4});
}

function testSimpleBeatStructure (timeSig, value, num) {
	var line = scored.line({}, [scored.clef({value: "treble", measure: 0}),
								scored.key({value: "C", measure: 0}),
								timeSig]);

	var n = scored.note;

	var notes = [];
	for (var i = 0; i < num; i++) {
		notes.push(n({value: value}));
	}

	var voice = scored.voice({}, notes);

	return scored.render(line, {voices: [voice], numMeasures: 2});
}

function testComplexBeatStructure (timeSig, pattern, repeats) {
	var line = scored.line({}, [scored.clef({value: "treble", measure: 0}),
								scored.key({value: "C", measure: 0}),
								timeSig]);

	var n = scored.note;

	var notes = [];
	for (var i = 0; i < repeats; i++) {
		_.each(pattern, function (value) {
			notes.push(n({value: value}));
		});
	}

	var voice = scored.voice({}, notes);

	return scored.render(line, {voices: [voice], numMeasures: 2});
}

function testBeatStructures () {
	testSimpleBeatStructure(scored.timeSig({value: "4/4", measure: 0}), 8, 8).translate(25, 50);
	testSimpleBeatStructure(scored.timeSig({value: "c", measure: 0}), 8, 8).translate(25, 150);
	testSimpleBeatStructure(scored.timeSig({value: "h", measure: 0}), 8, 8).translate(25, 250);
	testSimpleBeatStructure(scored.timeSig({value: "3/4", measure: 0}), 8, 6).translate(25, 350);
	testSimpleBeatStructure(scored.timeSig({value: "12/8", measure: 0}), 8, 12).translate(25, 450);

	testSimpleBeatStructure(scored.timeSig({value: "4/4", measure: 0}), 16, 16).translate(400, 50);
	testSimpleBeatStructure(scored.timeSig({value: "c", measure: 0}), 16, 16).translate(400, 150);
	testSimpleBeatStructure(scored.timeSig({value: "h", measure: 0}), 16, 16).translate(400, 250);
	testSimpleBeatStructure(scored.timeSig({value: "3/4", measure: 0}), 16, 16).translate(400, 350);
	testSimpleBeatStructure(scored.timeSig({value: "12/8", measure: 0}), 16, 24).translate(400, 450);

	// testComplexBeatStructure(scored.timeSig({value: "c", measure: 0}), [16, 8, 16], 4).translate(25, 50);
}
