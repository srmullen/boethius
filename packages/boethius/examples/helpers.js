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

export function createItem (pitch, value=4, props) {
  if (pitch === 'r') {
    return {
        type: 'rest',
        props: Object.assign({
            value
        }, props)
    };
  } else {
    if (isArray(pitch)) {
      // Item is a chord
      return {
          type: 'chord',
          children: pitch.map(p => createItem(p)),
          props: Object.assign({
              value
          }, props)
      };
    } else {
      // Item is a note.
      return {
          type: 'note',
          props: Object.assign({
              pitch,
              value
          }, props)
      };
    }
  }
}

export function createVoice (voice, defaults={}) {
  return voice.map(note => {
    if (isArray(note)) {
      return createItem.apply(null, note);
    } else {
      return createItem(note, defaults.value);
    }
  });
}

export function createLayout () {
    return {
        "type": "score",
        score: {},
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
