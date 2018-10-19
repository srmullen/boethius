export default function testChordSymbols (scored) {
    var n = scored.note;
    var r = scored.rest;
    var c = scored.chord;
    var d = scored.dynamic;
    // create lines
    var trebleLine = scored.line({voices: ["treble", "alto"]}, [
        scored.clef({value: "treble", measure: 0}), scored.key({value: "C", measure: 0}), scored.timeSig({value: "4/4", measure: 0}),
    ]);
    var bassLine = scored.line({voices: ["bass"]}, [
        scored.clef({value: "bass", measure: 0}), scored.key({value: "C", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
    ]);

    // create voices
    var soprano = scored.voice({name: "treble"}, [
        d({value: "f"}),
        r({value: 1, pitch: "c5"}), r({value: 1, pitch: "c5"}), n({value: 1, pitch: "f4"}),
        r({value: 4}), r({value: 8}), r({value: 8}),r({value: 8, dots: 1}), r({value: 16}), r({value: 4}),
        n({value: 1, pitch: "c5"}), n({value: 1, pitch: "c5"}), n({value: 1, pitch: "f4"}), n({value: 1, pitch: "f4"}),
        n({value: 1, pitch: "c5"}), n({value: 1, pitch: "c5"}), n({value: 1, pitch: "g4"}), n({value: 1, pitch: "g4"}),
        n({value: 1, pitch: "f5"}), n({value: 1, pitch: "f5"}), n({value: 1, pitch: "c4"}), n({value: 1, pitch: "c4"})
    ]);

    var alto = scored.voice({name: "alto"}, [
        n({value: 2, pitch: "g4"}), d({value: "p"}),
        n({value: 2, pitch: "e4"}), n({value: 2, pitch: "d4"}), n({value: 2, pitch: "e4"})
    ]);

    var bass = scored.voice({name: "bass"}, [
        c({value: 2}, ["e3", "c4"]), r({value: 2, pitch: "c4"}), n({value: 1, pitch: "bb3"}),
        n({value: 2, pitch: "a3"}), r({value: 2}),
        r({value: 4}), r({value: 8}), r({value: 8}),r({value: 8, dots: 1}), r({value: 16}), r({value: 4}),
        n({value: 1, pitch: "c5"}), n({value: 1, pitch: "c5"}), n({value: 1, pitch: "f4"}), n({value: 1, pitch: "f4"}),
        n({value: 1, pitch: "c5"}), n({value: 1, pitch: "c5"}), n({value: 1, pitch: "g4"}), n({value: 1, pitch: "g4"}),
        n({value: 1, pitch: "f5"}), n({value: 1, pitch: "f5"}), n({value: 1, pitch: "c4"}), n({value: 1, pitch: "c4"})
    ]);

    var cmaj1 = scored.chordSymbol({value: "C", measure: 0});
    var fmaj1 = scored.chordSymbol({value: "Fm", measure: 2});

    var page0 = scored.page();
    var fourfour = scored.timeSig({value: "4/4", measure: 0});
    var system1 = scored.system({measures: 6});
    var system2 = scored.system({measures: 6});

    var score = scored.score({length: 1000, systemHeights: [0, 150]}, [fourfour, page0, system1, system2, trebleLine, bassLine]);

    // render it all as a score.
    return scored.pluginRender(score, {
        voices: [soprano, alto, bass],
        pages: [0],
        chordSymbols: [cmaj1, fmaj1]
    });
}
