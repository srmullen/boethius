import {expect} from "chai";

import Voice from "../src/views/Voice";
import Note from "../src/views/Note";
import Rest from "../src/views/Rest";
import Chord from "../src/views/Chord";
import System from "../src/views/System";
import Line from "../src/views/Line";
import Measure from "../src/views/Measure";
import Clef from "../src/views/Clef";
import Key from "../src/views/Key";
import TimeSignature from "../src/views/TimeSignature";
import Dynamic from "../src/views/Dynamic";
import ChordSymbol from "../src/views/ChordSymbol";
import Score from "../src/views/Score";

import { parse, parseLayout } from "../src/utils/parser";

describe("parser", () => {
    describe("parse", () => {
        describe("leaf nodes", () => {
            it("should convert a note", () => {
                expect(parse({type: "note", props: {}, children: []})).to.be.instanceof(Note);
            });

            it("should convert a rest", () => {
                expect(parse({type: "rest", props: {}, children: []})).to.be.instanceof(Rest);
            });

            it("should convert a clef", () => {
                expect(parse({type: "clef", props: {}, children: []})).to.be.instanceof(Clef);
            });

            it("should convert a dynamic", () => {
                expect(parse({type: "dynamic", props: {}, children: []})).to.be.instanceof(Dynamic);
            });

            it("should convert a TimeSignature", () => {
                expect(parse({type: "timeSig", props: {}, children: []})).to.be.instanceof(TimeSignature);
            });

            it("should convert a key", () => {
                expect(parse({type: "key", props: {}, children: []})).to.be.instanceof(Key);
            });
        });

        describe("inner nodes (items with children)", () => {
            it("should convert chords", () => {
                const c = parse({
                    type: "chord",
                    props: {},
                    children: [{type: "note", props: {pitch: "c3"}}, {type: "note", props: {pitch: "e3"}}]
                });

                expect(c).to.be.instanceof(Chord);
                expect(c.children[0]).to.be.instanceof(Note);
                expect(c.children[0]).to.be.instanceof(Note);
            });

            it("should convert voices", () => {
                const v = parse({
                    type: "voice",
                    props: {name: "violin"},
                    children: [{type: "note", props: {}}, {type: "rest", props: {}}, {type: "dynamic", props: {}}]
                });

                expect(v).to.be.instanceof(Voice);
                expect(v.children[0]).to.be.instanceof(Note);
                expect(v.children[1]).to.be.instanceof(Rest);
                expect(v.children[2]).to.be.instanceof(Dynamic);
            });
        });
    });

    describe('parseLayout', () => {
      it('should add startsAt to systems if it doesnt exist', () => {
        const layout = Object.assign({}, defaultLayout(), {
          systems: [
            {
              duration: {measure: 2}
            }
          ]
        });
        const v = parseLayout(layout);
        expect(v.score.systems[0].props).to.be.ok;
        expect(v.score.systems[0].props.startsAt).to.eql({measure: 0, beat: 0});
      });

      it('should default the adding system to the type of an initial given startsAt value.', () => {
        const layout = Object.assign({}, defaultLayout(), {
          systems: [
            {
              duration: {measure: 2, beat: 1}
            },
            {
              duration: {measure: 3}
            },
            {
              duration: {measure: 3}
            }
          ]
        });
        const v = parseLayout(layout);
        expect(v.score.systems[1].props.startsAt).to.eql({measure: 2, beat: 1});
        expect(v.score.systems[2].props.startsAt).to.eql({measure: 5, beat: 1});
      });
    });

    it('should use hard time adding if original startsAt is a number', () => {
      const layout = Object.assign({}, defaultLayout(), {
        systems: [
          {
            startsAt: 0,
            duration: {time: 2.5}
          },
          {
            duration: {time: 3}
          },
          {
            duration: {time: 3}
          }
        ]
      });
      const v = parseLayout(layout);
      expect(v.score.systems[1].props.startsAt).to.eql(2.5);
      expect(v.score.systems[2].props.startsAt).to.eql(5.5);
    });
});

function defaultLayout () {
  return {
    "type": "score",
    score: {},
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
        startsAt: 0,
        duration: {
          measure: 2
        },
        "lineSpacing": [
          0
        ],
        "length": 1000
      }
    ]
  };
}
