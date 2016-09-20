import {expect} from "chai";

import Clef from "../src/views/Clef";
import Dynamic from "../src/views/Dynamic";
import Key from "../src/views/Key";
import TimeSignature from "../src/views/TimeSignature";

describe("Clef", () => {
    describe("equals", () => {
        it("should compare type", () => {
            const c = new Clef({});
            const d = new Dynamic({});
            expect(c.equals(d)).to.be.false;
        });

        it("should compare value", () => {
            const c1 = new Clef({value: "treble"});
            const c2 = new Clef({value: "alto"});
            expect(c1.equals(c2)).to.be.false;
        });

        it("should compare measure", () => {
            const c1 = new Clef({measure: 2});
            const c2 = new Clef({measure: 3});
            expect(c1.equals(c2)).to.be.false;
        });

        it("should compare beat", () => {
            const c1 = new Clef({beat: 3});
            const c2 = new Clef({beat: 4});
            expect(c1.equals(c2)).to.be.false;
        });
    });
});

describe("Dynamic", () => {
    describe("equals", () => {
        it("should compare type", () => {
            const c = new Clef({});
            const d = new Dynamic({});
            expect(d.equals(c)).to.be.false;
        });

        it("should compare value", () => {
            const d1 = new Dynamic({value: "f"});
            const d2 = new Dynamic({value: "p"});
            const d3 = new Dynamic({value: "f"});
            expect(d1.equals(d2)).to.be.false;
            expect(d1.equals(d3)).to.be.true;
        });

        it("should compare time", () => {
            const d1 = new Dynamic({time: 1});
            const d2 = new Dynamic({time: 2});
            const d3 = new Dynamic({time: 1});
            expect(d1.equals(d2)).to.be.false;
            expect(d1.equals(d3)).to.be.true;
        });
    });
});

describe("Key", () => {
    describe("equals", () => {
        it("should compare type", () => {
            const k = new Key({});
            const c = new Clef({});
            expect(k.equals(c)).to.be.false;
        });

        it("should compare value", () => {
            const k1 = new Key({value: "c"});
            const k2 = new Key({value: "d#"});
            const k3 = new Key({value: "c"});
            expect(k1.equals(k2)).to.be.false;
            expect(k1.equals(k3)).to.be.true;
        });

        it("should compare measure", () => {
            const k1 = new Key({measure: 2});
            const k2 = new Key({measure: 3});
            expect(k1.equals(k2)).to.be.false;
        });

        it("should compare beat", () => {
            const k1 = new Key({beat: 3});
            const k2 = new Key({beat: 4});
            expect(k1.equals(k2)).to.be.false;
        });
    });
});

describe("TimeSignature", () => {
    describe("equals", () => {
        it("should compare type", () => {
            const t = new TimeSignature({});
            const c = new Clef({});
            expect(t.equals(c)).to.be.false;
        });

        it("should compare value", () => {
            const t1 = new TimeSignature({value: "4/4"});
            const t2 = new TimeSignature({value: "3/8"});
            const t3 = new TimeSignature({value: "4/4"});
            expect(t1.equals(t2)).to.be.false;
            expect(t1.equals(t3)).to.be.true;
        });

        it("should compare measure", () => {
            const t1 = new TimeSignature({measure: 2});
            const t2 = new TimeSignature({measure: 3});
            const t3 = new TimeSignature({measure: 2});
            expect(t1.equals(t2)).to.be.false;
            expect(t1.equals(t3)).to.be.true;
        });

        it("should compare beatStructure", () => {
            const t1 = new TimeSignature({beatStructure: [2, 2]});
            const t2 = new TimeSignature({beatStructure: [1, 1, 1, 1]});
            const t3 = new TimeSignature({beatStructure: [2, 2]});
            expect(t1.equals(t2)).to.be.false;
            expect(t1.equals(t3)).to.be.true;
        })
    });
});
