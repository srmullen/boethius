import { createVoice } from '../helpers';

export default function testAnacrusis (scored) {
  // FIXME: Throw error here until implemented.
  throw new Error("Not working yet!");
  const layout = {
    "type": "score",
    "timeSignatures": [
      // {
      //   "value": [2, 4],
      //   "measure": 0,
      //   "beat": 0
      // },
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
        "measures": 2,
        "lineSpacing": [
          0
        ],
        "length": 1000
      }
    ],
    // measures:[{
    //   anacrusis: true,
    //   value: 0,
    //   timeSig: '2/4'
    // }]
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
