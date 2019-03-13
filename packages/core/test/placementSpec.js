import {expect} from "chai";
import * as placement from "../src/utils/placement";
import Scored from "../src/Scored";

describe("placement", () => {
    const scored = new Scored();

    describe("commonShortestDuration", () => {

    });

    describe("getStaffSpace", () => {
        it("should return 1 if items duration is less than shortestDuration", () => {
            expect(placement.getStaffSpace(1, scored.note({value: 4}))).to.equal(1);
        });

        it("should increment it's return value for every item duration doubling of the shortestDuration", () => {
            expect(placement.getStaffSpace(0.25, scored.note({value: 4}))).to.equal(1);
            expect(placement.getStaffSpace(0.25, scored.note({value: 2}))).to.equal(2);
            expect(placement.getStaffSpace(0.25, scored.note({value: 1}))).to.equal(3);

            expect(placement.getStaffSpace(0.125, scored.note({value: 8}))).to.equal(1);
            expect(placement.getStaffSpace(0.125, scored.note({value: 4}))).to.equal(2);
            expect(placement.getStaffSpace(0.125, scored.note({value: 2}))).to.equal(3);
        });
    });
});
