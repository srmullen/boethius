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

    xdescribe("time", () => {
        it("should add a time property", () => {
            const [parsedNote] = compile("c4");
            expect(parsedNote.time).to.equal(0);

            const [parsedRest] = compile("r");
            expect(parsedRest.time).to.equal(0);

            const [parsedChord] = compile("<d4 f4>");
            expect(parsedChord.time).to.equal(0);
        });

        it("should increment time for subsequent items", () => {
            const items = compile("c4 d4/8 r");
            expect(items[0].time).to.equal(0);
            expect(items[1].time).to.equal(0.25);
            expect(items[2].time).to.equal(0.375);
        });
    });
});
