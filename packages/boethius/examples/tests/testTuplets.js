export default function testTuplets (scored) {
    var n = scored.note;
    var r = scored.rest;
    // create lines
    var trebleLine = scored.line({voices: ["treble"]}, [
        scored.clef({value: "treble", measure: 0}), scored.key({value: "c", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
    ]);
    var bassLine = scored.line({voices: ["bass"]}, [
        scored.clef({value: "bass", measure: 0}), scored.key({value: "c", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
    ]);

    // create voices
    var soprano = scored.voice({name: "treble"}, [
        // stems up
        n({value: 4, pitch: 'g4', tuplet: "3/2"}), n({value: 4, pitch: 'g4', tuplet: "3/2"}), n({value: 4, pitch: 'g4', tuplet: "3/2"}),
        n({value: 8, pitch: 'g4', tuplet: "3/2"}), n({value: 8, pitch: 'g4', tuplet: "3/2"}), n({value: 8, pitch: 'g4', tuplet: "3/2"}),
        n({value: 16, pitch: 'g4', tuplet: "3/2"}), n({value: 16, pitch: 'a4', tuplet: "3/2"}), n({value: 16, pitch: 'g4', tuplet: "3/2"}),
        n({value: 16, pitch: 'a4', tuplet: "3/2"}), n({value: 16, pitch: 'g4', tuplet: "3/2"}), n({value: 16, pitch: 'a4', tuplet: "3/2"}),
        // stems down
        n({value: 4, pitch: 'c5', tuplet: "3/2"}), n({value: 4, pitch: 'c5', tuplet: "3/2"}), n({value: 4, pitch: 'c5', tuplet: "3/2"}),
        n({value: 8, pitch: 'c5', tuplet: "3/2"}), n({value: 8, pitch: 'c5', tuplet: "3/2"}), n({value: 8, pitch: 'c5', tuplet: "3/2"}),
        n({value: 16, pitch: 'c5', tuplet: "3/2"}), n({value: 16, pitch: 'c5', tuplet: "3/2"}), n({value: 16, pitch: 'c5', tuplet: "3/2"}),
        n({value: 16, pitch: 'c5', tuplet: "3/2"}), n({value: 16, pitch: 'c5', tuplet: "3/2"}), n({value: 16, pitch: 'c5', tuplet: "3/2"})
    ]);
    var bass = scored.voice({name: "bass"}, [
        r({value: 4, tuplet: "3/2"}), r({value: 4, tuplet: "3/2"}), r({value: 4, tuplet: "3/2"}),
        r({value: 8, tuplet: "3/2"}), r({value: 8, tuplet: "3/2"}), r({value: 8, tuplet: "3/2"}),
        r({value: 16, tuplet: "3/2"}), r({value: 16, tuplet: "3/2"}), r({value: 16, tuplet: "3/2"}),
        r({value: 16, tuplet: "3/2"}), r({value: 16, tuplet: "3/2"}), r({value: 16, tuplet: "3/2"})
    ]);

    var fourfour = scored.timeSig({value: "4/4", measure: 0});

    // create staves
    var system1 = scored.system({measures: 6, indentation: 100, length: 900});
    var system2 = scored.system({measures: 6});

    var page0 = scored.page();

    var score = scored.score({
        length: 1000, systemHeights: [0, 350], title: {value: "Test Tuplets", fontSize: 50}
    }, [fourfour, system1, system2, trebleLine, bassLine, page0]);

    // render it all as a score.
    return scored.pluginRender(score, {voices: [soprano, bass]});
}
