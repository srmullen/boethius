function run () {
    twoSystemsOneSlur().translate(25, 50);
}

function twoSystemsOneSlur () {
    var line = scored.line({voices: ["v1"]}, [scored.clef({value: "treble", measure: 0}),
                                 scored.key({value: "c", measure: 0}),
                                 scored.timeSig({value: "4/4", measure: 0})
                             ]);

    var system1 = scored.system({measures: 2}, []);
    var system2 = scored.system({measures: 2}, []);

    var voice = scored.voice({name: "v1"}, [
        scored.note({value: 1, pitch: "c5", slur: 1}), scored.note({value: 1, pitch: "c5", slur: 1}),
        scored.note({value: 4, pitch: "f4", slur: 2}), scored.note({value: 4, pitch: "c5", slur: 2})
    ]);

    var fourfour = scored.timeSig({value: "4/4", measure: 0});

    var score = scored.score({systemHeights: [0, 100]}, [fourfour, system1, system2, line]);

    return scored.render(score, {voices: [voice]});
}
