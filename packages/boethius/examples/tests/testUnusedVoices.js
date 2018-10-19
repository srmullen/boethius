export default function testUnusedVoices (scored) {
    var n = scored.note;
    var c = scored.chord;
    // create lines
    var trebleLine = scored.line({voices: ["treble"]}, [
        scored.clef({value: "treble", measure: 0}), scored.key({value: "C", measure: 0}), scored.timeSig({value: "4/4", measure: 0}),
    ]);

    var unused = scored.voice({name: "unused"}, [
        n({slur: 1}), n({slur: 1})
    ]);
    // create voices
    var soprano = scored.voice({name: "treble"}, [
        n({value: 1, pitchClass: "c", octave: 5}),
        n({value: 2, pitchClass: "c", octave: 5}), n({value: 2, pitchClass: "f", octave: 5}),
        n({value: 4, pitch: "f4"}), n({value: 4, pitch: "c5", slur: 2}), n({value: 4, pitch: "c5", slur: 2}), n({value: 4, pitch: "g4"}),
        c({value: 1}, [{pitchClass: "g", octave: 4}, {pitchClass: "d", octave: 5}]),
        c({value: 2}, [{pitchClass: "bb", octave: 4}, {pitchClass: "f", octave: 5}]),
        c({value: 4}, [{pitchClass: "d", octave: 5}, {pitchClass: "f", octave: 5}]),
        c({value: 4}, [{pitchClass: "f", octave: 4}, {pitchClass: "eb", octave: 5}])
    ]);

    var page0 = scored.page();
    var fourfour = scored.timeSig({value: "4/4", measure: 0});
    var system1 = scored.system({measures: 6});

    var score = scored.score({length: 1000}, [fourfour, page0, system1, trebleLine]);

    // render it all as a score.
    return scored.pluginRender(score, {
        voices: [unused, soprano],
        pages: [0]
    });
}
