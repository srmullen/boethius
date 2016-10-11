import {expect} from "chai";
import Slur from "../src/views/Slur";
import Scored from "../src/Scored";

const scored = new Scored();
const n = scored.note;

describe("groupSlurs", () => {
    const groupSlurs = Slur.groupSlurs;

    it("should return an empty array if there are no notes to slur", () => {
        expect(groupSlurs([])).to.eql([]);
        expect(groupSlurs([n(), n()])).to.eql([]);
    });

    it("should group slured items in an array", () => {
        const n1 = n({slur: "s1"});
        const n2 = n({slur: "s1"});
        expect(groupSlurs([n1, n2])).to.eql([[n1, n2]]);
    });

    it("should group different slurs into different arrays", () => {
        const n1 = n({slur: "s1"}), n2 = n({slur: "s1"});
        const n3 = n({slur: "s2"}), n4 = n({slur: "s2"}), n5 = n({slur: "s2"});
        expect(groupSlurs([n1, n2, n3, n4, n5])).to.eql([[n1, n2], [n3, n4, n5]]);
    });

    it("should remove notes that don't have a slur IDs", () => {
        const n1 = n({slur: "s1"}), n2 = n({slur: "s1"});
        const n3 = n({pitch: "d5", value: "16"});
        const n4 = n({slur: "s2"}), n5 = n({slur: "s2"}), n6 = n({slur: "s2"});
        const n7 = n({pitch: "b4"});
        expect(groupSlurs([n1, n2, n3, n4, n5, n6, n7])).to.eql([[n1, n2], [n4, n5, n6]]);
    });
});
