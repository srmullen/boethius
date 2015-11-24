import {expect} from "chai";

import {getAccidental, createAccidentalContext} from "../src/utils/accidental";
import {parsePitch} from "../src/utils/note";

describe("accidental", () => {
    describe("getAccidental", () => {
        it("should return the pitches accidental if accidentals is empty", () => {
            expect(getAccidental(parsePitch("a4"), [])).to.equal("");
            expect(getAccidental(parsePitch("a#5"), [])).to.equal("#");
            expect(getAccidental(parsePitch("bb6"), [])).to.equal("b");
            expect(getAccidental(parsePitch("cx7"))).to.equal("x");
            expect(getAccidental(parsePitch("cbb8"))).to.equal("bb");
        });

        it("should return an empty string if the pitches accidental is already in context", () => {
            expect(getAccidental(parsePitch("a#5"), [parsePitch("a#5")])).to.equal("");
            expect(getAccidental(parsePitch("bb6"), [parsePitch("bb6")])).to.equal("");
            expect(getAccidental(parsePitch("cx7"), [parsePitch("cx7")])).to.equal("");
            expect(getAccidental(parsePitch("cbb8"), [parsePitch("cbb8")])).to.equal("");
            expect(getAccidental(parsePitch("d4"), [parsePitch("dn4")])).to.equal("");
        });

        it("should return the pitches accidental if the accidental was realized in a different octave", () => {
            expect(getAccidental(parsePitch("a#5"), [parsePitch("a#1")])).to.equal("#");
            expect(getAccidental(parsePitch("bb6"), [parsePitch("bb2")])).to.equal("b");
            expect(getAccidental(parsePitch("cx7"), [parsePitch("cx3")])).to.equal("x");
            expect(getAccidental(parsePitch("cbb8"), [parsePitch("cbb4")])).to.equal("bb");
            expect(getAccidental(parsePitch("d4"), [parsePitch("dn5")])).to.equal("");
        });

        it("should return a natural if the pitch has no accidental but on has already been realized", () => {
            expect(getAccidental(parsePitch("a5"), [parsePitch("a#5")])).to.equal("n");
            expect(getAccidental(parsePitch("b6"), [parsePitch("bb6")])).to.equal("n");
            expect(getAccidental(parsePitch("c7"), [parsePitch("cx7")])).to.equal("n");
            expect(getAccidental(parsePitch("c8"), [parsePitch("cbb8")])).to.equal("n");
        });

        it("should return the pitches accidental if the contexts accidental is different", () => {
            expect(getAccidental(parsePitch("a#5"), [parsePitch("ab5")])).to.equal("#");
            expect(getAccidental(parsePitch("bb6"), [parsePitch("b#6")])).to.equal("b");
            expect(getAccidental(parsePitch("cx7"), [parsePitch("cn7")])).to.equal("x");
            expect(getAccidental(parsePitch("cbb8"), [parsePitch("cx8")])).to.equal("bb");
        });
    });

    describe("createAccidentalContext", () => {

    });
});
