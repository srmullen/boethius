export default function testSlurs (scored) {
    var n = scored.note;
    var r = scored.rest;
    var c = scored.chord;

    // create lines
    var trebleLine = scored.line({voices: ["treble"]}, [
      scored.clef({value: "treble", measure: 0}), scored.key({value: "c", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
    ]);
    var bassLine = scored.line({voices: ["bass"]}, [
      scored.clef({value: "bass", measure: 0}), scored.key({value: "c", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
    ]);

    // create voices
    var soprano = scored.voice({name: "treble"}, [
      // slur across systems
      n({value: 4, pitch: 'a4', slur: 1}), n({value: 4, pitch: 'a4', slur: 1}),
      n({value: 4, pitch: 'a4', slur: 2}), n({value: 4, pitch: 'c5', slur: 2}),
      r({value: 4}), n({value: 4, pitch: 'c5', slur: 3}), n({value: 4, pitch: 'c5', slur: 3}), n({value: 4, pitch: 'c5', slur: 3}),
      // Test system break
      r({value: 2, dots: 1}), n({value: 4, slur: 4}), n({value: 4, slur: 4}), n({value: 4, slur: 4})
    ]);
    var bass = scored.voice({name: "bass"}, [
      n({value: 4, pitch: 'e3', slur: 1}), n({value: 4, pitch: 'e3', slur: 1}),
      n({value: 4, pitch: 'e3', slur: 2}), n({value: 4, pitch: 'c3', slur: 2}),
      n({value: 4, pitch: 'c3'}), n({value: 4, pitch: 'c3'}), n({value: 4, pitch: 'c3'}), r(),
      // test system break.
      r({value: 2}), n({value: 4, pitch: 'e3', slur: 4}), n({value: 4, pitch: 'e3', slur: 4}), n({value: 16, pitch: 'e3', slur: 4})
    ]);

    var fourfour = scored.timeSig({value: "4/4", measure: 0});

    // create staves
    var system1 = scored.system({duration: {measure: 3}, startsAt: 0, page: 0});
    var system2 = scored.system({duration: {measure: 3}, startsAt: 3, page: 0});
    var system3 = scored.system({duration: {measure: 3}, startsAt: 6, page: 1});
    var system4 = scored.system({duration: {measure: 3}, startsAt: 9, page: 1});

    var page0 = scored.page();
    var page1 = scored.page();

    var score = scored.score({
        systemHeights: [0, 250, 500, 750]
    }, [fourfour, system1, system2, system3, system4, trebleLine, bassLine, page0, page1]);

    // render it all as a score.
    return scored.pluginRender(score, {voices: [soprano, bass], pages: [0]});
}
