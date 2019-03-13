import {expect} from "chai";
import _ from "lodash";

import {getAccidental, createAccidentalContext} from "../src/utils/accidental";
import {parsePitch} from "../src/utils/note";
import Scored from "../src/Scored";

describe("accidental", () => {
    let scored = new Scored();
    describe("getAccidental", () => {
        it("should return the pitches accidental if accidentals is empty", () => {
            expect(getAccidental(parsePitch("a4"), [])).not.to.be.defined;
            expect(getAccidental(parsePitch("a#5"), [])).to.equal("#");
            expect(getAccidental(parsePitch("bb6"), [])).to.equal("b");
            expect(getAccidental(parsePitch("cx7"))).to.equal("x");
            expect(getAccidental(parsePitch("cbb8"))).to.equal("bb");
        });

        it("should return an empty string if the pitches accidental is already in context", () => {
            expect(getAccidental(parsePitch("a#5"), [parsePitch("a#5")])).not.to.be.defined;
            expect(getAccidental(parsePitch("bb6"), [parsePitch("bb6")])).not.to.be.defined;
            expect(getAccidental(parsePitch("cx7"), [parsePitch("cx7")])).not.to.be.defined;
            expect(getAccidental(parsePitch("cbb8"), [parsePitch("cbb8")])).not.to.be.defined;
            expect(getAccidental(parsePitch("d4"), [parsePitch("dn4")])).not.to.be.defined;
        });

        it("should return the pitches accidental if the accidental was realized in a different octave", () => {
            expect(getAccidental(parsePitch("a#5"), [parsePitch("a#1")])).to.equal("#");
            expect(getAccidental(parsePitch("bb6"), [parsePitch("bb2")])).to.equal("b");
            expect(getAccidental(parsePitch("cx7"), [parsePitch("cx3")])).to.equal("x");
            expect(getAccidental(parsePitch("cbb8"), [parsePitch("cbb4")])).to.equal("bb");
            expect(getAccidental(parsePitch("d4"), [parsePitch("dn5")])).not.to.be.defined;
        });

        it("should return a natural if the pitch has no accidental but on has already been realized", () => {
            expect(getAccidental(parsePitch("a5"), [parsePitch("a#5")])).to.equal("n");
            expect(getAccidental(parsePitch("b6"), [parsePitch("bb6")])).to.equal("n");
            expect(getAccidental(parsePitch("c7"), [parsePitch("cx7")])).to.equal("n");
            expect(getAccidental(parsePitch("c8"), [parsePitch("cbb8")])).to.equal("n");
        });

        it("should return the pitches accidental if the contexts accidental is different", () => {
            expect(getAccidental(parsePitch("a#5"), [parsePitch("ab5")])).to.equal("#");
            expect(getAccidental(parsePitch("bb6"), [parsePitch("b#6")])).to.equal("b");
            expect(getAccidental(parsePitch("cx7"), [parsePitch("cn7")])).to.equal("x");
            expect(getAccidental(parsePitch("cbb8"), [parsePitch("cx8")])).to.equal("bb");
        });

        it("should handle the key", () => {
            let dMaj = scored.key({value: "D"}),
                dMin = scored.key({value: "d"});

            expect(getAccidental(parsePitch("f5"), [], dMaj)).to.equal("n");
            expect(getAccidental(parsePitch("f#5"), [], dMaj)).not.to.be.defined;
            expect(getAccidental(parsePitch("f5"), [parsePitch("f5")], dMaj)).not.to.be.defined;
            expect(getAccidental(parsePitch("f#5"), [parsePitch("f5")], dMaj)).to.equal("#");
            expect(getAccidental(parsePitch("b6"), [], dMaj)).not.to.be.defined;

            expect(getAccidental(parsePitch("f5"), [], dMin)).not.to.be.defined;
            expect(getAccidental(parsePitch("f#5"), [], dMin)).to.equal("#");
            expect(getAccidental(parsePitch("f5"), [parsePitch("f5")], dMin)).not.to.be.defined;
            expect(getAccidental(parsePitch("b6"), [], dMin)).to.equal("n");
        });
    });

    describe("createAccidentalContext", () => {
        it("should merge the accidental contexts", () => {
            let gSharp = parsePitch("g#4"),
                aFlat = parsePitch("ab4");
            expect(createAccidentalContext([gSharp], [aFlat])).to.eql([gSharp, aFlat]);
        });

        it("should overwrite pitches in the first context if they exist diatonically in the second context", () => {
            let aSharp = parsePitch("a#4"),
                aFlat = parsePitch("ab4"),
                eFlat = parsePitch("eb4"),
                bFlat = parsePitch("bb4");
            expect(createAccidentalContext([aSharp], [aFlat])).to.eql([aFlat]);
            let ctx = createAccidentalContext([aSharp, bFlat], [aFlat, eFlat]);
            expect(ctx.length).to.equal(3);
            expect(_.indexOf(ctx, aFlat) >= 0).to.be.ok;
            expect(_.indexOf(ctx, eFlat) >= 0).to.be.ok;
            expect(_.indexOf(ctx, bFlat) >= 0).to.be.ok;
            expect(_.indexOf(ctx, aSharp)).to.equal(-1);
        });
    });
});
