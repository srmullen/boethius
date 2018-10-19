import { legato, staccato } from '../helpers';

export default function testLegato (scored) {
  var n = scored.note;
  var r = scored.rest;
  var c = scored.chord;

  // create lines
  var trebleLine = scored.line({voices: ["treble"]}, [
    scored.clef({value: "treble", measure: 0}), scored.key({value: "C", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
  ]);
  var bassLine = scored.line({voices: ["bass"]}, [
    scored.clef({value: "bass", measure: 0}), scored.key({value: "C", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
  ]);

  // create voices
  var soprano = scored.voice({name: "treble"}, [
    // Top point is stem of last item.
    r({value: 2}),
    ...staccato(
        [n({value: 8, pitch: 'f5'})].concat(
            legato([n({value: 8, pitch: 'a4'}), n({value: 8, pitch: 'b4'}),
            n({value: 8, pitch: 'c5'}), n({value: 8, pitch: 'd5'})])
      )
    ),
    ...legato([
        n({value: 8, pitch: 'f#4'}), n({value: 8, pitch: 'g4'}), n({value: 8, pitch: 'a4'}),
        n({value: 8, pitch: 'g5'}), n({value: 8, pitch: 'd4'})
    ])
  ]);
  var bass = scored.voice({name: "bass"}, [

  ]);

  // TODO: test (legato=8 b/8. c/16) (legato=8 d/8 d2/8)

  var fourfour = scored.timeSig({value: "4/4", measure: 0});

  // create staves
  var system1 = scored.system({measures: 3, page: 0, length: 1000});
  var system2 = scored.system({measures: 3, page: 0});
  var system3 = scored.system({measures: 3, page: 0});
  var system4 = scored.system({measures: 3, page: 1});

  var page0 = scored.page();
  var page1 = scored.page();

  var score = scored.score({
    systemHeights: [0, 250, 500, 750]
  }, [fourfour, system1, system2, system3, system4, trebleLine, bassLine, page0, page1]);

  // render it all as a score.
  return scored.pluginRender(score, {voices: [soprano, bass], pages: [0]});
}
