import {expect} from "chai";

import Scored from "../src/Scored";
import * as diff from "../src/utils/diff";

describe("diff", () => {
    const scored = new Scored();

    describe("voices", function () {
        it("should return an empty array if there is no change in the children", () => {
            const v1 = scored.voice();
            const v2 = scored.voice();
            expect(diff.voices(v1, v2)).to.eql([]);

            const v3 = scored.voice({}, [scored.note()]);
            const v4 = scored.voice({}, [scored.note()]);
            expect(diff.voices(v3, v4)).to.eql([]);
        });

        it("should return the time if a child is changed", () => {
            const v1 = scored.voice({}, [scored.note({pitch: "a4"})]);
            const v2 = scored.voice({}, [scored.note({pitch: "b3"})]);
            expect(diff.voices(v1, v2)).to.eql([0]);

            const v3 = scored.voice({}, [scored.note({pitch: "a4"}), scored.rest({value: 8}), scored.chord({}, ["c4", "e4"])]);
            const v4 = scored.voice({}, [scored.note({pitch: "a4"}), scored.rest({value: 4}), scored.chord({}, ["c4", "e4"])]);
            expect(diff.voices(v3, v4)).to.eql([0.25, 0.375, 0.5]);
        });

        it("should handle uneven length voices", () => {
            const v1 = scored.voice({}, [scored.note({pitch: "a4"}), scored.rest({value: 8})]);
            const v2 = scored.voice({}, [scored.note({pitch: "a4"}), scored.rest({value: 4}), scored.chord({}, ["c4", "e4"])]);
            expect(diff.voices(v1, v2)).to.eql([0.25, 0.5]);

            const v3 = scored.voice({}, [scored.note({pitch: "a4"}), scored.rest({value: 8}), scored.chord({}, ["c4", "e4"])]);
            const v4 = scored.voice({}, [scored.note({pitch: "a4"}), scored.rest({value: 4})]);
            expect(diff.voices(v3, v4)).to.eql([0.25, 0.375]);
        });

        it("should return the time of previous if it has a time and next doesn't", () => {
            const v1 = scored.voice({}, [scored.note()]);
            const v2 = scored.voice({}, []);
            expect(diff.voices(v1, v2)).to.eql([0]);

            const v3 = scored.voice({}, [scored.rest({value: 4}), scored.note()]);
            const v4 = scored.voice({}, [scored.rest({value: 4})]);
            expect(diff.voices(v3, v4)).to.eql([0.25]);
        });

        it("should return the time of next if it has a time and previous doesn't", () => {
            const v1 = scored.voice({}, []);
            const v2 = scored.voice({}, [scored.note()]);
            expect(diff.voices(v1, v2)).to.eql([0]);

            const v3 = scored.voice({}, [scored.note({value: 4})]);
            const v4 = scored.voice({}, [scored.note({value: 4}), scored.rest()]);
            expect(diff.voices(v3, v4)).to.eql([0.25]);
        });
    });
});
