import {expect} from "chai";
import Voice from "../src/views/Voice";
import Scored from "../src/Scored";

describe("Voice", () => {
    const scored = new Scored();
    describe("findBeaming", () => {
        let findBeaming = Voice.findBeaming,
            fourfour = scored.timeSig();

        it("should return an empty array if there are no notes in the collection", () => {
            expect(findBeaming(fourfour, [])).to.eql([]);
        });

        it("should return a note grouped by itself if it doesn't need beaming", () => {
            expect(findBeaming(fourfour, [scored.note({type: 4, time: 0})])).to.eql([[scored.note({type: 4, time: 0})]]);
            expect(findBeaming(fourfour, [scored.note({type: 2, time: 0})])).to.eql([[scored.note({type: 4, time: 0})]]);
            expect(findBeaming(fourfour, [scored.note({type: 1, time: 0})])).to.eql([[scored.note({type: 4, time: 0})]]);
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

        it("should handle chords", () => {
            expect(findBeaming(fourfour, [scored.chord({type: 1, time: 0}, ["c4", "e4"])])).to.eql([[scored.chord({type: 1, time: 0}, ["c4", "e4"])]]);
            expect(findBeaming(fourfour, [scored.chord({type: 2, time: 0}, ["c4", "e4"])])).to.eql([[scored.chord({type: 2, time: 0}, ["c4", "e4"])]]);
            expect(findBeaming(fourfour, [scored.chord({type: 4, time: 0}, ["c4", "e4"])])).to.eql([[scored.chord({type: 4, time: 0}, ["c4", "e4"])]]);
            expect(findBeaming(fourfour, [scored.chord({value: 8, time: 0}, ["c4", "e4"])])).to.eql([[scored.chord({value: 8, time: 0}, ["c4", "e4"])]]);
            expect(findBeaming(fourfour, [scored.chord({value: 16, time: 0}, ["c4", "e4"])])).to.eql([[scored.chord({value: 16, time: 0}, ["c4", "e4"])]]);
            expect(findBeaming(fourfour, [scored.chord({value: 32, time: 0}, ["c4", "e4"])])).to.eql([[scored.chord({value: 32, time: 0}, ["c4", "e4"])]]);
            expect(findBeaming(fourfour, [scored.chord({value: 64, time: 0}, ["c4", "e4"])])).to.eql([[scored.chord({value: 64, time: 0}, ["c4", "e4"])]]);
        });

        it("should split collection of notes into groups that need to be beamed", () => {

        });
    });
});
