import {expect} from "chai";
import compile from "../src/main";

describe("boethius compilation", () => {
    describe("note info", () => {
        const {voices} = compile("[mel a4]");
        console.log(voices);
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
});
