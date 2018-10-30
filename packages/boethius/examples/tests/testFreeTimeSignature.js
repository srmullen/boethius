import { createVoice } from '../helpers';

export default function testFreeTimeSignature (scored) {
  const layout = {
    "type": "score",
    score: {
      measureCount: 1
    },
    measures: [
      {
        value: 0,
        endsAt: 5,
        timeSig: 'FREE'
      }
    ],
    "timeSignatures": [
      {
        value: 'FREE',
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
      },
      {
        "name": "",
        "clefs": [
          {
            "value": "bass",
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
          "lh"
        ]
      }
    ],
    "systems": [
      {
        startsAt: 0,
        duration: {
          time: 2.5
        },
        "lineSpacing": [
          0
        ],
        "length": 500
      },
      {
        startsAt: 2.5,
        duration: {
          time: 2.5
        },
        "lineSpacing": [
          0
        ],
        "length": 1000
      }
    ]
  };
  const music = {
    voices: {
      rh: createVoice([
        ['r', 8], ['a4', 8], ['b4', 4], 'c5', 'd5', 'b4' ['c5', 2],
        ['d5', 2], 'f5', ['e5', 1], 'e5'
      ]),
      // rh: createVoice([
      //   ['r', 8], ['a4', 8], ['b4', 4], 'c5', 'd5', ['c5', 2]
      // ]),
      lh: createVoice([
        ['e3', 4], [['d3', 'f3'], 4], 'c3', 'b2', ['a2', 2]
      ])
    }
  };
  return scored.pluginRender(layout, music, {parse: true});
}
