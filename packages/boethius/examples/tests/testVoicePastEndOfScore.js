export default function testVoicePastEndOfScore (scored) {
  var timeSig = scored.timeSig({value: "4/4", measure: 0});

  var line = scored.line({voices: ["v"]}, [
    scored.clef({value: "treble", measure: 0}),
    scored.key({value: "C", measure: 0}),
    scored.key({value: "d", measure: 1}),
    scored.timeSig({value: "4/4", measure: 0})
  ]);

  var system = scored.system({measures: 2, startMeasure: 0});

  var voice = scored.voice({name: "v"}, [
    scored.note({pitch: "a4", value: 1}),
    scored.note({pitch: "a4", value: 1}),
    scored.note({pitch: "bb4", value: 4})
  ]);

  var page0 = scored.page();

  var score = scored.score({}, [timeSig, system, line, page0]);

  return scored.pluginRender(score, {voices: [voice]});
}
