import {expect} from "chai";
import Line from "../src/views/Line";

describe("Line", () => {
    it("should be defined", () => {
        expect(Line).to.be.ok;
    });

    describe("calculateAverageMeasureLength", () => {
        it("should exist", () => {
            expect(Line.calculateAverageMeasureLength).to.be.ok;
        });
        it("should take the number of staves, line length, and number of measures as arguments and return the right number", () => {
            expect(Line.calculateAverageMeasureLength(1, 100, 1)).to.equal(100);
            expect(Line.calculateAverageMeasureLength(2, 100, 1)).to.equal(200);
            expect(Line.calculateAverageMeasureLength(1, 100, 2)).to.equal(50);
            expect(Line.calculateAverageMeasureLength(2, 100, 2)).to.equal(100);
        });
    });
});
