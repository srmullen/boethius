import {expect} from "chai";
import {divide} from "../src/utils/barline";
import Note from "../src/views/Note";
import Rest from "../src/views/Rest";
import Chord from "../src/views/Chord";

describe("barline", () => {
    describe("divide", () => {
        it("should return the item if it ends before the given time", () => {
            const n = new Note({value: 4, time: 0});
            expect(divide(1, n)).to.equal(n);
        });

        it("should return the item if it starts after the given time", () => {
            const n = new Note({value: 4, time: 1.5});
            expect(divide(1, n)).to.equal(n);
        });

        it("should return an array of two new items if there is overlap", () => {
            const n = new Note({value: 1, time: 0.5});
            const division = divide(1, n);
            expect(division).to.be.instanceof(Array);
            expect(division.length).to.equal(2);
            expect(division[0]).not.to.equal(n);
            expect(division[1]).not.to.equal(n);
        });

        it("should return notes if passed a Note", () => {
            const n = new Note({value: 1, time: 0.5});
            const division = divide(1, n);
            expect(division[0]).to.be.instanceof(Note);
            expect(division[1]).to.be.instanceof(Note);
        });

        it("should return rests if passed a Rest", () => {
            const r = new Rest({value: 1, time: 0.5});
            const division = divide(1, r);
            expect(division[0]).to.be.instanceof(Rest);
            expect(division[1]).to.be.instanceof(Rest);
        });

        it("should not slur rests", () => {
            const r = new Rest({value: 1, time: 0.5});
            const division = divide(1, r);
            expect(division[0].slur).not.to.be.ok;
            expect(division[1].slur).not.to.be.ok;
        });

        it("should return notes if passed a Chord", () => {
            const c = new Chord({value: 1, time: 0.5}, ["a4", "b4"]);
            const division = divide(1, c);
            expect(division[0]).to.be.instanceof(Chord);
            expect(division[1]).to.be.instanceof(Chord);
        });

        describe("time examples", () => {
            it("whole note => two halves", () => {
                const n = new Note({value: 1, time: 0.5});
                const division = divide(1, n);
                expect(division[0].value).to.equal(2);
                expect(division[0].time).to.equal(0.5);
                expect(division[1].value).to.equal(2);
                expect(division[1].time).to.equal(1);
            });

            it("half note => two quarters", () => {
                const n = new Note({value: 2, time: 0.75});
                const division = divide(1, n);
                expect(division[0].value).to.equal(4);
                expect(division[0].time).to.equal(0.75);
                expect(division[1].value).to.equal(4);
                expect(division[1].time).to.equal(1);
            });

            it("quarter note => two eighths", () => {
                const t = 0.75 + 1/8;
                const n = new Note({value: 4, time: t});
                const division = divide(1, n);
                expect(division[0].value).to.equal(8);
                expect(division[0].time).to.equal(t);
                expect(division[1].value).to.equal(8);
                expect(division[1].time).to.equal(1);
            });

            it("eighth => two sixteenths", () => {
                const t = 0.75 + 1/8 + 1/16;
                const n = new Note({value: 8, time: t});
                const division = divide(1, n);
                expect(division[0].value).to.equal(16);
                expect(division[0].time).to.equal(t);
                expect(division[1].value).to.equal(16);
                expect(division[1].time).to.equal(1);
            });

            it("sixteenth => two 32nds", () => {
                const t = 0.75 + 1/8 + 1/16 + 1/32;
                const n = new Note({value: 16, time: t});
                const division = divide(1, n);
                expect(division[0].value).to.equal(32);
                expect(division[0].time).to.equal(t);
                expect(division[1].value).to.equal(32);
                expect(division[1].time).to.equal(1);
            });

            it("1/4. => 1/4 1/8", () => {
                const n = new Note({value: 4, dots: 1, time: 0.75});
                const division = divide(1, n);
                expect(division[0].value).to.equal(4);
                expect(division[1].value).to.equal(8);
                expect(division[1].dots).not.to.be.ok;
            });

            it("1/2 => 1/8 1/4.", () => {
                const n = new Note({value: 2, time: 0.75 + 1/8});
                const division = divide(1, n);
                expect(division[0].value).to.equal(8);
                expect(division[1].value).to.equal(4);
                expect(division[1].dots).to.equal(1);
            })
        });
    });
});
