import {expect} from "chai";
import compile from "../src/main";

describe("boethius compilation", () => {
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

        it("should return unique chords for expanded variables", () => {
            const {voices} = compile("~melvar = (<c4 e4>) [mel ~melvar ~melvar <c4 e4>]");
            expect(voices.mel.length).to.equal(3);
            expect(voices.mel[0]).not.to.equal(voices.mel[2]);
            expect(voices.mel[0]).not.to.equal(voices.mel[1]);
        });

        it("should return unique chords for expanded variables", () => {
            const {voices} = compile("~melvar = (<d5 bb5>) [mel <d5 bb5> ~melvar ~melvar <d5 bb5>]");
            expect(voices.mel.length).to.equal(4);
            expect(voices.mel[1]).not.to.equal(voices.mel[3]);
            expect(voices.mel[1]).not.to.equal(voices.mel[2]);
        });
    });

    describe("pitch class and octave", () => {
        it("should allow entry of pitch classes without octave", () => {
            const {voices} = compile(
                `~lower = (a b c d e f g)
                ~upper = (A B C D E F G)
                ~accdtls = (Ab gbb F# d##)
                [lower ~lower]
                [upper ~upper]
                [accdtls ~accdtls]`
            );
            expect(voices.lower.length).to.equal(7);
            expect(voices.upper.length).to.equal(7);
            expect(voices.accdtls.length).to.equal(4);
        });

        it("should assign octave as property", () => {
            const {voices} = compile("~mel = (a (octave=8 a)) [mel ~mel]");
            expect(voices.mel[0].props.octave).not.to.be.ok;
            expect(voices.mel[1].props.octave).to.equal(8);
        });
    });

    describe("nested scopes", () => {
        it("should flatten nested scopes", () => {
            const {voices} = compile("~mel = (a3 (foo=1 a4 (bar=2 a4))) [mel ~mel]");
            expect(voices.mel.length).to.equal(3);
            expect(voices.mel[1].props.foo).to.equal(1);
            expect(voices.mel[1].props.bar).not.to.be.ok;
            expect(voices.mel[2].props.foo).to.equal(1);
            expect(voices.mel[2].props.bar).to.equal(2);
        });
    });
});
