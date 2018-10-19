import {legato, staccato, createLayout, createNote, createVoice} from '../helpers';

export default function testBunchedClefChange (scored) {
  const layout = {
    "type": "score",
    "timeSignatures": [
      {
        "value": "c",
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
        "length": 800
      }
    ]
  };
  const music = {
    voices: {
      rh: createVoice(['a4', ['b4', 8], ['c5']]),
      lh: createVoice([['a4', 8], 'b4', ['c5']])
    }
  };
  return scored.pluginRender(layout, music, {parse: true});
}
