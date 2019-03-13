export default function testRepeats (scored) {
    var n = scored.note;
    var r = scored.rest;
    var c = scored.chord;
    var d = scored.dynamic;

    // If a repeat is given to a line then it will just be a repeat of the previous measure.
    // It can be represented by a % in boethius-lang.
    // If a repeat is given to a system it will go back to the beginning or inverse repeat.
    // It can be represented by :| and |: in boethius-lang.

    // create lines
    var trebleLine = scored.line({voices: ["treble"]}, [
      scored.clef({value: "treble", measure: 0}), scored.key({value: "C", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
    ]);
    var bassLine = scored.line({voices: ["bass"]}, [
      scored.clef({value: "bass", measure: 0}), scored.key({value: "C", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
    ]);

    // create voices
    var soprano = scored.voice({name: "treble"}, [
      n({value: 1, pitch: "f5"}), n({value: 1, pitch: "f5"}), n({value: 1, pitch: "c4"}), n({value: 1, pitch: "c4"})
    ]);

    var bass = scored.voice({name: "bass"}, [
      n({value: 1, pitch: "f3"}), n({value: 1, pitch: "f3"}), n({value: 1, pitch: "c4"}), n({value: 1, pitch: "c4"})
    ]);

    var page0 = scored.page();
    var fourfour = scored.timeSig({value: "4/4", measure: 0});
    var system1 = scored.system({duration: {measure: 6}, startsAt: 0});
    var system2 = scored.system({duration: {measure: 6}, startsAt: 6});
    var repeatM4 = scored.repeat({measure: 2});

    var score = scored.score({length: 1000, systemHeights: [0, 150]}, [fourfour, page0, system1, system2, trebleLine, bassLine]);

    // render it all as a score.
    return scored.pluginRender(score, {
        voices: [soprano, bass],
        repeats: [repeatM4],
        pages: [0]
    });
}
