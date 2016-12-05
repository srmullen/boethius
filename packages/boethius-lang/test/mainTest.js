import {expect} from "chai";
import compile from "../src/main";

describe("boethius compilation", () => {
    describe("note info", () => {
        const {voices} = compile("[mel a4]");
        const note = voices.mel[0];

        it("should add midi property", () => {
            expect(note.props.midi).to.equal(69);
        });

        it("should add frequency property", () => {
            expect(note.props.frequency).to.equal(440);
        });

        it("should add octave property", () => {
            expect(note.props.octave).to.equal(4);
        });

        it("should add interval property", () => {
            expect(note.props.interval).to.equal(9);
        });
    });

    describe("voices", () => {
        it("should not return notes outside of a voice", () => {
            const {voices} = compile("b4 [mel a4] c4");
            expect(voices.mel.length).to.equal(1);
        });

        it("should not return rests outside of a voice", () => {
            const {voices} = compile("b4 [mel a4 r/8] [chords r/4 <c4 e4>] r/4");
            expect(voices.mel.length).to.equal(2);
            expect(voices.chords.length).to.equal(2);
        });
    });

    describe("assignment", () => {
        it("should parse", () => {
            expect(compile("~melvar = (a4 bb4 c5)")).to.be.ok;
        });

        it("should expand declared variable in list", () => {
            expect(compile("~melvar = (a4 bb4 c5) ~melvar2 = (r/8 ~melvar)")).to.be.ok;
        });

        it("should expand variables in voices", () => {
            expect(compile("~melvar = (a4 bb4 c5) [mel ~melvar]")).to.be.ok;
        });

        it("should expand declared variable in list", () => {
            const {voices} = compile("~melvar = (a4 bb4 c5) ~melvar2 = (r/8 ~melvar) [mel ~melvar2]");
            expect(voices.mel.length).to.equal(4);
        });

        it("should return unique notes for expanded variables", () => {
            const {voices} = compile("~melvar = (a4) [mel ~melvar ~melvar a4]");
            expect(voices.mel.length).to.equal(3);
            expect(voices.mel[0]).not.to.equal(voices.mel[2]);
            expect(voices.mel[0]).not.to.equal(voices.mel[1]);
        });

        it("should return unique notes for expanded variables", () => {
            const {voices} = compile("~melvar = (a4) [mel bb4 ~melvar ~melvar a4]");
            expect(voices.mel.length).to.equal(4);
            expect(voices.mel[1]).not.to.equal(voices.mel[3]);
            expect(voices.mel[1]).not.to.equal(voices.mel[2]);
        });

        it("should return unique rests for expanded variables", () => {
            const {voices} = compile("~melvar = (r/16) [mel ~melvar ~melvar r/16]");
            expect(voices.mel.length).to.equal(3);
            expect(voices.mel[0]).not.to.equal(voices.mel[2]);
            expect(voices.mel[0]).not.to.equal(voices.mel[1]);
        });

        it("should return unique rests for expanded variables", () => {
            const {voices} = compile("~melvar = (r/8) [mel r/8 ~melvar ~melvar r/8]");
            expect(voices.mel.length).to.equal(4);
            expect(voices.mel[1]).not.to.equal(voices.mel[3]);
            expect(voices.mel[1]).not.to.equal(voices.mel[2]);
        });
    });
});
