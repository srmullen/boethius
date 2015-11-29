import {expect} from "chai";

import Scored from "../src/Scored";
import Note from "../src/views/Note";
import Chord from "../src/views/Chord";
import {getStemDirection} from "../src/utils/chord";

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

        it("should sort the child notes from lowest to highest", () => {
            let cmaj7 = scored.chord({}, ["c6", "b3", "g3", "e5"]);
            expect(cmaj7.children[0].pitch).to.equal("g3");
            expect(cmaj7.children[1].pitch).to.equal("b3");
            expect(cmaj7.children[2].pitch).to.equal("e5");
            expect(cmaj7.children[3].pitch).to.equal("c6");
        });
    });

    describe("getStemDirection", () => {
        it("should return the stemDirection if it's a property on the chord", () => {
            let cmaj = scored.chord({stemDirection: "up"}, ["c4", "e4"]),
                cmin = scored.chord({stemDirection: "down"}, ["c4", "eb4"]);

            expect(getStemDirection(cmaj)).to.equal("up");
            expect(getStemDirection(cmin)).to.equal("down");
            expect(getStemDirection(cmaj, "b1")).to.equal("up");
            expect(getStemDirection(cmin, "b12")).to.equal("down");
        });

        it("should return 'up' if the center line is above all the notes of the chord", () => {
            expect(getStemDirection(scored.chord({}, ["d3", "g3"]), "b4")).to.equal("up");
        });

        it("should return 'down' if the center line is above all the notes of the chord", () => {
            expect(getStemDirection(scored.chord({}, ["d5", "g5"]), "b4")).to.equal("down");
        });

        it("should return the direction of the note that is furthest from the center line", () => {
            expect(getStemDirection(scored.chord({}, ["a4", "c5"]), "b4")).to.equal("down");
            expect(getStemDirection(scored.chord({}, ["g4", "c5"]), "b4")).to.equal("up");
            expect(getStemDirection(scored.chord({}, ["a4", "b4"]), "b4")).to.equal("up");
            expect(getStemDirection(scored.chord({}, ["b4", "c5"]), "b4")).to.equal("down");
        });
    });
});
