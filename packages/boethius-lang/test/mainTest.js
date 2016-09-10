import {expect} from "chai";
import compile from "../src/main";

describe("boethius compilation", () => {
    describe("note info", () => {
        const [note] = compile("a4");

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
});
