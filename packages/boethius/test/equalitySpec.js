import {expect} from "chai";

import {equals} from "../src/utils/equality";

const NOTE = "note";
const REST = "rest";
const CHORD = "chord";
const VOICE = "voice";
const CLEF = "clef";
const DYNAMIC = "dynamic";

describe("equality", () => {
    describe("equals", () => {
        it("should return false if type property isn't equal", () => {
            expect(equals({type: NOTE}, {type: REST})).to.be.false;
        });

        it("should throw an error if either object has no type", () => {
            expectException(() => equals({value: "a4"}, {type: REST}));
            expectException(() => equals({type: NOTE}, {children: [1,2,3]}));
            expectException(() => equals({value: "c2"}, {children: [1,2,3]}));
        });

        it("should handle note type", () => {
            expect(equals({type: NOTE}, {type: NOTE})).to.be.true;
        });

        it("should handle rest type", () => {
            expect(equals({type: REST}, {type: REST})).to.be.true;
        });

        it("should handle clef type", () => {
            expect(equals({type: CLEF}, {type: CLEF})).to.be.true;
        });

        it("should handle dynamic type", () => {
            expect(equals({type: DYNAMIC}, {type: DYNAMIC})).to.be.true;
        });
    });
});

function expectException (fn) {
    let exceptionThrown = false;
    try {
        fn();
    } catch (e) {
        exceptionThrown = true;
    }
    expect(exceptionThrown).to.be.true;
}
