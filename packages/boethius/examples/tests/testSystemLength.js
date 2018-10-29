export default function testSystemLength (scored) {
    var n = scored.note;
    var c = scored.chord;
    var r = scored.rest;

    var l1 = scored.line({voices: ["v1"]}, [
      scored.clef({value: "treble", measure: 0}), scored.key({value: "C", measure: 0}), scored.timeSig({value: "4/4", measure: 0}),
    ]);
    var v1 = scored.voice({name: "v1"}, [
      r({value: 2}), n({value: 1}),
      r({value: 4}), n({value: 1})
    ]);

    var l2 = scored.line({voices: ["v2"]}, [
      scored.clef({value: "treble", measure: 0}), scored.key({value: "C", measure: 0}), scored.timeSig({value: "4/4", measure: 0}),
    ]);
    var v2 = scored.voice({name: "v2"}, [
      r({value: 2}), r({value: 4}), n({value: 2}),
      r({value: 4}), r({value: 8}), n({value: 2})
    ]);

    var page0 = scored.page();
    var fourfour = scored.timeSig({value: "4/4", measure: 0});
    var system1 = scored.system({duration: {measure: 4}, startsAt: 0, length: 500});
    var system2 = scored.system({duration: {measure: 4}, startsAt: 4, length: 750});
    var system3 = scored.system({duration: {measure: 4}, startsAt: 8}); // gets length of score.

    var score = scored.score(
      {length: 1000},
      [fourfour, page0, system1, system2, system3, l1, l2]);
    // var score = scored.score({}, [fourfour, page0, system1, system2, l1, l2]);

    // render it all as a score.
    return scored.pluginRender(score, {
      voices: [v1, v2],
      pages: [0]
    });
}
