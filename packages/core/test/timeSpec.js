import {expect} from "chai";
import _ from "lodash";

import {
    addTimes, getBeat, getTime, getTimeFromSignatures, getMeasureNumber, getMeasureByTime,
    calculateDuration, calculateTupletDuration, equals,
    gt, lt, gte, lte, absoluteToRelativeDuration, iterateByTime
} from "../src/utils/timeUtils";
import {createMeasures} from "../src/views/Measure";
import Scored from "../src/Scored";

describe("timeUtils", () => {
    const scored = new Scored();
    const note = scored.note;

    describe("equals", () => {
        it("should use absolute time if present", () => {
            expect(equals({time: 1}, {time: 1})).to.be.true;
        });
    });

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
                measures = createMeasures(4, [fourfour]);

            let trebleTime = getTime(measures, trebleClef);
            expect(trebleTime).to.eql({time: 0, measure: 0, beat: 0});
            let bassTime = getTime(measures, bassClef);
            expect(bassTime).to.eql({time: 2, measure: 2, beat: 0});
        });

        it("should return a time object for items containing a measure and beat property", () => {
            let trebleClef = scored.clef({value: "treble", measure: 0, beat: 1}),
                bassClef = scored.clef({value: "bass", measure: 2, beat: 3}),
                fourfour = scored.timeSig({value: "4/4", measure: 0}),
                measures = createMeasures(4, [fourfour]);

            const trebleTime = getTime(measures, trebleClef);
            expect(trebleTime).to.eql({time: 0.25, measure: 0, beat: 1});
            const bassTime = getTime(measures, bassClef);
            expect(bassTime).to.eql({time: 2.75, measure: 2, beat: 3});
        });

        it("should return a time object for items containing just a time property", () => {
            let note1 = scored.note({value: 4, time: 0}),
                rest1 = scored.rest({value: 8, time: 0.25}),
                note2 = scored.note({value: 16, time: 1.625}),
                rest2 = scored.rest({value: 2, time: 2.5}),
                fourfour = scored.timeSig({value: "4/4", measure: 0}),
                measures = createMeasures(4, [fourfour]);

            expect(getTime(measures, note1)).to.eql({time: 0, measure: 0, beat: 0});
            expect(getTime(measures, rest1)).to.eql({time: 0.25, measure: 0, beat: 1});
            expect(getTime(measures, note2)).to.eql({time: 1.625, measure: 1, beat: 2.5});
            expect(getTime(measures, rest2)).to.eql({time: 2.5, measure: 2, beat: 2});

        });

        it("should return the end time if item isn't in measures", () => {
            const timeSig = scored.timeSig({value: "4/4", measure: 0});
            const measures = createMeasures(4, [timeSig]);

            expect(getTime(measures, {measure: 4})).to.be.ok;
        });

        it("not report these as the same time", () => {
            const timeSig = scored.timeSig({value: "4/4", measure: 0});
            const measures = createMeasures(12, [timeSig]);
            const clef = scored.clef({value: "bass", measure: 8, beat: 2});
            const note = scored.note({value: 2, time: 8});

            expect(getTime(measures, clef)).not.to.eql(getTime(measures, note));
        });

        it('should handle time as a number rather than object', () => {
          const timeSig = scored.timeSig({value: "4/4", measure: 0});
          const measures = createMeasures(12, [timeSig]);
          // const clef = scored.clef({value: "bass", measure: 8, beat: 2});
          const time = 8;
          const note = scored.note({value: 2, time: 8});

          expect(getTime(measures, time)).to.eql(getTime(measures, note));
        });

        it('should increment the measure when the number of beats is greater than a measure', () => {
          const timeSig = scored.timeSig({value: "4/4", measure: 0});
          const measures = createMeasures(4, [timeSig]);
          expect(getTime(measures, {measure: 0, beat: 5})).to.eql({time: 1.25, measure: 1, beat: 1});
          expect(getTime(measures, {measure: 1, beat: 5})).to.eql({time: 2.25, measure: 2, beat: 1});
          expect(getTime(measures, {measure: 2, beat: 8})).to.eql({time: 4, measure: 4, beat: 0});
        });
    });

    describe('addTimes', () => {
      it('should add when both times are numbers', () => {
        const timeSig = scored.timeSig({value: "4/4", measure: 0});
        const measures = createMeasures(12, [timeSig]);
        expect(addTimes(measures, 1, 2)).to.eql({time: 3, measure: 3, beat: 0});
        expect(addTimes(measures, 0.25, 2)).to.eql({time: 2.25, measure: 2, beat: 1});
        expect(addTimes(measures, 3.75, 2.50)).to.eql({time: 6.25, measure: 6, beat: 1});
      });

      it('should use the time property when on an object', () => {
        const fourfour = scored.timeSig({value: "4/4", measure: 0});
        const threefour = scored.timeSig({value: "3/4", measure: 2});
        const measures = createMeasures(12, [fourfour, threefour]);
        expect(addTimes(measures, {time: 1}, 1)).to.eql({time: 2, measure: 2, beat: 0});
        expect(addTimes(measures, 2, {time: 1})).to.eql({time: 3, measure: 3, beat: 1});
        expect(addTimes(measures, {time: 3}, {time: 2})).to.eql({time: 5, measure: 6, beat: 0});
      });

      it('should add time to measure/beat object', () => {
        const fourfour = scored.timeSig({value: "4/4", measure: 0});
        const threefour = scored.timeSig({value: "3/4", measure: 1});
        const measures = createMeasures(12, [fourfour, threefour]);
        expect(addTimes(measures, 1, {measure: 2})).to.eql({time: 2.50, measure: 3, beat: 0});
        expect(addTimes(measures, {measure: 2}, 1)).to.eql({time: 2.75, measure: 3, beat: 1});
      });

      it('should add when objects with only measure and beat are provided', () => {
        const timeSig = scored.timeSig({value: "3/4", measure: 0});
        const measures = createMeasures(12, [timeSig]);
        expect(addTimes(measures, {measure: 1}, {measure: 2})).to.eql({time: 2.25, measure: 3, beat: 0});
      });

      it('should make sure the second time is added to the first', () => {
        // Order matters because measures/beats can be different values depending
        // on where the counting starts from.
        const fourfour = scored.timeSig({value: "4/4", measure: 0});
        const threefour = scored.timeSig({value: "3/4", measure: 1});
        const measures = createMeasures(12, [fourfour, threefour]);
        expect(addTimes(measures, 1, {measure: 1})).to.eql({time: 1.75, measure: 2, beat: 0});
      });

      it('should add beats correctly', () => {
        const timeSig = scored.timeSig({value: "4/4", measure: 0});
        const measures = createMeasures(12, [timeSig]);
        expect(addTimes(measures, {measure: 0, beat: 3}, {measure: 0, beat: 3})).to.eql({time: 1.5, measure: 1, beat: 2});
        expect(addTimes(measures, {measure: 1}, {measure: 0, beat: 1})).to.eql({time: 1.25, measure: 1, beat: 1});
      });
    });

    describe('getTimeFromSignatures', () => {
        it('should return object with a measure property', () => {
            const timeSigs = [scored.timeSig({value: '4/4', measure: 0})];
            expect(getTimeFromSignatures(timeSigs, scored.note({time: 0})).measure).to.equal(0);
            expect(getTimeFromSignatures(timeSigs, scored.note({time: 0.25})).measure).to.equal(0);
            expect(getTimeFromSignatures(timeSigs, scored.note({time: 1})).measure).to.equal(1);
            expect(getTimeFromSignatures(timeSigs, scored.note({time: 1.25})).measure).to.equal(1);
        });

        it('should return an object with the correct measure property when there are multiple timeSigs', () => {
            const timeSigs = [scored.timeSig({value: '4/4', measure: 0}), scored.timeSig({value: '3/4', measure: 1})];
            expect(getTimeFromSignatures(timeSigs, scored.note({time: 0})).measure).to.equal(0);
            expect(getTimeFromSignatures(timeSigs, scored.note({time: 0.25})).measure).to.equal(0);
            expect(getTimeFromSignatures(timeSigs, scored.note({time: 1})).measure).to.equal(1);
            expect(getTimeFromSignatures(timeSigs, scored.note({time: 1.25})).measure).to.equal(1);
            expect(getTimeFromSignatures(timeSigs, scored.note({time: 1.75})).measure).to.equal(2);
            expect(getTimeFromSignatures(timeSigs, scored.note({time: 2})).measure).to.equal(2);
        });

        it('should return an object with a beat property', () => {
            const timeSigs = [scored.timeSig({value: '4/4', measure: 0})];
            expect(getTimeFromSignatures(timeSigs, scored.note({time: 0})).beat).to.equal(0);
            expect(getTimeFromSignatures(timeSigs, scored.note({time: 0.25})).beat).to.equal(1);
            expect(getTimeFromSignatures(timeSigs, scored.note({time: 0.5})).beat).to.equal(2);
            expect(getTimeFromSignatures(timeSigs, scored.note({time: 0.75})).beat).to.equal(3);
        });

        it('should return an object with the correct measure property when there are multiple timeSigs', () => {
            const timeSigs = [scored.timeSig({value: '4/4', measure: 0}), scored.timeSig({value: '3/4', measure: 1})];
            expect(getTimeFromSignatures(timeSigs, scored.note({time: 0})).beat).to.equal(0);
            expect(getTimeFromSignatures(timeSigs, scored.note({time: 0.25})).beat).to.equal(1);
            expect(getTimeFromSignatures(timeSigs, scored.note({time: 1})).beat).to.equal(0);
            expect(getTimeFromSignatures(timeSigs, scored.note({time: 1.25})).beat).to.equal(1);
            expect(getTimeFromSignatures(timeSigs, scored.note({time: 1.75})).beat).to.equal(0);
            expect(getTimeFromSignatures(timeSigs, scored.note({time: 2.25})).beat).to.equal(2);
        });

        it('should return object with a time property when given a measure', () => {
            const timeSigs = [scored.timeSig({value: '3/4', measure: 0})];
            expect(getTimeFromSignatures(timeSigs, scored.clef({measure: 0})).time).to.equal(0);
            expect(getTimeFromSignatures(timeSigs, scored.clef({measure: 1})).time).to.equal(0.75);
            expect(getTimeFromSignatures(timeSigs, scored.clef({measure: 2})).time).to.equal(1.5);
            expect(getTimeFromSignatures(timeSigs, scored.clef({measure: 5})).time).to.equal(3.75);
        });

        it('should return object with a time property when given a measure and beat', () => {
            const timeSigs = [scored.timeSig({value: '3/4', measure: 0})];
            expect(getTimeFromSignatures(timeSigs, scored.clef({measure: 0, beat: 1})).time).to.equal(0.25);
            expect(getTimeFromSignatures(timeSigs, scored.clef({measure: 1, beat: 2})).time).to.equal(1.25);
            expect(getTimeFromSignatures(timeSigs, scored.clef({measure: 2, beat: 0})).time).to.equal(1.5);
            expect(getTimeFromSignatures(timeSigs, scored.clef({measure: 5, beat: 3})).time).to.equal(4.5);
        });
    });

    describe("getMeasureNumber", () => {
        it("should return the index of the measure in the measures array given the time", () => {
            let measures = createMeasures(4, [scored.timeSig({value: "4/4", measure: 0})]);
            expect(getMeasureNumber(measures, 0)).to.equal(0);
            expect(getMeasureNumber(measures, 0.5)).to.equal(0);
            expect(getMeasureNumber(measures, 0.99)).to.equal(0);
            expect(getMeasureNumber(measures, 1)).to.equal(1);
            expect(getMeasureNumber(measures, 2.25)).to.equal(2);
            expect(getMeasureNumber(measures, 5)).to.equal(3);
        });
    });

    describe("getMeasureByTime", () => {
        it("should return the measure that contains the given time", () => {
            let measures = createMeasures(4, [scored.timeSig({value: "4/4", measure: 0})]);
            expect(getMeasureByTime(measures, 0)).to.equal(measures[0]);
            expect(getMeasureByTime(measures, 0.5)).to.equal(measures[0]);
            expect(getMeasureByTime(measures, 0.99)).to.equal(measures[0]);
            expect(getMeasureByTime(measures, 1)).to.equal(measures[1]);
            expect(getMeasureByTime(measures, 2.25)).to.equal(measures[2]);
            expect(getMeasureByTime(measures, 5)).to.equal(_.last(measures));
        });
    });

    describe("calculateDuration", () => {
        let n = scored.note;
        let r = scored.rest;
        let c = scored.chord;

        it("should handle tuplets", () => {
            expect(_.sum(_.map([
                n({value: 16, tuplet: "3/2"}), n({value: 16, tuplet: "3/2"}), n({value: 16, tuplet: "3/2"})
            ], calculateDuration))).to.equal(0.125);
            expect(_.sum(_.map([
                n({value: 8, tuplet: "3/2"}), n({value: 8, tuplet: "3/2"}), n({value: 8, tuplet: "3/2"})
            ], calculateDuration))).to.equal(0.25);
            expect(_.sum(_.map([
                n({value: 4, tuplet: "3/2"}), n({value: 4, tuplet: "3/2"}), n({value: 4, tuplet: "3/2"})
            ], calculateDuration))).to.equal(0.5);
            expect(_.sum(_.map([
                n({value: 2, tuplet: "3/2"}), n({value: 2, tuplet: "3/2"}), n({value: 2, tuplet: "3/2"})
            ], calculateDuration))).to.equal(1);
            expect(_.sum(_.map([
                n({value: 8, tuplet: "3/2", dots: 1}), n({value: 8, tuplet: "3/2", dots: 1})
            ], calculateDuration))).to.equal(0.25);

            expect(_.sum(_.map([
                n({value: 16, tuplet: "5/4"}), n({value: 16, tuplet: "5/4"}), n({value: 16, tuplet: "5/4"}), n({value: 16, tuplet: "5/4"}), n({value: 16, tuplet: "5/4"})
            ], calculateDuration))).to.equal(0.25);
            expect(_.sum(_.map([
                n({value: 8, tuplet: "5/4"}), n({value: 8, tuplet: "5/4"}), n({value: 8, tuplet: "5/4"}), n({value: 8, tuplet: "5/4"}), n({value: 8, tuplet: "5/4"})
            ], calculateDuration))).to.equal(0.5);
            expect(_.sum(_.map([
                n({value: 4, tuplet: "5/4"}), n({value: 4, tuplet: "5/4"}), n({value: 4, tuplet: "5/4"}), n({value: 4, tuplet: "5/4"}), n({value: 4, tuplet: "5/4"})
            ], calculateDuration))).to.equal(1);
            expect(_.sum(_.map([
                n({value: 2, tuplet: "5/4"}), n({value: 2, tuplet: "5/4"}), n({value: 2, tuplet: "5/4"}), n({value: 2, tuplet: "5/4"}), n({value: 2, tuplet: "5/4"})
            ], calculateDuration))).to.equal(2);
        });
    });

    describe("calculateTupletDuration", () => {
        it("should return the length of a tuplet of given value", () => {
            expect(calculateTupletDuration("3/2", 4)).to.equal(0.5);
            expect(calculateTupletDuration("3/2", 8)).to.equal(0.25);
            expect(calculateTupletDuration("5/4", 16)).to.equal(0.25);
        });
    });

    describe("gt", () => {
        it("should handle time as a number", () => {
            const t1 = 1;
            const t2 = 2;
            const t3 = 2;

            expect(gt(t1, t2)).to.be.false;
            expect(gt(t2, t3)).to.be.false;
            expect(gt(t2, t1)).to.be.true;
        });

        it("should handle time as an object", () => {
            const t1 = {time: 1};
            const t2 = {time: 2};
            const t3 = {time: 2};

            expect(gt(t1, t2)).to.be.false;
            expect(gt(t2, t3)).to.be.false;
            expect(gt(t2, t1)).to.be.true;
        });
    });

    describe("gte", () => {
        it("should handle time as a number", () => {
            const t1 = 1;
            const t2 = 2;
            const t3 = 2;

            expect(gte(t1, t2)).to.be.false;
            expect(gte(t2, t3)).to.be.true;
            expect(gte(t2, t1)).to.be.true;
        });

        it("should handle time as an object", () => {
            const t1 = {time: 1};
            const t2 = {time: 2};
            const t3 = {time: 2};

            expect(gte(t1, t2)).to.be.false;
            expect(gte(t2, t3)).to.be.true;
            expect(gte(t2, t1)).to.be.true;
        });
    });

    describe("lt", () => {
        it("should handle time as a number", () => {
            const t1 = 1;
            const t2 = 2;
            const t3 = 2;

            expect(lt(t1, t2)).to.be.true;
            expect(lt(t2, t3)).to.be.false;
            expect(lt(t2, t1)).to.be.false;
        });

        it("should handle time as an object", () => {
            const t1 = {time: 1};
            const t2 = {time: 2};
            const t3 = {time: 2};

            expect(lt(t1, t2)).to.be.true;
            expect(lt(t2, t3)).to.be.false;
            expect(lt(t2, t1)).to.be.false;
        });
    });

    describe("lte", () => {
        it("should handle time as a number", () => {
            const t1 = 1;
            const t2 = 2;
            const t3 = 2;

            expect(lte(t1, t2)).to.be.true;
            expect(lte(t2, t3)).to.be.true;
            expect(lte(t2, t1)).to.be.false;
        });

        it("should handle time as an object", () => {
            const t1 = {time: 1};
            const t2 = {time: 2};
            const t3 = {time: 2};

            expect(lte(t1, t2)).to.be.true;
            expect(lte(t2, t3)).to.be.true;
            expect(lte(t2, t1)).to.be.false;
        });
    });

    describe("absoluteToRelativeDuration", () => {
        it("should handle basic note values", () => {
            expect(absoluteToRelativeDuration(1)).to.eql({value: 1, dots: 0});
            expect(absoluteToRelativeDuration(1/2)).to.eql({value: 2, dots: 0});
            expect(absoluteToRelativeDuration(1/4)).to.eql({value: 4, dots: 0});
            expect(absoluteToRelativeDuration(1/8)).to.eql({value: 8, dots: 0});
            expect(absoluteToRelativeDuration(1/16)).to.eql({value: 16, dots: 0});
            expect(absoluteToRelativeDuration(1/32)).to.eql({value: 32, dots: 0});
            expect(absoluteToRelativeDuration(1/64)).to.eql({value: 64, dots: 0});
        });
        it("should handle single dotted items", () => {
            expect(absoluteToRelativeDuration(1 + 1/2)).to.eql({value: 1, dots: 1});
            expect(absoluteToRelativeDuration(1/2 + 1/4)).to.eql({value: 2, dots: 1});
            expect(absoluteToRelativeDuration(1/4 + 1/8)).to.eql({value: 4, dots: 1});
            expect(absoluteToRelativeDuration(1/8 + 1/16)).to.eql({value: 8, dots: 1});
            expect(absoluteToRelativeDuration(1/16 + 1/32)).to.eql({value: 16, dots: 1});
            expect(absoluteToRelativeDuration(1/32 + 1/64)).to.eql({value: 32, dots: 1});
            expect(absoluteToRelativeDuration(1/64 + 1/128)).to.eql({value: 64, dots: 1});
        });
        it("should handle double dotted items", () => {
            expect(absoluteToRelativeDuration(1 + 1/2 + 1/4)).to.eql({value: 1, dots: 2});
            expect(absoluteToRelativeDuration(1/2 + 1/4 + 1/8)).to.eql({value: 2, dots: 2});
            expect(absoluteToRelativeDuration(1/4 + 1/8 + 1/16)).to.eql({value: 4, dots: 2});
            expect(absoluteToRelativeDuration(1/8 + 1/16 + 1/32)).to.eql({value: 8, dots: 2});
            expect(absoluteToRelativeDuration(1/16 + 1/32 + 1/64)).to.eql({value: 16, dots: 2});
            expect(absoluteToRelativeDuration(1/32 + 1/64 + 1/128)).to.eql({value: 32, dots: 2});
            expect(absoluteToRelativeDuration(1/64 + 1/128 + 1/256)).to.eql({value: 64, dots: 2});
        });
    });

    describe('iterateByTime', () => {
        it('should pass a time object as the first param to the iterator.', () => {
            const timeSig = scored.timeSig({value: '4/4', measure: 0});
            const children = [note({value: 4}), note({value: 8}), note({value: 2})];
            const v1 = scored.voice({}, children);
            const times = iterateByTime(
                _.partial(getTimeFromSignatures, [timeSig]),
                time => time,
                [v1.children]
            );
            expect(times.length).to.equal(3);
            expect(times[0]).to.eql({time: 0, measure: 0, beat:0});
            expect(times[1]).to.eql({time: 0.25, measure: 0, beat:1});
            expect(times[2]).to.eql({time: 0.375, measure: 0, beat:1.5});
        });
    });
});
