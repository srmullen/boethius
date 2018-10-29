export default function testLegatoSystemBreaks (scored) {
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
      // legato across systems
      n({value: 2, pitch: 'a4'}), n({value: 2, pitch: 'a4', legato: 1}), n({value: 1, pitch: 'ab4', legato: 1}), n({value: 1, pitch: 'c5', legato: 2}),
      n({value: 2, pitch: 'a4', legato: 2}), n({value: 2, pitch: 'c5', legato: 1}), n({value: 1, pitch: 'ab4', legato: 1}), n({value: 1, pitch: 'c5', legato: 2}),
      n({value: 2, pitch: 'a4', legato: 2}), n({value: 2, pitch: 'c5', legato: 1}), n({value: 1, pitch: 'ab4', legato: 1}), n({value: 1, pitch: 'c5', legato: 2}),
      n({value: 2, pitch: 'a4', legato: 2}), n({value: 2, pitch: 'c5', legato: 1}), n({value: 1, pitch: 'ab4', legato: 1}), n({value: 1, pitch: 'c5'})
    ]);
    var bass = scored.voice({name: "bass"}, [
      n({value: 1, pitch: 'e3'}), n({value: 1, pitch: 'e3'}),
      // Test system break with muliple notes.
      n({value: 2, pitch: 'e3', legato: 1}), n({value: 2, pitch: 'e3', legato: 1}),
      n({value: 1, pitch: 'e3', legato: 1}),
      // Test system break not ending on the first note of the next system
      n({value: 1, pitch: 'e3'}),
      n({value: 2, pitch: 'e3', legato: 2}), n({value: 2, pitch: 'e3', legato: 2}),
      n({value: 2, pitch: 'e3', legato: 2}), n({value: 2, pitch: 'e3', legato: 2}),
      n({value: 1, pitch: 'e3'}), n({value: 1, pitch: 'f3'}), n({value: 1, pitch: 'g3'}),
      n({value: 1, pitch: 'e3'}), n({value: 1, pitch: 'f3'}), n({value: 1, pitch: 'g3'})
    ]);

    // TODO: test (legato=8 b/8. c/16) (legato=8 d/8 d2/8)

    var fourfour = scored.timeSig({value: "4/4", measure: 0});

    // create staves
    var system1 = scored.system({duration: {measure: 3}, startsAt: 0, page: 0});
    var system2 = scored.system({duration: {measure: 3}, startsAt: 3, page: 0});
    var system3 = scored.system({duration: {measure: 3}, startsAt: 6, page: 0});
    var system4 = scored.system({duration: {measure: 3}, startsAt: 9, page: 1});

    var page0 = scored.page();
    var page1 = scored.page();

    var score = scored.score({
      systemHeights: [0, 250, 500, 750]
    }, [fourfour, system1, system2, system3, system4, trebleLine, bassLine, page0, page1]);

    // render it all as a score.
    return scored.pluginRender(score, {voices: [soprano, bass], pages: [0]});
}
