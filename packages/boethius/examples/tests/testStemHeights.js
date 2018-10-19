export default function testStemHeights (scored) {
    var n = scored.note;
    var r = scored.rest;
    var c = scored.chord;

    // create lines
    var trebleLine = scored.line({voices: ["treble"]}, [
        scored.clef({value: "treble", measure: 0}), scored.key({value: "c", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
    ]);

    // create voices
    var soprano = scored.voice({name: "treble"}, [
        n({value: 16, pitch: 'a4'}),
        n({value: 16, pitch: 'c4'}),
        n({value: 16, pitch: 'f4'}),
        n({value: 16, pitch: 'a5'}), // FIXME: This stem is too short!
        n({value: 4, pitch: 'b4'}),
    ]);

    var fourfour = scored.timeSig({value: "4/4", measure: 0});

    // create staves
    var system1 = scored.system({measures: 3, page: 0});
    var system2 = scored.system({measures: 3, page: 0});

    var page0 = scored.page();

    var score = scored.score({
        systemHeights: [0, 250, 500, 750]
    }, [fourfour, system1, system2, trebleLine, page0]);

    // render it all as a score.
    return scored.pluginRender(score, {voices: [soprano], pages: [0]});
}
