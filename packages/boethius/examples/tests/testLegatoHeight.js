export default function testLegatoHeight (scored) {
    var n = scored.note;
    var r = scored.rest;
    var c = scored.chord;

    // create lines
    var trebleLine = scored.line({voices: ["treble"]}, [
      scored.clef({value: "treble", measure: 0}), scored.key({value: "c", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
    ]);

    // create voices
    var soprano = scored.voice({name: "treble"}, [
      // Overlapping with all stem up.
      n({value: 16, pitch: 'b4', legato: 1}),
      n({value: 16, pitch: 'g4', legato: 1}),
      n({value: 16, pitch: 'e4', legato: 1}),
      n({value: 16, pitch: 'c4', legato: 1}),
      n({value: 4, pitch: 'a4', legato: 1}),
      // Stem-up ending on stem-down
      n({value: 16, pitch: 'b4', legato: 2}),
      n({value: 16, pitch: 'g4', legato: 2}),
      n({value: 16, pitch: 'e4', legato: 2}),
      n({value: 16, pitch: 'c4', legato: 2}),
      n({value: 4, pitch: 'b4', legato: 2}),
      // All stem down
      n({value: 16, pitch: 'a4', legato: 3}),
      n({value: 16, pitch: 'c5', legato: 3}),
      n({value: 16, pitch: 'f5', legato: 3}),
      n({value: 16, pitch: 'a5', legato: 3}),
      n({value: 4, pitch: 'b4', legato: 3}),
      // Stem-down ending on stem-up.
      n({value: 16, pitch: 'a4', legato: 4}),
      n({value: 16, pitch: 'c5', legato: 4}),
      n({value: 16, pitch: 'f5', legato: 4}),
      n({value: 16, pitch: 'a5', legato: 4}),
      n({value: 4, pitch: 'a4', legato: 4}),
      // Stem-down flat
      n({value: 16, pitch: 'c5', legato: 5}),
      n({value: 16, pitch: 'c5', legato: 5}),
      n({value: 16, pitch: 'c5', legato: 5}),
      n({value: 16, pitch: 'c5', legato: 5}),
      n({value: 4, pitch: 'c5', legato: 5}),
      // Stem-up flat.
      n({value: 16, pitch: 'a4', legato: 6}),
      n({value: 16, pitch: 'a4', legato: 6}),
      n({value: 16, pitch: 'a4', legato: 6}),
      n({value: 16, pitch: 'a4', legato: 6}),
      n({value: 4, pitch: 'a4', legato: 6}),
    ]);

    var fourfour = scored.timeSig({value: "4/4", measure: 0});

    // create staves
    var system1 = scored.system({duration: {measure: 3}, startsAt: 0, page: 0});
    var system2 = scored.system({duration: {measure: 3}, startsAt: 3, page: 0});

    var page0 = scored.page();

    var score = scored.score({
      systemHeights: [0, 250, 500, 750]
    }, [fourfour, system1, system2, trebleLine, page0]);

    // render it all as a score.
    return scored.pluginRender(score, {voices: [soprano], pages: [0]});
}
