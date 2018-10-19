export default function testTimeSigChange (scored) {
    var n = scored.note;
    var r = scored.rest;
    // create lines
    var trebleLine = scored.line({voices: ["treble"]}, [
        scored.clef({value: "treble", measure: 0}), scored.key({value: "c", measure: 0}), scored.timeSig({value: "4/4", measure: 0}),
        scored.timeSig({value: "3/4", measure: 1})
    ]);
    var bassLine = scored.line({voices: ["bass"]}, [
        scored.clef({value: "bass", measure: 0}), scored.key({value: "c", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
    ]);

    // create voices
    var soprano = scored.voice({name: "treble"}, [
        n({value:2, pitch: "c4"}), r({value:2, pitch: "d#4"}), n({value:2, pitch: "d#4"}), n({value:4, pitch: "e4"}),
        n({value:2, pitch: "f4"}), n({value:4, pitch: "g4"}), n({value:2, pitch: "a4"}), n({value:4, pitch: "b4"}),
        n({value:2, pitch: "c5"}), n({value:2, pitch: "d5"}), n({value:2, pitch: "e5"}), n({value:2, pitch: "f5"}),
        n({value:2, pitch: "g5"}),

        n({value:2, pitch: "c3"}), r({value:2, pitch: "d#3"}), n({value:2, pitch: "d#3"}), n({value:2, pitch: "e3"}), n({value:2, pitch: "f3"}),
    n({value:2, pitch: "g3"}), n({value:2, pitch: "a3"}), n({value:2, pitch: "b3"}), n({value:2, pitch: "c4"}),
    n({value:2, pitch: "d4"}), n({value:2, pitch: "e4"}), n({value:2, pitch: "f4"}), n({value:2, pitch: "g4"})
    ]);

    var bass = scored.voice({name: "bass"}, [
        n({value:1, pitch: "c4"}), n({value:1, pitch: "b3"}), n({value:1, pitch: "a3"}), n({value:1, pitch: "g3"}),
    n({value:1, pitch: "f3"}), r({value:1, pitch: "e3"}), n({value:1, pitch: "d3"}), n({value:1, pitch: "c3"}),
    n({value:1, pitch: "b2"}), n({value:1, pitch: "a2"}), n({value:1, pitch: "g2"}), n({value:1, pitch: "f2"})
    ]);

    var fourfour = scored.timeSig({value: "4/4", measure: 0});
    var threefour = scored.timeSig({value: "3/4", measure: 1});
    var threeEight = scored.timeSig({value: "3/8", measure: 2});
    var page0 = scored.page();
    var system1 = scored.system({measures: 6, lineHeights: [0, 200]});
    var system2 = scored.system({measures: 6});

    var score = scored.score({length: 1000, systemHeights: [0, 150]}, [fourfour, threefour, page0, system1, system2, trebleLine]);

    // render it all as a score.
    return scored.pluginRender(score, {voices: [soprano, bass], pages: [0]});
}
