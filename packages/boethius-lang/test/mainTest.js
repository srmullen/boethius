import {expect} from "chai";
import compile from "../src/main";

describe("boethius compilation", () => {
    describe("note info", () => {
        const [note] = compile("a4");

        it("should add midi property", () => {
            expect(note.midi).to.equal(69);
        });

        it("should add frequency property", () => {
            expect(note.frequency).to.equal(440);
        });

        it("should add octave property", () => {
            expect(note.octave).to.equal(4);
        });

        it("should add interval property", () => {
            expect(note.interval).to.equal(9);
        });
    });
});
