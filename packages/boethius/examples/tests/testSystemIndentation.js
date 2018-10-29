export default function testSystemIndentation (scored) {
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
      n({value:1, pitch: "c4"}), r({value:2, pitch: "d#4"}), n({value:2, pitch: "d#4"}), n({value:1, pitch: "e4"}), n({value:1, pitch: "f4"}),
      n({value:1, pitch: "g4"}), n({value:1, pitch: "a4"}), n({value:1, pitch: "b4"}), n({value:1, pitch: "c5"}),
      n({value:1, pitch: "d5"}), n({value:1, pitch: "e5"}), n({value:1, pitch: "f5"}), n({value:1, pitch: "g5"})
    ]);
    var bass = scored.voice({name: "bass"}, [
      n({value:1, pitch: "c4"}), n({value:1, pitch: "b3"}), n({value:1, pitch: "a3"}), n({value:1, pitch: "g3"}),
      n({value:1, pitch: "f3"}), r({value:1, pitch: "e3"}), n({value:1, pitch: "d3"}), n({value:1, pitch: "c3"}),
      n({value:1, pitch: "b2"}), n({value:1, pitch: "a2"}), n({value:1, pitch: "g2"}), n({value:1, pitch: "f2"})
    ]);

    var fourfour = scored.timeSig({value: "4/4", measure: 0});

    // create staves
    var system1 = scored.system({duration: {measure: 6}, startsAt: 0, indentation: 100, length: 900});
    var system2 = scored.system({duration: {measure: 6}, startsAt: 6});

    var page0 = scored.page();

    var score = scored.score({
        length: 1000, systemHeights: [0, 350], title: {value: "Test Title", fontSize: 50}
    }, [fourfour, system1, system2, trebleLine, bassLine, page0]);

    // render it all as a score.
    return scored.pluginRender(score, {voices: [soprano, bass]});
}
