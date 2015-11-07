import {expect} from "chai";

import TimeSignature from "../src/views/TimeSignature";

describe("TimeSignature", () => {
    describe("createBeatStructure", () => {
        const createBeatStructure = TimeSignature.createBeatStructure;
        it("should return the default structures for all possible time signatures", () => {
            expect(createBeatStructure("4/4")).to.eql([2,2]);
        });
    });
});
