import {expect} from "chai";

import constants from "../src/constants";
import ChordSymbol from "../src/views/ChordSymbol";

describe("ChordSymbol", () => {
    const cs = new ChordSymbol({}, []);

    it("should have a type", () => {
        expect(cs.type).to.be.ok;
    });

    it("should have type of chordSymbol", () => {
        expect(cs.type).to.equal(constants.type.chordSymbol);
    });
});
