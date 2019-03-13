export default function testBarlineNoteBreaks (scored) {
    var n = scored.note;
    var c = scored.chord;
    var r = scored.rest;

    // whole note => two half notes
    // whole => quarter | dotted half
    var l1 = scored.line({voices: ["v1"]}, [
      scored.clef({value: "treble", measure: 0}), scored.key({value: "C", measure: 0}), scored.timeSig({value: "4/4", measure: 0}),
    ]);
    var v1 = scored.voice({name: "v1"}, [
      r({value: 2}), n({value: 1}),
      r({value: 4}), n({value: 1})
    ]);

    // half note => two quarter notes
    // half => dotted quarter | eighth
    var l2 = scored.line({voices: ["v2"]}, [
      scored.clef({value: "treble", measure: 0}), scored.key({value: "C", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
    ]);
    var v2 = scored.voice({name: "v2"}, [
      r({value: 2}), r({value: 4}), n({value: 2}),
      r({value: 4}), r({value: 8}), n({value: 2})
    ]);

    // quarter note => two eigth notes
    // quarter => dotted eighth | sixteenth
    var l3 = scored.line({voices: ["v3"]}, [
      scored.clef({value: "treble", measure: 0}), scored.key({value: "C", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
    ]);
    var v3 = scored.voice({name: "v3"}, [
      r({value: 2}), r({value: 4}), r({value: 8}), n({value: 4}),
      r({value: 8}), r({value: 4}), r({value: 4}), r({value: 16}), n({value: 4})
    ]);

    // eighth note => two sixteenth notes
    // eighth => 32nd | dotted sixteenth
    var l4 = scored.line({voices: ["v4"]}, [
      scored.clef({value: "treble", measure: 0}), scored.key({value: "C", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
    ]);
    var v4 = scored.voice({name: "v4"}, [
      r({value: 2}), r({value: 4}), r({value: 8}), r({value: 16}), n({value: 8}),
      r({value: 8, dots: 1}), r({value: 4}), r({value: 4}), r({value: 8}), r({value: 16, dots: 1}), n({value: 8})
    ]);

    // 1/4. => 1/4 1/8
    // 1/2 => 1/8 1/4.
    var l5 = scored.line({voices: ["v5"]}, [
      scored.clef({value: "treble", measure: 0}), scored.key({value: "C", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
    ]);
    var v5 = scored.voice({name: "v5"}, [
      r({value: 2}), r({value: 4}), n({value: 4, dots: 1}), r({value: 8}),
      r({value: 4}), r({value: 4}), r({value: 8}), n({value: 2})
    ]);

    var page0 = scored.page();
    var fourfour = scored.timeSig({value: "4/4", measure: 0});
    var system1 = scored.system({duration: {measure: 4}, startsAt: 0});

    var score = scored.score({length: 1000}, [fourfour, page0, system1, l1, l2, l3, l4, l5]);
    // var score = scored.score({}, [fourfour, page0, system1, l1, l2, l3, l4]);

    // render it all as a score.
    return scored.pluginRender(score, {
      voices: [v1, v2, v3, v4, v5],
      pages: [0]
    });
}
