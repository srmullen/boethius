import { createVoice } from '../helpers';

export default function testMeasureAcrossSystems (scored) {
  const layout = {
    "type": "score",
    score: {
      measureCount: 6
    },
    "timeSignatures": [
      {
        value: [4, 4],
        measure: 0,
        beat: 0
      }
    ],
    "currentPage": 0,
    "pages": [
      {
        "systems": 4,
        "staffSpacing": []
      }
    ],
    "lines": [
      {
        "name": "",
        "clefs": [
          {
            "value": "treble",
            "measure": 0,
            "beat": 0
          }
        ],
        "keys": [
          {
            "root": "C",
            "mode": "major",
            "measure": 0,
            "beat": 0
          }
        ],
        "voices": [
          "rh"
        ]
      }
    ],
    "systems": [
      {
        startsAt: 0,
        "lineSpacing": [
          0
        ],
        "length": 1000
      },
      {
        startsAt: 1.5,
        "lineSpacing": [
          -100
        ],
        "length": 1000
      },
      {
        // The last note on the previous system should cross time 2.5 to
        // test breaking the note aross system, similar to measures.
        startsAt: 2.5,
        "lineSpacing": [
          -200
        ],
        "length": 1000
      }
    ]
  };
  const music = {
    voices: {
      rh: createVoice([
        ['r', 8, {anacrusis: true}], ['a4', 8, {anacrusis: true}], ['b4', 4, {anacrusis: true}], 'c5', 'd5', ['c5', 2]
      ]),
      lh: createVoice([
        ['e3', 4, {anacrusis: true}], [['d3', 'f3'], 4, {anacrusis: true}], 'c3', 'b2', ['a2', 2]
      ])
    }
  };
  return scored.pluginRender(layout, music, {parse: true});
}
