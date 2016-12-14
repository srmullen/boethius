import {expect} from "chai";
import * as common from "../src/utils/common";
import Measure from "../src/views/Measure";
import {createMeasures} from "../src/views/Measure";
import Scored from "../src/Scored";

describe("Measure", () => {
    const scored = new Scored();
    describe("createMeasures", () => {
        it("should return an array containing the number of measures given", () => {
            const timeSig = scored.timeSig({measure: 0});
            expect(createMeasures(1, [timeSig]).length).to.equal(1);
            expect(createMeasures(3, [timeSig]).length).to.equal(3);
            expect(createMeasures(10, [timeSig]).length).to.equal(10);
        });

        it("should set the startsAt time on each measure", () => {
            const fourfour = scored.timeSig({value: "4/4", measure: 0}),
                threefour = scored.timeSig({value: "3/4", measure: 0});
            expect(createMeasures(4, [fourfour]).map(m => m.startsAt)).to.eql([0, 1, 2, 3]);

			expect(createMeasures(4, [threefour]).map(m => m.startsAt)).to.eql([0, 0.75, 1.5, 2.25]);
        });

        it("should set barType to final on the last measure", () => {
            const timeSig = scored.timeSig({measure: 0});
            expect(createMeasures(1, [timeSig])[0].barType).to.equal("final");
            expect(createMeasures(9, [timeSig])[8].barType).to.equal("final");
        });
    });
});
