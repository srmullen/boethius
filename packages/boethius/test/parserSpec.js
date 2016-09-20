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

import {parse} from "../src/utils/parser";

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
});
