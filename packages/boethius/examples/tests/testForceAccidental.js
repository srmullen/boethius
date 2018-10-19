export default function testForceAccidental (scored) {
    var n = scored.note;
    var r = scored.rest;
    // create lines
    var line = scored.line({voices: ["treble"]}, [
        scored.clef({value: "treble", measure: 0}), scored.key({value: "c", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
    ]);

    // create voices
    var soprano = scored.voice({name: "treble"}, [
        // Force rendering of accidental from key signature.
        n({pitch: 'eb5', forceAccidental: true}),
        n({pitch: 'c#5'}),
        // Force rendering of accidental introduced in measure.
        n({pitch: 'c#5', forceAccidental: true}),
        // Force rendering of natural accidental.
        n({pitch: 'g4', forceAccidental: true}),
        // parenthesised accidentals.
    ]);

    var fourfour = scored.timeSig({value: "4/4", measure: 0});

    // create staves
    var system = scored.system({measures: 6, indentation: 100, length: 900});

    var page0 = scored.page();

    var score = scored.score({
        length: 1000, systemHeights: [0, 350], title: {value: "Test Force Accidentals", fontSize: 50}
    }, [fourfour, system, line, page0]);

    // render it all as a score.
    return scored.pluginRender(score, {voices: [soprano]});
}
