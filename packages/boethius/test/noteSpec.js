import {expect} from "chai";

import Scored from "../src/Scored";
import Note from "../src/views/Note";
// import {findBeaming} from "../src/utils/note";

describe("Note", () => {
    let scored = new Scored();
    describe("findBeaming", () => {
        let findBeaming = Note.findBeaming,
            fourfour = scored.timeSig();

        it("should return an empty array if there are no notes in the collection", () => {
            expect(findBeaming(fourfour, [])).to.eql([]);
        });

        it("should return a note grouped by itself if it doesn't need beaming", () => {
            // expect(findBeaming(fourfour, [scored.note({type: 4, time: 0})])).to.eql([scored.note({type: 4, time: 0})]);
            // expect(findBeaming(fourfour, [scored.note({type: 2, time: 0})])).to.eql([scored.note({type: 4, time: 0})]);
            // expect(findBeaming(fourfour, [scored.note({type: 1, time: 0})])).to.eql([scored.note({type: 4, time: 0})]);
        });

        it("should return notes so they can have stems and flags drawn", () => {
            expect(findBeaming(fourfour, [scored.note({type: 1, time: 0})])).to.eql([[scored.note({type: 1, time: 0})]]);
            expect(findBeaming(fourfour, [scored.note({type: 2, time: 0})])).to.eql([[scored.note({type: 2, time: 0})]]);
            expect(findBeaming(fourfour, [scored.note({type: 4, time: 0})])).to.eql([[scored.note({type: 4, time: 0})]]);
            expect(findBeaming(fourfour, [scored.note({value: 8, time: 0})])).to.eql([[scored.note({value: 8, time: 0})]]);
            expect(findBeaming(fourfour, [scored.note({value: 16, time: 0})])).to.eql([[scored.note({value: 16, time: 0})]]);
            expect(findBeaming(fourfour, [scored.note({value: 32, time: 0})])).to.eql([[scored.note({value: 32, time: 0})]]);
            expect(findBeaming(fourfour, [scored.note({value: 64, time: 0})])).to.eql([[scored.note({value: 64, time: 0})]]);
        });

        it("should split collection of notes into groups that need to be beamed", () => {

        });
    });
});
