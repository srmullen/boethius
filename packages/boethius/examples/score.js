function run () {
    testDoubleStaffScore().translate(25, 50);
}

function testDoubleStaffScore () {
    var n = scored.note;
    // create lines
    var trebleLine = scored.line({}, [
        scored.clef({value: "treble", measure: 0}), scored.key({value: "C", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
    ]);
    var bassLine = scored.line({}, [
        scored.clef({value: "bass", measure: 0}), scored.key({value: "C", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
    ]);

    // create voices
    var soprano = scored.voice({}, [
        n({value:1, pitch: "c4"}), n({value:1, pitch: "d4"}), n({value:1, pitch: "e4"}), n({value:1, pitch: "f4"}),
		n({value:1, pitch: "g4"}), n({value:1, pitch: "a4"}), n({value:1, pitch: "b4"}), n({value:1, pitch: "c5"}),
		n({value:1, pitch: "d5"}), n({value:1, pitch: "e5"}), n({value:1, pitch: "f5"}), n({value:1, pitch: "g5"})
    ]);
    var bass = scored.voice({}, [
        n({value:1, pitch: "c4"}), n({value:1, pitch: "b3"}), n({value:1, pitch: "a3"}), n({value:1, pitch: "g3"}),
		n({value:1, pitch: "f3"}), n({value:1, pitch: "e3"}), n({value:1, pitch: "d3"}), n({value:1, pitch: "c3"}),
		n({value:1, pitch: "b2"}), n({value:1, pitch: "a2"}), n({value:1, pitch: "g2"}), n({value:1, pitch: "f2"})
    ]);

    var fourfour = scored.timeSig({value: "4/4", measure: 0});

    // create staves
    var staff1 = scored.staff({measures: 6});
    var staff2 = scored.staff({measures: 6});

    var score = scored.score({}, [fourfour, staff1, staff2, trebleLine, bassLine]);

    // render it all as a score.
    return scored.render(score, {voices: [soprano, bass]});
}
