import { isArray } from 'lodash';

let legatoId = 1;

export function legato (items) {
    legatoId++;
    return items.map(item => {
        item.legato = legatoId;
        return item;
    });
}

export function staccato (items) {
    return items.map(item => {
        item.staccato = true;
        return item;
    });
}

export function createNote (pitch, value=4, props) {
  if (pitch === 'r') {
    return {
        type: 'rest',
        props: Object.assign({
            value
        }, props)
    };
  } else {
    return {
        type: 'note',
        props: Object.assign({
            pitch,
            value
        }, props)
    };
  }
}

export function createVoice (voice) {
  return voice.map(note => {
    if (isArray(note)) {
      return createNote.apply(null, note);
    } else {
      return createNote(note);
    }
  });
}

export function createLayout () {
    return {
        "type": "score",
        "timeSignatures": [
          {
            "value": [
              4,
              4
            ],
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
              "mel"
            ]
          }
        ],
        "systems": [
          {
            "measures": 3,
            "lineSpacing": [
              0
            ],
            "length": 800
          }
        ]
    };
}
