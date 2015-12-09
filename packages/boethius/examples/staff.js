function run () {
    var line1 = scored.line({}, [scored.clef({value: "treble", measure: 0}),
                                 scored.key({value: "C", measure: 0})]);
    var line2 = scored.line({}, [scored.clef({value: "bass", measure: 0}),
                                 scored.key({value: "C", measure: 0})]);

    var staff = scored.staff({}, [scored.timeSig({value: "4/4", measure: 0}), line1, line2]);

    var n = scored.note;

    var voice1 = scored.voice({}, [
        n({value: 4, pitch: "c5"}), n({value: 4, pitch: "b4"}), n({value: 4, pitch: "a4"}), n({value: 4, pitch: "g4"})
    ]);

    var voice2 = scored.voice({}, [
        n({value: 4, pitch: "c3"}), n({value: 4, pitch: "d3"}), n({value: 4, pitch: "e3"}), n({value: 4, pitch: "f3"})
    ]);

    scored.render(staff, [line1, line2], [voice1, voice2]).translate(25, 50);
}
