import {expect} from "chai";
import Legato from "../src/views/Legato";
import Scored from "../src/Scored";

const scored = new Scored();
const n = scored.note;

describe("Legato", () => {
    describe("groupLegato", () => {
        const groupLegato = Legato.groupLegato;

        it("should return an empty array if there are no legato notes.", () => {
            expect(groupLegato([])).to.eql([]);
            expect(groupLegato([n(), n()])).to.eql([]);
        });

        it("should group legato items in an array", () => {
            const n1 = n({legato: "s1"});
            const n2 = n({legato: "s1"});
            expect(groupLegato([n1, n2])).to.eql([[n1, n2]]);
        });

        it("should group different legato items into different arrays", () => {
            const n1 = n({legato: "s1"}), n2 = n({legato: "s1"});
            const n3 = n({legato: "s2"}), n4 = n({legato: "s2"}), n5 = n({legato: "s2"});
            expect(groupLegato([n1, n2, n3, n4, n5])).to.eql([[n1, n2], [n3, n4, n5]]);
        });

        it("should remove notes that don't have legato IDs", () => {
            const n1 = n({legato: "s1"}), n2 = n({legato: "s1"});
            const n3 = n({pitch: "d5", value: "16"});
            const n4 = n({legato: "s2"}), n5 = n({legato: "s2"}), n6 = n({legato: "s2"});
            const n7 = n({pitch: "b4"});
            expect(groupLegato([n1, n2, n3, n4, n5, n6, n7])).to.eql([[n1, n2], [n4, n5, n6]]);
        });
    });
});

describe("Slur", () => {
    
});
