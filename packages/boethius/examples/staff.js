function run () {
    testTwoLines().translate(25, 50);
    testThreeLines().translate(600, 50);
    testMeasureRendering().translate(25, 400);
}

function testTwoLines () {
    var line1 = scored.line({voices: ["soprano"]}, [scored.clef({value: "treble", measure: 0}),
                                 scored.key({value: "C", measure: 0}),
                                 scored.timeSig({value: "4/4", measure: 0})
                             ]);
    var line2 = scored.line({voices: ["bass"]}, [scored.clef({value: "bass", measure: 0}),
                                 scored.key({value: "C", measure: 0}),
                                 scored.timeSig({value: "4/4", measure: 0})
                             ]);

    var staff = scored.staff({}, [scored.timeSig({value: "4/4", measure: 0})]);

    var n = scored.note;

    var voice1 = scored.voice({name: "soprano"}, [
        n({value: 4, pitch: "c5"}), n({value: 4, pitch: "b4"}), n({value: 8, pitch: "a4"}), n({value: 8, pitch: "g4"}), n({value: 4, pitch: "f4"})
    ]);

    var voice2 = scored.voice({name: "bass"}, [
        n({value: 8, pitch: "c3"}), n({value: 8, pitch: "c#3"}), n({value: 4, pitch: "d3"}), n({value: 4, pitch: "e3"})
    ]);

    // return scored.render(staff, {length: 500, lines: [line1, line2], voices: [voice1, voice2], numMeasures: 2});
    return scored.render(staff, {lines: [line1, line2], voices: [voice1, voice2], numMeasures: 2});
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

    var staff = scored.staff({}, [scored.timeSig({value: "4/4", measure: 0})]);

    var n = scored.note;
    var c = scored.chord;

    var voice1 = scored.voice({name: "soprano"}, [
        n({value: 4, pitch: "c5"}), n({value: 4, pitch: "b4"}), n({value: 8, pitch: "a4"}), n({value: 8, pitch: "g4"}), n({value: 4, pitch: "f4"}),
        n({value: 8})
    ]);

    var voice2 = scored.voice({name: "bass"}, [
        n({value: 8, pitch: "c3"}), n({value: 8, pitch: "c#3"}), n({value: 4, pitch: "d3"}), n({value: 4, pitch: "e3"}), n({value: 4, pitch: "f3"}),
        n({value: 8})
    ]);

    var voice3 = scored.voice({name: "chords"}, [
        c({value: 8}, ["c4", "eb4", "g4", "c5"]) , c({value: 8}, ["c4", "eb4", "g4", "c5"]),
        n({value: 4, pitch: "b4"}), n({value: 4, pitch: "a4"}), n({value: 4, pitch: "g4"}), n({value: 4, pitch: "f4"})

    ]);

    return scored.render(staff, {lines: [line1, line2, line3], voices: [voice1, voice2, voice3], length: 500, numMeasures: 2});
}

function testMeasureRendering () {
    var treble = scored.line({}, [scored.clef({value: "treble", measure: 0}),
								scored.key({value: "C", measure: 0}),
								scored.timeSig({value: "4/4", measure: 0})]);
    var bass = scored.line({}, [scored.clef({value: "bass", measure: 0}),
								scored.key({value: "C", measure: 0}),
								scored.timeSig({value: "4/4", measure: 0})]);
	var n = scored.note;

	var voice1 = scored.voice({}, [
		n({value:1, pitch: "c4"}), n({value:1, pitch: "d4"}), n({value:1, pitch: "e4"}), n({value:1, pitch: "f4"}),
		n({value:1, pitch: "g4"}), n({value:1, pitch: "a4"}), n({value:1, pitch: "b4"}), n({value:1, pitch: "c5"}),
		n({value:1, pitch: "d5"}), n({value:1, pitch: "e5"}), n({value:1, pitch: "f5"}), n({value:1, pitch: "g5"})
	]);

    var voice2 = scored.voice({}, [
		n({value:1, pitch: "c4"}), n({value:1, pitch: "b3"}), n({value:1, pitch: "a3"}), n({value:1, pitch: "g3"}),
		n({value:1, pitch: "f3"}), n({value:1, pitch: "e3"}), n({value:1, pitch: "d3"}), n({value:1, pitch: "c3"}),
		n({value:1, pitch: "b2"}), n({value:1, pitch: "a2"}), n({value:1, pitch: "g2"}), n({value:1, pitch: "f2"})
	]);

    var staff = scored.staff({}, [scored.timeSig({value: "4/4", measure: 0})]);
	var measures = Scored.utils.measure.createMeasures(12, staff.markings);
	return scored.render(staff, {length: 1000, lines: [treble, bass], voices: [voice1, voice2], measures: measures, startMeasure: 0, numMeasures: 12});
}
