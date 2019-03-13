export default function testChordTies (scored) {
    var n = scored.note;
    var r = scored.rest;
    var c = scored.chord;

    // create lines
    var trebleLine = scored.line({voices: ["treble"]}, [
      scored.clef({value: "treble", measure: 0}), scored.key({value: "c", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
    ]);

    // create voices
    var soprano = scored.voice({name: "treble"}, [
      // Simple ties
      c({value: 4, legato: 1}, ['g4', 'b4']),
      c({value: 4, legato: 1}, ['g4', 'b4']),
      c({value: 4, legato: 2}, ['b4', 'd5']),
      c({value: 4, legato: 2}, ['b4', 'd5']),
      // Multiple tied chords stems down.
      c({value: 16, legato: 3}, ['g4', 'b4']),
      c({value: 16, legato: 3}, ['a4', 'c5']),
      c({value: 16, legato: 3}, ['b4', 'd5']),
      c({value: 16, legato: 3}, ['c5', 'e5']),
      // Multiple tied chords stems up.
      c({value: 16, legato: 4}, ['a4', 'c5']),
      c({value: 16, legato: 4}, ['g4', 'b4']),
      c({value: 16, legato: 4}, ['f4', 'a4']),
      c({value: 16, legato: 4}, ['e4', 'g4']),
      // Tie over stem
      c({value: 4, legato: 5}, ['f4', 'b4']),
      c({value: 4, legato: 5}, ['g4', 'd5']),
      c({value: 4, legato: 5}, ['f4', 'b4']),
      // Tie over note head
      c({value: 4, legato: 4}, ['b4', 'd5']),
      c({value: 4, legato: 4}, ['d5', 'a5']),
      c({value: 4, legato: 4}, ['b4', 'd5']),
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
