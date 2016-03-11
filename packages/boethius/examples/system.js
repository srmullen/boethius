function run () {
    testTwoLines().translate(25, 50);
    testThreeLines().translate(450, 50);
    testLineSwitching().translate(800, 150);
    testMeasureRendering().translate(25, 400);
    // testRests().translate(25, 50);
}

function testTwoLines () {
    var line1 = scored.line({voices: ["soprano"]}, [scored.clef({value: "treble", measure: 0}),
                                 scored.key({value: "c", measure: 0}),
                                 scored.timeSig({value: "4/4", measure: 0})
                             ]);
    var line2 = scored.line({voices: ["bass"]}, [scored.clef({value: "bass", measure: 0}),
                                 scored.key({value: "c", measure: 0}),
                                 scored.timeSig({value: "4/4", measure: 0})
                             ]);

    var system = scored.system({lineHeights: [0, 200], measures: 2}, [scored.timeSig({value: "4/4", measure: 0})]);

    var n = scored.note;

    var voice1 = scored.voice({name: "soprano"}, [
        n({value: 4, pitch: "c5", slur: "1"}), n({value: 4, pitch: "b4", slur: "1"}), n({value: 8, pitch: "a4", staccato: true}), n({value: 8, pitch: "g4"}), n({value: 4, pitch: "f4"}),
        n({value: 4, pitch: "f4"}), scored.rest({value: 8})
    ]);

    var voice2 = scored.voice({name: "bass"}, [
        n({value: 8, pitch: "c3", slur: "2"}), n({value: 8, pitch: "c#3", slur: "2"}), n({value: 4, pitch: "d3"}), n({value: 4, pitch: "e3", tenuto: true}), scored.rest({value: 4}),
        n({value: 4, pitch: "e3"})
    ]);

    // return scored.render(system, {length: 500, lines: [line1, line2], voices: [voice1, voice2]});
    return scored.render(system, {lines: [line1, line2], voices: [voice1, voice2]});
}

function testThreeLines () {
    var line1 = scored.line({voices: ["soprano"]}, [scored.clef({value: "treble", measure: 0}),
                                 scored.key({value: "C", measure: 0}),
                                 scored.timeSig({value: "4/4", measure: 0})
                             ]);
    var line2 = scored.line({voices: ["bass"]}, [scored.clef({value: "bass", measure: 0}),
                                 scored.key({value: "C", measure: 0}),
                                 scored.timeSig({value: "4/4", measure: 0})
                             ]);

    var line3 = scored.line({voices: ["chords"]}, [scored.clef({value: "treble", measure: 0}),
                                scored.key({value: "c", measure: 0}),
                                scored.timeSig({value: "4/4", measure: 0})
                            ]);

    var system = scored.system({lineHeights: [0, 100, 100], measures: 2}, [scored.timeSig({value: "4/4", measure: 0})]);

    var n = scored.note;
    var c = scored.chord;
    var d = scored.dynamic;

    var voice1 = scored.voice({name: "soprano"}, [
        d({value: "ff"}),
        n({value: 4, pitch: "c5"}), n({value: 4, pitch: "b4"}), n({value: 8, pitch: "a4"}), n({value: 8, pitch: "g4"}), n({value: 4, pitch: "f4"}),
        n({value: 8})
    ]);

    var voice2 = scored.voice({name: "bass"}, [
        d({value: "mf"}),
        n({value: 8, pitch: "c3"}), n({value: 8, pitch: "c#3"}), n({value: 4, pitch: "d3"}), n({value: 4, pitch: "e3"}), n({value: 4, pitch: "f3"}),
        n({value: 8})
    ]);

    var voice3 = scored.voice({name: "chords"}, [
        d({value: "p"}),
        c({value: 8}, ["c4", "eb4", "g4", "c5"]) , c({value: 8}, ["c4", "eb4", "g4", "c5"]),
        n({value: 4, pitch: "b4"}), n({value: 4, pitch: "a4"}), n({value: 4, pitch: "g4"}), d({value: "f"}), n({value: 4, pitch: "f4"})

    ]);

    return scored.render(system, {lines: [line1, line2, line3], voices: [voice1, voice2, voice3]});
}

