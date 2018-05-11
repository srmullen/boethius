import {expect} from "chai";

import Scored from "../src/Scored";
import Note from "../src/views/Note";
import Rest from "../src/views/Rest";
import {getSteps, getAverageStemDirection, parsePitch, hasPitch} from "../src/utils/note";

describe("Note", () => {
    let scored = new Scored();

    describe("getSteps", () => {
        it("should return the number of visible steps on a staff between given note values", () => {
            expect(getSteps("b4", "b4")).to.equal(0);
            expect(getSteps("b4", "a4")).to.equal(-1);
            expect(getSteps("b4", "ab4")).to.equal(-1);
            expect(getSteps("b4", "a#4")).to.equal(-1);
            expect(getSteps("b4", "g#4")).to.equal(-2);
            expect(getSteps("b4", "gb4")).to.equal(-2);
            expect(getSteps("b4", "b3")).to.equal(-7);

            expect(getSteps("b4", "c5")).to.equal(1);
            expect(getSteps("b4", "b5")).to.equal(7);
            expect(getSteps("b4", "c#5")).to.equal(1);
            expect(getSteps("b4", "c6")).to.equal(8);
            expect(getSteps("b4", "d6")).to.equal(9);
        });
    });

    describe("getAverageStemDirection", () => {
        it("should return an array of stem directions", () => {
            let centerLine = "b4",
                e4 = scored.note({pitch: "e4", value: 16}),
                f4 = scored.note({pitch: "f4", value: 16}),
                g4 = scored.note({pitch: "g4", value: 16}),
                a4 = scored.note({pitch: "a4", value: 16}),
                b4 = scored.note({pitch: "b4", value: 16}),
                c5 = scored.note({pitch: "c5", value: 16}),
                d5 = scored.note({pitch: "d5", value: 16}),
                e5 = scored.note({pitch: "e5", value: 16}),
                f5 = scored.note({pitch: "f5", value: 16});

            const centerLines = _.fill(new Array(4), centerLine);
            expect(getAverageStemDirection([e4, f4, g4, a4], centerLines)).to.eql(["up", "up", "up", "up"]);
            expect(getAverageStemDirection([g4, a4, b4, c5], centerLines)).to.eql(["up", "up", "up", "up"]);
            expect(getAverageStemDirection([a4, b4, c5, d5], centerLines)).to.eql(["down", "down", "down", "down"]);
            expect(getAverageStemDirection([d5, c5, b4, a4], centerLines)).to.eql(["down", "down", "down", "down"]);
            expect(getAverageStemDirection([e4, e5], centerLines)).to.eql(["up", "up"]);
            expect(getAverageStemDirection([e4, f5], centerLines)).to.eql(["down", "down"]);
        });

        it("should handle chords and notes", () => {
            let centerLine = "b4",
                e4 = scored.note({pitch: "e4", value: 16}),
                f4 = scored.note({pitch: "f4", value: 16}),
                g4 = scored.note({pitch: "g4", value: 16}),
                a4 = scored.note({pitch: "a4", value: 16}),
                b4 = scored.note({pitch: "b4", value: 16}),
                c5 = scored.note({pitch: "c5", value: 16}),
                d5 = scored.note({pitch: "d5", value: 16}),
                e5 = scored.note({pitch: "e5", value: 16}),
                f5 = scored.note({pitch: "f5", value: 16}),
                fmaj = scored.chord({value: 16}, ["f4", "a4", "c5"]),
                gmaj = scored.chord({value: 16}, ["g4", "b4", "d5"]),
                amin = scored.chord({value: 16}, ["a4", "c5", "e5"]),
                bdim = scored.chord({value: 16}, ["b4", "d5", "f5"]);

            const centerLines = _.fill(new Array(4), centerLine);
            expect(getAverageStemDirection([e4, fmaj, g4, a4], centerLines)).to.eql(["up", "up", "up", "up"]);
            expect(getAverageStemDirection([gmaj, a4, b4, c5], centerLines)).to.eql(["down", "down", "down", "down"]);
            expect(getAverageStemDirection([gmaj, a4, g4, e4], centerLines)).to.eql(["up", "up", "up", "up"]);
            expect(getAverageStemDirection([amin, bdim], centerLines)).to.eql(["down", "down"]);
            expect(getAverageStemDirection([fmaj, gmaj], centerLines)).to.eql(["up", "up"]);
            expect(getAverageStemDirection([fmaj, bdim], centerLines)).to.eql(["down", "down"]);
        });
    });

    describe("parsePitch", () => {
        it("should return an object with name, accidental, and octave", () => {
            expect(parsePitch("a4")).to.eql({name: "a", octave: "4", accidental: ""});
            expect(parsePitch("a#4")).to.eql({name: "a", octave: "4", accidental: "#"});
            expect(parsePitch("ax4")).to.eql({name: "a", octave: "4", accidental: "x"});
            expect(parsePitch("b12")).to.eql({name: "b", octave: "12", accidental: ""});
            expect(parsePitch("cbb5")).to.eql({name: "c", octave: "5", accidental: "bb"});
        });

        it("should not require octave", () => {
            expect(parsePitch("a")).to.eql({name: "a", octave: "", accidental: ""});
            expect(parsePitch("a#")).to.eql({name: "a", octave: "", accidental: "#"});
            expect(parsePitch("ax")).to.eql({name: "a", octave: "", accidental: "x"});
            expect(parsePitch("b")).to.eql({name: "b", octave: "", accidental: ""});
            expect(parsePitch("cbb")).to.eql({name: "c", octave: "", accidental: "bb"});
        });
    });

    describe("hasPitch", () => {
        it("should return true if the pitch is diatonic to the given key", () => {
            let cMajor = scored.key({value: "C"});
            expect(hasPitch(cMajor, parsePitch("c4"))).to.be.true;
            expect(hasPitch(cMajor, parsePitch("c#4"))).to.be.false;
            expect(hasPitch(cMajor, parsePitch("b2"))).to.be.true;
            expect(hasPitch(cMajor, parsePitch("bbb8"))).to.be.false;

            let fMinor = scored.key({value: "f"});
            expect(hasPitch(fMinor, parsePitch("ab6"))).to.be.true;
            expect(hasPitch(fMinor, parsePitch("c#4"))).to.be.false;
            expect(hasPitch(fMinor, parsePitch("eb3"))).to.be.true;
            expect(hasPitch(fMinor, parsePitch("d8"))).to.be.false;
        });
    });

    describe("equals", () => {
        it("should compare type", () => {
            const n = new Note({});
            const r = new Rest({});
            expect(n.equals(r)).to.be.false;
        });

        it("should compare value", () => {
            const n1 = new Note({value: 4});
            const n2 = new Note({value: 8});
            const n3 = new Note({value: 4});
            expect(n1.equals(n2)).to.be.false;
            expect(n1.equals(n3)).to.be.true;
        });

        it("should compare pitch", () => {
            const n1 = new Note({pitch: "a4"});
            const n2 = new Note({pitch: "b5"});
            const n3 = new Note({pitch: "a4"});
            expect(n1.equals(n2)).to.be.false;
            expect(n1.equals(n3)).to.be.true;
        });

        it("should compare dots", () => {
            const n1 = new Note({dots: 1});
            const n2 = new Note({dots: 2});
            const n3 = new Note({dots: 1});
            expect(n1.equals(n2)).to.be.false;
            expect(n1.equals(n3)).to.be.true;
        });

        it("should compare tuplet", () => {
            const n1 = new Note({tuplet: "3/4"});
            const n2 = new Note({tuplet: "2/3"});
            const n3 = new Note({tuplet: "3/4"});
            expect(n1.equals(n2)).to.be.false;
            expect(n1.equals(n3)).to.be.true;
        });

        it("should compare time", () => {
            const n1 = new Note({time: 4});
            const n2 = new Note({time: 8});
            const n3 = new Note({time: 4});
            expect(n1.equals(n2)).to.be.false;
            expect(n1.equals(n3)).to.be.true;
        });

        it("should compare voice", () => {
            const n1 = new Note({voice: "treble"});
            const n2 = new Note({voice: "bass"});
            const n3 = new Note({voice: "treble"});
            expect(n1.equals(n2)).to.be.false;
            expect(n1.equals(n3)).to.be.true;
        });

        it("should compare slur", () => {
            const n1 = new Note({slur: 4});
            const n2 = new Note({slur: 8});
            const n3 = new Note({slur: 4});
            expect(n1.equals(n2)).to.be.false;
            expect(n1.equals(n3)).to.be.true;
        });

        it("should compare staccato", () => {
            const n1 = new Note({staccato: true});
            const n2 = new Note({});
            const n3 = new Note({staccato: true});
            expect(n1.equals(n2)).to.be.false;
            expect(n1.equals(n3)).to.be.true;
        });

        it("should compare tenuto", () => {
            const n1 = new Note({tenuto: true});
            const n2 = new Note({});
            const n3 = new Note({tenuto: true});
            expect(n1.equals(n2)).to.be.false;
            expect(n1.equals(n3)).to.be.true;
        });

        it("should compare portato", () => {
            const n1 = new Note({portato: true});
            const n2 = new Note({});
            const n3 = new Note({portato: true});
            expect(n1.equals(n2)).to.be.false;
            expect(n1.equals(n3)).to.be.true;
        });
    });
});
