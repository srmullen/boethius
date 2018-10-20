import {createLayout, createVoice} from '../helpers';

export default function testBunchedClefChange (scored) {
  const layout = {
    "type": "score",
    "timeSignatures": [
      {
        "value": [4, 4],
        "measure": 0,
        "beat": 0
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
            "mode": "minor",
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
          },
          {
            "value": "treble",
            "measure": 0,
            "beat": 3
          }
        ],
        "keys": [
          {
            "root": "C",
            "mode": "minor",
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
    ]
  };
  const music = {
    voices: {
      rh: createVoice([
        'eb5', 'd5', 'c5', 'd5', 'eb5', 'f5', ['g5', 8], ['f5', 8], ['r', 8], ['f5', 8],
        ['f5', 8], ['eb5', 8], ['r', 8], ['d5', 8], ['eb5', 8], ['ab4', 8], 'ab4', 'f4', 'bb5', 'f4'
      ], {value: 16}),
      lh: createVoice([
        ['r', 8], 'c4', 'bb3', 'c4', 'd4', 'eb4', 'g3', 'ab3', 'bb3', 'ab3', 'f3', 'eb4', 'f4', 'd4', 'c4',
        'bb3', 'ab4', 'g4', 'f4', 'eb4', 'd4', 'c4', 'bb3', 'c4', 'd4', 'c4', 'd4',
        ['d4', 8, {dots: 1}], ['c4', 32], ['c4', 32]
      ], {value: 16})
    }
  };
  return scored.pluginRender(layout, music, {parse: true});
}
