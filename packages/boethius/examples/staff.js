function run () {
    testTwoLines();
    testThreeLines();
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

    var staff = scored.staff({}, [scored.timeSig({value: "4/4", measure: 0}), line1, line2]);

    var n = scored.note;

    var voice1 = scored.voice({name: "soprano"}, [
        n({value: 4, pitch: "c5"}), n({value: 4, pitch: "b4"}), n({value: 8, pitch: "a4"}), n({value: 8, pitch: "g4"}), n({value: 4, pitch: "f4"})
    ]);

    var voice2 = scored.voice({name: "bass"}, [
        n({value: 8, pitch: "c3"}), n({value: 8, pitch: "c#3"}), n({value: 4, pitch: "d3"}), n({value: 4, pitch: "e3"})
    ]);

    scored.render(staff, {voices: [voice1, voice2], length: 500}).translate(25, 50);
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

    var staff = scored.staff({}, [scored.timeSig({value: "4/4", measure: 0}), line1, line2, line3]);

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

    scored.render(staff, {voices: [voice1, voice2, voice3], length: 500}).translate(600, 50);
}