function testMeasureRendering () {
    var treble = scored.line({voices: ["treble"]}, [scored.clef({value: "treble", measure: 0}),
								scored.key({value: "C", measure: 0}),
								scored.timeSig({value: "4/4", measure: 0})]);
    var bass = scored.line({voices: ["bass"]}, [scored.clef({value: "bass", measure: 0}),
								scored.key({value: "C", measure: 0}),
								scored.timeSig({value: "4/4", measure: 0})]);
	var n = scored.note;

	var voice1 = scored.voice({name: "treble"}, [
		n({value:1, pitch: "c4"}), n({value:1, pitch: "d4"}), n({value:1, pitch: "e4"}), n({value:1, pitch: "f4"}),
		n({value:1, pitch: "g4"}), n({value:1, pitch: "a4"}), n({value:1, pitch: "b4"}), n({value:1, pitch: "c5"}),
		n({value:1, pitch: "d5"}), n({value:1, pitch: "e5"}), n({value:1, pitch: "f5"}), n({value:1, pitch: "g5"})
	]);

    var voice2 = scored.voice({name: "bass"}, [
		n({value:1, pitch: "c4"}), n({value:1, pitch: "b3"}), n({value:1, pitch: "a3"}), n({value:1, pitch: "g3"}),
		n({value:1, pitch: "f3"}), n({value:1, pitch: "e3"}), n({value:1, pitch: "d3"}), n({value:1, pitch: "c3"}),
		n({value:1, pitch: "b2"}), n({value:1, pitch: "a2"}), n({value:1, pitch: "g2"}), n({value:1, pitch: "f2"})
	]);

    var system = scored.system({measures: 12}, [scored.timeSig({value: "4/4", measure: 0})]);
	var measures = Scored.utils.measure.createMeasures(12, system.markings);
	return scored.render(system, {length: 1000, lines: [treble, bass], voices: [voice1, voice2], measures: measures, startMeasure: 0});
}

function testLineSwitching () {
    var line1Voices = ["soprano", "alto"];
    var line2Voices = ["bass"];
    var treble = scored.line({voices: line1Voices}, [scored.clef({value: "treble", measure: 0}),
								scored.key({value: "C", measure: 0}),
								scored.timeSig({value: "4/4", measure: 0})]);
    var bass = scored.line({voices: line2Voices}, [scored.clef({value: "bass", measure: 0}),
								scored.key({value: "C", measure: 0}),
								scored.timeSig({value: "4/4", measure: 0})]);
	var n = scored.note;
    var c = scored.chord;

	var voice1 = scored.voice({name: "soprano"}, [
        c({}, ["f6", "a6"]), c({}, ["f6", "a6"]), c({}, ["f6", "a6"]), c({}, ["f6", "a6"]),
		n({pitch: "g5"}), n({pitch: "a5"}), n({pitch: "b5"}), n({pitch: "c6"}),
        n({value: 4, pitch: "g6"}),
        n({value: 8, pitch: "f6"}), n({value: 8, pitch: "g6"}),
        n({value: 8, pitch: "f6"}), n({value: 8, pitch: "e6"}), n({value: 8, pitch: "d6"}), n({value: 8, pitch: "c6"})
	]);

    var voice2 = scored.voice({name: "alto"}, [
		c({}, ["g3", "e3"]), c({}, ["b4", "a4"]), n({pitch: "a4"}), n({pitch: "g4"}),
		n({pitch: "f4"}), n({pitch: "e4"}), n({pitch: "d4"}), n({pitch: "c4"}),
		n({pitch: "b3"}), n({pitch: "a3"}), n({pitch: "g3"}), n({pitch: "f3"})
	]);

    var voice3 = scored.voice({name: "bass"}, [
        n({pitch: "c4"}), n({pitch: "b3"}), n({pitch: "a3"}), n({pitch: "g3"}),
		n({pitch: "f3"}), n({pitch: "e3"}), n({pitch: "d3"}), n({pitch: "c3"}),
		n({pitch: "b2"}), n({pitch: "a2"}), n({pitch: "g2"}), n({pitch: "f2"})
    ]);

    var system = scored.system({measures: 3}, [scored.timeSig({value: "4/4", measure: 0})]);
	return scored.render(system, {lines: [treble, bass], voices: [voice1, voice2, voice3]});
}

function testRests () {
    var line = scored.line({voices: ["soprano"]}, [scored.clef({value: "treble", measure: 0}),
                                 scored.key({value: "c", measure: 0}),
                                 scored.timeSig({value: "4/4", measure: 0})
                             ]);

    var system = scored.system({measures: 2}, [scored.timeSig({value: "4/4", measure: 0})]);

    var r = scored.rest;

    var voice = scored.voice({name: "soprano"}, [
        r({value: 1}), r({value: 2}), r({value: 4}), r({value: 8}), r({value: 16}), r({value: 32}), r({value: 64})
    ]);

    return scored.render(system, {lines: [line], voices: [voice]});
}
