import {expect} from "chai";
import Line from "../src/views/Line";
import Scored from "../src/Scored";

describe("Line", () => {
    const scored = new Scored();

    it("should be defined", () => {
        expect(Line).to.be.ok;
    });

    describe("instance", () => {
        it("should have a markings array", () => {
            let line = new Line({});
            expect(line.markings).to.be.an("array");
            expect(line.markings.length).to.equal(0);
        });

        it("should contain markings passed in as children", () => {
            let line = new Line({}, [scored.clef(), scored.timeSig(), scored.key()]);
            expect(line.markings.length).to.equal(3);
        });

        describe("sorting by time", () => {
            it("should sort them by time", () => {
                let clef = scored.clef({measure: 2}),
                    timeSig = scored.timeSig({measure: 0}),
                    key = scored.key({measure: 1}),
                    line = new Line({measures: 3}, [clef, timeSig, key]);
                expect(line.markings[0]).to.equal(timeSig);
                expect(line.markings[1]).to.equal(key);
                expect(line.markings[2]).to.equal(clef);
            });

            it("should also sort them by beat", () => {
                let trebleClef = scored.clef({measure: 2, beat: 3}),
                    timeSig = scored.timeSig({measure: 2}), // time signatures can only change at the beginning of a measure so no be specified
                    key = scored.key({measure: 2, beat: 1}),
                    bassClef = scored.clef({measure: 1}),
                    line = new Line({measures: 3}, [trebleClef, timeSig, key, bassClef]);
                expect(line.markings[0]).to.equal(bassClef);
                expect(line.markings[1]).to.equal(timeSig);
                expect(line.markings[2]).to.equal(key);
                expect(line.markings[3]).to.equal(trebleClef);
            });
        })
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

    describe("contextAt", () => {
        it("should return an object with key, timeSig, and clef properties", () => {
            let line = scored.line({measures: 1}, [scored.clef({value: "bass"}), scored.timeSig({value: "2/4"}), scored.key({value: "d#"})]);
            expect(line.contextAt({measure: 0})).to.eql({clef: "bass", timeSig: "2/4", key: "d#"});
        });

        it("should return null if the given measure doesn't exist on the line", () => {
            let line = scored.line({measures: 1});
            expect(line.contextAt(100)).to.be.null;
        });
    });
});
