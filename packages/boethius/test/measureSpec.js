import {expect} from "chai";
import * as common from "../src/utils/common";
import Measure from "../src/views/Measure";
import Scored from "../src/Scored";

describe("Measure", () => {
    let scored = new Scored();
    describe("createMeasures", () => {
        it("should return an array containing the number of measures given", () => {
            expect(Measure.createMeasures(1).length).to.equal(1);
            expect(Measure.createMeasures(3).length).to.equal(3);
            expect(Measure.createMeasures(10).length).to.equal(10);
        });

        it("should set the startsAt time on each measure", () => {
            expect(Measure.createMeasures(4).map(m => m.startsAt)).to.eql([0, 1, 2, 3]);

            let measures = common.doTimes(4, () => scored.measure({timeSig: "3/4"}))
			expect(Measure.createMeasures(4, measures).map(m => m.startsAt)).to.eql([0, 0.75, 1.5, 2.25]);
        });
    });

    describe("getMeasureNumber", () => {
        it("should return the index of the measure in the measures array given the time", () => {
            let measures = Measure.createMeasures(4);
            expect(Measure.getMeasureNumber(measures, 0)).to.equal(0);
            expect(Measure.getMeasureNumber(measures, 0.5)).to.equal(0);
            expect(Measure.getMeasureNumber(measures, 0.99)).to.equal(0);
            expect(Measure.getMeasureNumber(measures, 1)).to.equal(1);
            expect(Measure.getMeasureNumber(measures, 2.25)).to.equal(2);
            expect(Measure.getMeasureNumber(measures, 5)).to.equal(-1);
        });
    });

    describe("getByTime", () => {
        it("should return the measure that contains the given time", () => {
            let measures = Measure.createMeasures(4);
            expect(Measure.getByTime(measures, 0)).to.equal(measures[0]);
            expect(Measure.getByTime(measures, 0.5)).to.equal(measures[0]);
            expect(Measure.getByTime(measures, 0.99)).to.equal(measures[0]);
            expect(Measure.getByTime(measures, 1)).to.equal(measures[1]);
            expect(Measure.getByTime(measures, 2.25)).to.equal(measures[2]);
            expect(Measure.getByTime(measures, 5)).not.to.be.ok;
        });
    });
});
