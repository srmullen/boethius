import {expect} from "chai";
import Voice from "../src/views/Voice";
import Scored from "../src/Scored";

describe("Voice", () => {
    const scored = new Scored();
    const n = scored.note;
    
    describe("getTimeFrame", () => {
        it("should return an array", () => {
            let v = scored.voice();
            expect(v.getTimeFrame(0, 1)).to.eql([]);
        });

        it("should return only the items that fall in the given time frame", () => {
            let n1 = scored.note({value: 4}),
                n2 = scored.note({value: 4}),
                n3 = scored.note({value: 4}),
                n4 = scored.note({value: 4}),
                n5 = scored.note({value: 4});
            let v = scored.voice({}, [n1, n2, n3, n4, n5]);
            expect(v.getTimeFrame(0, 1)).to.eql([n1, n2, n3, n4]);
            expect(v.getTimeFrame(0.25, 0.5)).to.eql([n2]);
        });
    });

    describe("equals", () => {
        it("should compare type", () => {
            const v = scored.voice({});
            const c = scored.chord({});
            expect(v.equals(c)).to.be.false;
        });

        it("should compare name", () => {
            const v1 = scored.voice({name: "treble"});
            const v2 = scored.voice({name: "bass"});
            expect(v1.equals(v2)).to.be.false;
        });

        it("should compare stemDirection", () => {
            const v1 = scored.voice({stemDirection: "up"});
            const v2 = scored.voice({stemDirection: "down"});
            expect(v1.equals(v2)).to.be.false;
        });

        it("should compare children", () => {
            const v1 = scored.voice({}, [scored.note({pitch: "a4"})]);
            const v2 = scored.voice({}, [scored.note({pitch: "b4"})]);
            const v3 = scored.voice({}, [scored.note({pitch: "a4"})]);
            expect(v1.equals(v2)).to.be.false;
            expect(v1.equals(v3)).to.be.true;
        });

        it("should compare children length", () => {
            const v1 = scored.voice({}, [scored.note({pitch: "a4"})]);
            const v2 = scored.voice({}, [scored.note({pitch: "a4"}), scored.rest()]);
            expect(v1.equals(v2)).to.be.false;
            expect(v2.equals(v1)).to.be.false;
        });
    });

    describe("iteration", () => {
        it("should have nothing to iterate if no children are passed", () => {
            const v = scored.voice({name: "treble"});
            expect([...v].length).to.equal(0);
        });

        it("should have items equals to the number of children given they're all at different times", () => {
            const v1 = scored.voice({name: "treble"}, [scored.note()]);
            const v2 = scored.voice({name: "bass"}, [scored.note, scored.rest]);
            const v3 = scored.voice({name: "alto"}, [scored.chord({}, ["c4", "e4"]), scored.rest(), scored.note]);
            expect([...v1].length).to.equal(1);
            expect([...v2].length).to.equal(2);
            expect([...v3].length).to.equal(3);
        });

        it("should return an array as the iterable value", () => {
            const v = scored.voice({}, [scored.note()]);
            const iter = v.iterate();
            const {value} = iter.next();
            expect(value).to.be.an("array");
        });

        it("should group the items by time", () => {
            const v = scored.voice({}, [scored.clef(), scored.key()]);
            const iter = v.iterate();
            const {value} = iter.next();
            expect(value.length).to.equal(2);
        });

        it("should return the times in order", () => {
            const v = scored.voice({}, [
                scored.clef(), scored.key(), scored.note({value: 8}), scored.rest({value: 4}), scored.chord({}, ["c3", "e3", "g3"])
            ]);
            const times = [];
            for (let items of v) {
                times.push(items[0].time);
            }

            expect(times).to.eql([0, 0.125, 0.375]);
        });
    });

    describe("breakDurations", () => {
        const r = scored.rest;
        const n = scored.note;
        describe("whole note", () => {
            it("should break into two half notes", () => {
                const v = scored.voice({name: "v1"}, [
                    r({value: 2}), n({value: 1})
                ]);
                expect(v.children.length).to.equal(2);
                v.breakDurations([0, 1]);
                expect(v.children.length).to.equal(3);
            });
        });

        describe("half note", () => {
            it("should break into two quarter notes", () => {
                const v = scored.voice({name: "v2"}, [
                    r({value: 2}), r({value: 4}), n({value: 2})
                ]);
                expect(v.children.length).to.equal(3);
                v.breakDurations([0, 1]);
                expect(v.children.length).to.equal(4);
            });
        });

        describe("quarter note", () => {
            it("should break into two eighth notes", () => {
                const v = scored.voice({name: "v3"}, [
                    r({value: 2}), r({value: 4}), r({value: 8}), n({value: 4})
                ]);
                expect(v.children.length).to.equal(4);
                v.breakDurations([0, 1]);
                expect(v.children.length).to.equal(5);
            });
        });

        describe("eighth note", () => {
            it("should break into two sixteenth notes", () => {
                const v = scored.voice({name: "v4"}, [
                    r({value: 2}), r({value: 4}), r({value: 8}), r({value: 16}), n({value: 8})
                ]);
                expect(v.children.length).to.equal(5);
                v.breakDurations([0, 1]);
                expect(v.children.length).to.equal(6);
            });
        });

        it ("should not break notes that end on the given time", () => {
            const v = scored.voice({name: "v3"}, [
                r({value: 2}), r({value: 4}), r({value: 8}), n({value: 8}), n({value: 8})
            ]);
            expect(v.children.length).to.equal(5);
            v.breakDurations([0, 1]);
            expect(v.children.length).to.equal(5);
        });
    });
});
