import {createVoice} from '../helpers';

export default function testNoteArticulations (scored) {
  const layout = {
    "type": "score",
    score: {
      title: 'Note Articulations'
    },
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
        duration: {"measure": 2},
        startsAt: 0,
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
        ['a4', 4, {staccato: true}], ['a4', 4, {tenuto: true}], ['a4', 4, {tenuto: true, staccato: true}],
        ['a4', 4, {accent: true}], ['a4', 4, {fermata: true}], [['a4', 'bb4'], 4, {accent: true}],
        [['a4', 'bb4'], 4, {fermata: true}], ['r', 4, {fermata: true}]
      ]),
      lh: createVoice([
        ['e3', 4, {staccato: true}], ['e3', 4, {tenuto: true}], ['e3', 4, {tenuto: true, staccato: true}],
        ['e3', 4, {accent: true}], ['e3', 4, {fermata: true}], [['e3', 'g3'], 4, {accent: true}],
        [['e3', 'g3'], 4, {fermata: true}], ['r', 4, {fermata: true}]
      ])
    }
  };
  return scored.pluginRender(layout, music, {parse: true});
}
