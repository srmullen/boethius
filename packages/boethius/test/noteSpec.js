import {expect} from "chai";

import Scored from "../src/Scored";
import Note from "../src/views/Note";
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

            expect(getAverageStemDirection([e4, f4, g4, a4], centerLine)).to.eql(["up", "up", "up", "up"]);
            expect(getAverageStemDirection([g4, a4, b4, c5], centerLine)).to.eql(["up", "up", "up", "up"]);
            expect(getAverageStemDirection([a4, b4, c5, d5], centerLine)).to.eql(["down", "down", "down", "down"]);
            expect(getAverageStemDirection([d5, c5, b4, a4], centerLine)).to.eql(["down", "down", "down", "down"]);
            expect(getAverageStemDirection([e4, e5], centerLine)).to.eql(["up", "up"]);
            expect(getAverageStemDirection([e4, f5], centerLine)).to.eql(["down", "down"]);
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

            expect(getAverageStemDirection([e4, fmaj, g4, a4], centerLine)).to.eql(["up", "up", "up", "up"]);
            expect(getAverageStemDirection([gmaj, a4, b4, c5], centerLine)).to.eql(["down", "down", "down", "down"]);
            expect(getAverageStemDirection([gmaj, a4, g4, e4], centerLine)).to.eql(["up", "up", "up", "up"]);
            expect(getAverageStemDirection([amin, bdim], centerLine)).to.eql(["down", "down"]);
            expect(getAverageStemDirection([fmaj, gmaj], centerLine)).to.eql(["up", "up"]);
            expect(getAverageStemDirection([fmaj, bdim], centerLine)).to.eql(["down", "down"]);
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
});
