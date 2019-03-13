import {expect} from "chai";
import Line from "../src/views/Line";
import {createMeasures} from "../src/views/Measure";
import Scored from "../src/Scored";
import {getTimeContexts, getAccidentals, getLineItems} from "../src/utils/line";
import {equals} from '../src/utils/equality';

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
            let line = new Line({}, [
                scored.clef({measure: 0}),
                scored.timeSig({measure: 0}),
                scored.key({measure: 0})
            ]);
            expect(line.markings.length).to.equal(3);
        });

        describe("sorting by time", () => {
            it("should sort them by time", () => {
                let clef = scored.clef({measure: 2}),
                    timeSig = scored.timeSig({measure: 0}),
                    key = scored.key({measure: 1}),
                    line = new Line({}, [clef, timeSig, key]);
                expect(line.markings[0]).to.equal(timeSig);
                expect(line.markings[1]).to.equal(key);
                expect(line.markings[2]).to.equal(clef);
            });

            it("should also sort them by beat", () => {
                let trebleClef = scored.clef({measure: 2, beat: 3}),
                    timeSig = scored.timeSig({measure: 2}), // time signatures can only change at the beginning of a measure so no be specified
                    key = scored.key({measure: 2, beat: 1}),
                    bassClef = scored.clef({measure: 1}),
                    line = new Line({}, [trebleClef, timeSig, key, bassClef]);
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

    function contextEquality (ctx1, ctx2) {
        return {
            clef: equals(ctx1.clef, ctx2.clef),
            timeSig: equals(ctx1.timeSig, ctx2.timeSig),
            key: equals(ctx1.key, ctx2.key)
        };
    }

    describe("contextAt", () => {
        it("should return an object with key, timeSig, and clef properties", () => {
            let bassClef = scored.clef({value: "bass", measure: 0}),
                twofour = scored.timeSig({value: "2/4", measure: 0}),
                dsharp = scored.key({value: "d#", measure: 0}),
                measures = createMeasures(1, [bassClef, twofour, dsharp]);
            let line = scored.line({}, [bassClef, twofour, dsharp]);

            const {clef, timeSig, key} = line.contextAt({measure: 0});
            expect(equals(clef, bassClef)).to.be.true;
            expect(equals(timeSig, twofour)).to.be.true;
            expect(equals(key, dsharp)).to.be.true;
        });

        it("should have the most recent values for the given measure", () => {
            let bassClef = scored.clef({value: "bass", measure: 0}),
                twofour = scored.timeSig({value: "2/4", measure: 0}),
                dsharp = scored.key({value: "d#", measure: 0}),
                altoClef = scored.clef({value: "alto", measure: 1}),
                threeeighth = scored.timeSig({value: "3/8", measure: 2}),
                gflat = scored.key({value: "gb", measure: 3}),
                measures = createMeasures(4, [bassClef, twofour, dsharp, altoClef, threeeighth, gflat]);
            let line = scored.line({}, [bassClef, twofour, dsharp, altoClef, threeeighth, gflat]);

            const ctx0 = line.contextAt({measure: 0});
            const ctx1 = line.contextAt({measure: 1});
            const ctx2 = line.contextAt({measure: 2});
            const ctx3 = line.contextAt({measure: 3});
            expect(contextEquality(ctx0, {clef: bassClef, timeSig: twofour, key: dsharp}))
                .to.eql({clef: true, timeSig: true, key: true});
            expect(contextEquality(ctx1, {clef: altoClef, timeSig: twofour, key: dsharp}))
                .to.eql({clef: true, timeSig: true, key: true});
            expect(contextEquality(ctx2, {clef: altoClef, timeSig: threeeighth, key: dsharp}))
                .to.eql({clef: true, timeSig: true, key: true});
            expect(contextEquality(ctx3, {clef: altoClef, timeSig: threeeighth, key: gflat}))
                .to.eql({clef: true, timeSig: true, key: true});
        });

        it("should have the most recent value for the given beat", () => {
            let bassClef = scored.clef({value: "bass", measure: 0}),
                twofour = scored.timeSig({value: "2/4", measure: 0}),
                dsharp = scored.key({value: "d#", measure: 0}),
                altoClef = scored.clef({value: "alto", measure: 0, beat: 1}),
                fiveeight = scored.timeSig({value: "5/8", measure: 1}),
                gflat = scored.key({value: "gb", measure: 1, beat: 3}),
                measures = createMeasures(3, [bassClef, twofour, dsharp, altoClef, fiveeight, gflat]);
            let line = scored.line({}, [bassClef, twofour, dsharp, altoClef, fiveeight, gflat]);

            expect(contextEquality(line.contextAt({measure: 0}), {clef: bassClef, timeSig: twofour, key: dsharp}))
                .to.eql({clef: true, timeSig: true, key: true});
            expect(contextEquality(line.contextAt({measure: 0, beat: 1}), {clef: altoClef, timeSig: twofour, key: dsharp}))
                .to.eql({clef: true, timeSig: true, key: true});
            expect(contextEquality(line.contextAt({measure: 1, beat: 2}), {clef: altoClef, timeSig: fiveeight, key: dsharp}))
                .to.eql({clef: true, timeSig: true, key: true});
            expect(contextEquality(line.contextAt({measure: 1, beat: 4}), {clef: altoClef, timeSig: fiveeight, key: gflat}))
                .to.eql({clef: true, timeSig: true, key: true});
        });

        it("should return null if the given measure doesn't exist on the line", () => {
            let line = scored.line();
            expect(line.contextAt({measure: 1})).to.eql({clef: {}, timeSig: {}, key: {}});
        });
    });

    describe("utils", () => {
        xdescribe("getTimeContexts", () => {
            it("should return an array", () => {
                expect(getTimeContexts()).to.eql([]);
            });
        });

        describe("getLineItems", () => {
            it("should return empty arrays if there are no voices", () => {
                let line = scored.line();
                expect(getLineItems(line, [])).to.eql([]);
            });
        });
    });
});
