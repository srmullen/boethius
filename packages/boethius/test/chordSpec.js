import {expect} from "chai";
import Scored from "../src/Scored";
import Chord from "../src/views/Chord";
import Note from "../src/views/Note";

describe("Chord", () => {
    let scored = new Scored();
    describe("initialization", () => {
        it("should take an array of strings as children", () => {
            let cmaj = scored.chord({value: 8}, ["c5", "e5", "g5"]);
            expect(cmaj.children[0]).to.be.an.instanceof(Note);
            expect(cmaj.children[1]).to.be.an.instanceof(Note);
            expect(cmaj.children[2]).to.be.an.instanceof(Note);

            expect(cmaj.children[0].pitch).to.equal("c5");
            expect(cmaj.children[1].pitch).to.equal("e5");
            expect(cmaj.children[2].pitch).to.equal("g5");

            expect(cmaj.children[0].value).to.equal(8);
            expect(cmaj.children[1].value).to.equal(8);
            expect(cmaj.children[2].value).to.equal(8);
        });

        it("should take an array of objects as children", () => {
            let cmaj = scored.chord({value: 2}, [{pitch: "c5", value: 8}, {pitch: "e5", value: 16}, {pitch: "g5"}]);
            expect(cmaj.children[0]).to.be.an.instanceof(Note);
            expect(cmaj.children[1]).to.be.an.instanceof(Note);
            expect(cmaj.children[2]).to.be.an.instanceof(Note);

            expect(cmaj.children[0].pitch).to.equal("c5");
            expect(cmaj.children[1].pitch).to.equal("e5");
            expect(cmaj.children[2].pitch).to.equal("g5");

            expect(cmaj.children[0].value).to.equal(8);
            expect(cmaj.children[1].value).to.equal(16);
            expect(cmaj.children[2].value).to.equal(2);
        });

        it("should take an array of Notes as children", () => {
            let cmaj = scored.chord({value: 2}, [new Note({pitch: "c5", value: 8}),
                                                 new Note({pitch: "e5", value: 16}),
                                                 new Note({pitch: "g5"})]);
            expect(cmaj.children[0]).to.be.an.instanceof(Note);
            expect(cmaj.children[1]).to.be.an.instanceof(Note);
            expect(cmaj.children[2]).to.be.an.instanceof(Note);

            expect(cmaj.children[0].pitch).to.equal("c5");
            expect(cmaj.children[1].pitch).to.equal("e5");
            expect(cmaj.children[2].pitch).to.equal("g5");

            expect(cmaj.children[0].value).to.equal(8);
            expect(cmaj.children[1].value).to.equal(16);
            expect(cmaj.children[2].value).to.equal(4); // four is the default value of Note
        });

        it("should take an array of strings, objects, and Notes as children", () => {
            let cmaj = scored.chord({value: 2}, [{pitch: "c5", value: 8}, new Note({pitch: "e5", value: 16}), "g5"]);
            expect(cmaj.children[0]).to.be.an.instanceof(Note);
            expect(cmaj.children[1]).to.be.an.instanceof(Note);
            expect(cmaj.children[2]).to.be.an.instanceof(Note);

            expect(cmaj.children[0].pitch).to.equal("c5");
            expect(cmaj.children[1].pitch).to.equal("e5");
            expect(cmaj.children[2].pitch).to.equal("g5");

            expect(cmaj.children[0].value).to.equal(8);
            expect(cmaj.children[1].value).to.equal(16);
            expect(cmaj.children[2].value).to.equal(2);
        });
    });
});
