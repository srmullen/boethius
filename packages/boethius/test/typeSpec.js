import {expect} from "chai";

import {
    isChord,
    isClef,
    isKey,
    isLine,
    isMeasure,
    isNote,
    isRest,
    isScore,
    isStaff,
    isTimeSignature,
    isVoice,
    isMarking,
    isDynamic
} from "../src/types";

import Scored from "../src/Scored";

describe("types", () => {
    const scored = new Scored();

    describe("isChord", () => {
        it("should return true if the given item is a Chord, false otherwise", () => {
            expect(isChord(scored.chord({}, ["c4", "d4"]))).to.be.true;
            expect(isChord(scored.rest())).to.be.false;
        });
    });

    describe("isClef", () => {
        it("should return true if the given item is a Clef, false otherwise", () => {
            expect(isClef(scored.clef())).to.be.true;
            expect(isClef(scored.key())).to.be.false;
        });
    });

    describe("isDynamic", () => {
        it("should return true if the given item is a Dynamic, false otherwise", () => {
            expect(isDynamic(scored.dynamic({value: "f"}))).to.be.true;
            expect(isDynamic(scored.rest())).to.be.false;
        });
    });

    describe("isKey", () => {
        it("should return true if the given item is a Key, false otherwise", () => {
            expect(isKey(scored.key())).to.be.true;
            expect(isKey(scored.timeSig())).to.be.false;
        });
    });

    describe("isLine", () => {
        it("should return true if the given item is a Line, false otherwise", () => {
            expect(isLine(scored.line())).to.be.true;
            expect(isLine(scored.chord({}, ["c4", "d4"]))).to.be.false;
        });
    });

    describe("isMeasure", () => {
        it("should return true if the given item is a Measure, false otherwise", () => {
            expect(isMeasure(scored.measure({timeSig: scored.timeSig()}))).to.be.true;
            expect(isMeasure(scored.rest())).to.be.false;
        });
    });

    describe("isNote", () => {
        it("should return true if the given item is a Note, false otherwise", () => {
            expect(isNote(scored.note())).to.be.true;
            expect(isNote(scored.chord({}, ["c4", "d4"]))).to.be.false;
        });
    });

    describe("isRest", () => {
        it("should return true if the given item is a Rest, false otherwise", () => {
            expect(isRest(scored.rest())).to.be.true;
            expect(isRest(scored.note())).to.be.false;
        });
    });

    xdescribe("isScore", () => {
        it("should return true if the given item is a Score, false otherwise", () => {
            expect(isScore(scored.score())).to.be.true;
            expect(isScore(scored.staff())).to.be.false;
        });
    });

    describe("isStaff", () => {
        it("should return true if the given item is a Staff, false otherwise", () => {
            expect(isStaff(scored.staff())).to.be.true;
            expect(isStaff(scored.chord({}, ["c4", "d4"]))).to.be.false;
        });
    });

    describe("isTimeSignature", () => {
        it("should return true if the given item is a TimeSignature, false otherwise", () => {
            expect(isTimeSignature(scored.timeSig())).to.be.true;
            expect(isTimeSignature(scored.clef())).to.be.false;
        });
    });

    describe("isMarking", () => {
        it("should return true if the given item is a Marking, false otherwise", () => {
            expect(isMarking(scored.clef())).to.be.true;
            expect(isMarking(scored.key())).to.be.true;
            expect(isMarking(scored.timeSig())).to.be.true;
            expect(isMarking(scored.measure({timeSig: scored.timeSig()}))).to.be.false;
        });
    });
});
