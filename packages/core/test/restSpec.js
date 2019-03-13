import {expect} from "chai";

import Rest from "../src/views/Rest";
import Note from "../src/views/Note";

describe("Rest", () => {
    describe("equals", () => {
        it("should compare type", () => {
            const r = new Rest({});
            const n = new Note({});
            expect(r.equals(n)).to.be.false;
        });

        it("should compare value", () => {
            const r1 = new Rest({value: 4});
            const r2 = new Rest({value: 8});
            const r3 = new Rest({value: 4});
            expect(r1.equals(r2)).to.be.false;
            expect(r1.equals(r3)).to.be.true;
        });

        it("should compare dots", () => {
            const r1 = new Rest({dots: 1});
            const r2 = new Rest({dots: 2});
            const r3 = new Rest({dots: 1});
            expect(r1.equals(r2)).to.be.false;
            expect(r1.equals(r3)).to.be.true;
        });

        it("should compare tuplet", () => {
            const r1 = new Rest({tuplet: "3/4"});
            const r2 = new Rest({tuplet: "5/8"});
            const r3 = new Rest({tuplet: "3/4"});
            expect(r1.equals(r2)).to.be.false;
            expect(r1.equals(r3)).to.be.true;
        });

        it("should compare time", () => {
            const r1 = new Rest({time: 4});
            const r2 = new Rest({time: 8});
            const r3 = new Rest({time: 4});
            expect(r1.equals(r2)).to.be.false;
            expect(r1.equals(r3)).to.be.true;
        });

        it("should compare slur", () => {
            const r1 = new Rest({slur: 4});
            const r2 = new Rest({slur: 8});
            const r3 = new Rest({slur: 4});
            expect(r1.equals(r2)).to.be.false;
            expect(r1.equals(r3)).to.be.true;
        });
    });
});
