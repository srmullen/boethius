import {expect} from "chai";

import {getBeat, getTime, getMeasureNumber, getMeasureByTime} from "../src/utils/timeUtils";
import Measure from "../src/views/Measure";
import Scored from "../src/Scored";

describe("timeUtils", () => {
    const scored = new Scored();

    describe("getBeat", () => {
        it("should return the float representation of the beat number", () => {
            expect(getBeat(0, "4/4")).to.equal(0);
            expect(getBeat(0.25, "4/4")).to.equal(1);
            expect(getBeat(0.50, [4, 4])).to.equal(2)
            expect(getBeat(0.75, [4, 4])).to.equal(3);

            expect(getBeat(0.125, "4/4")).to.equal(0.5);
            expect(getBeat(0.375, "4/4")).to.equal(1.5);
            expect(getBeat(0.625, [4, 4])).to.equal(2.5)
            expect(getBeat(0.875, [4, 4])).to.equal(3.5);
        });

        it("should calculate in offset", () => {
            expect(getBeat(1, "4/4", 1)).to.equal(0);
            expect(getBeat(2.25, "4/4", 2)).to.equal(1);
            expect(getBeat(3.50, [4, 4], 3)).to.equal(2)
            expect(getBeat(4.75, [4, 4], 4)).to.equal(3);

            expect(getBeat(1.125, "4/4"), 1).to.equal(0.5);
            expect(getBeat(2.375, "4/4"), 2).to.equal(1.5);
            expect(getBeat(3.625, [4, 4], 3)).to.equal(2.5)
            expect(getBeat(4.875, [4, 4], 4)).to.equal(3.5);
        });
    });

    describe("getTime", () => {
        it("should return a time object for items containing just a measure property", () => {
            let trebleClef = scored.clef({value: "treble", measure: 0}),
                bassClef = scored.clef({value: "bass", measure: 2}),
                fourfour = scored.timeSig({value: "4/4", measure: 0}),
                measures = Measure.createMeasures(4, [fourfour]);

            let trebleTime = getTime(measures, trebleClef);
            expect(trebleTime).to.eql({time: 0, measure: 0, beat: 0});
            let bassTime = getTime(measures, bassClef);
            expect(bassTime).to.eql({time: 2, measure: 2, beat: 0});
        });

        it("should return a time object for items containing just a time property", () => {
            let note1 = scored.note({value: 4, time: 0}),
                rest1 = scored.rest({value: 8, time: 0.25}),
                note2 = scored.note({value: 16, time: 1.625}),
                rest2 = scored.rest({value: 2, time: 2.5}),
                fourfour = scored.timeSig({value: "4/4", measure: 0}),
                measures = Measure.createMeasures(4, [fourfour]);

            expect(getTime(measures, note1)).to.eql({time: 0, measure: 0, beat: 0});
            expect(getTime(measures, rest1)).to.eql({time: 0.25, measure: 0, beat: 1});
            expect(getTime(measures, note2)).to.eql({time: 1.625, measure: 1, beat: 2.5});
            expect(getTime(measures, rest2)).to.eql({time: 2.5, measure: 2, beat: 2});

        });

        it("should always return beat as zero and time as the startTime of the measure", () => {

        });
    });

    describe("getMeasureNumber", () => {
        it("should return the index of the measure in the measures array given the time", () => {
            let measures = Measure.createMeasures(4, [scored.timeSig({value: "4/4", measure: 0})]);
            expect(getMeasureNumber(measures, 0)).to.equal(0);
            expect(getMeasureNumber(measures, 0.5)).to.equal(0);
            expect(getMeasureNumber(measures, 0.99)).to.equal(0);
            expect(getMeasureNumber(measures, 1)).to.equal(1);
            expect(getMeasureNumber(measures, 2.25)).to.equal(2);
            expect(getMeasureNumber(measures, 5)).to.equal(-1);
        });
    });

    describe("getMeasureByTime", () => {
        it("should return the measure that contains the given time", () => {
            let measures = Measure.createMeasures(4, [scored.timeSig({value: "4/4", measure: 0})]);
            expect(getMeasureByTime(measures, 0)).to.equal(measures[0]);
            expect(getMeasureByTime(measures, 0.5)).to.equal(measures[0]);
            expect(getMeasureByTime(measures, 0.99)).to.equal(measures[0]);
            expect(getMeasureByTime(measures, 1)).to.equal(measures[1]);
            expect(getMeasureByTime(measures, 2.25)).to.equal(measures[2]);
            expect(getMeasureByTime(measures, 5)).not.to.be.ok;
        });
    });
});