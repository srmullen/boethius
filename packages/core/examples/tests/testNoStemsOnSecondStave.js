export default function testNoStemsOnSecondStave (scored) {
  var timeSig = scored.timeSig({value: "4/4", measure: 0});

  var line = scored.line({voices: ["v"]}, [
    scored.clef({value: "treble", measure: 0}),
    scored.key({value: "C", measure: 0}),
    scored.timeSig({value: "4/4", measure: 0})
  ]);

  var system1 = scored.system({duration: {measure: 1}, startsAt: 0});
  var system2 = scored.system({duration: {measure: 1}, startsAt: 1});

  var page0 = scored.page();

  var score = scored.score({}, [timeSig, line, system1, system2, page0]);

  var n = scored.note;
  var voice = scored.voice({name: "v"}, [
      n(), n(), n(), n(),
      n(), n(), n(), n(),
      n()
  ]);

  return scored.pluginRender(score, {voices: [voice]});
}
