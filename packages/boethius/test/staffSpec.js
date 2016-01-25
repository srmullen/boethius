import {expect} from "chai";
import Staff from "../src/views/Staff";
import {getStaffItems} from "../src/utils/staff";
import Scored from "../src/Scored";

describe("Staff", () => {
    const scored = new Scored();
    describe("getStaffItems", () => {
        xit("should map one voice to one line", () => {
            let n1 = scored.note();
            expect(getStaffItems([scored.line()], [scored.voice({}, [n1])])).to.eql([[n1]]);
        });

        it("should map line.voices strings to voice names", () => {
            let n1 = scored.note({value: 8, pitch: "c5"});
            let n2 = scored.note({value: 2, pitch: "d4"});
            let v1 = scored.voice({name: "voice1"}, [n1]);
            let v2 = scored.voice({name: "voice2"}, [n2]);
            let l1 = scored.line({voices: ["voice1"]});
            let l2 = scored.line({voices: ["voice2"]});
            let l3 = scored.line({voices: ["voice1", "voice2"]});

            expect(getStaffItems([l1, l2], [v1, v2])).to.eql([
                [n1],
                [n2]
            ]);

            expect(getStaffItems([l3], [v1, v2])).to.eql([
                [n1, n2]
            ]);
        });

        it("should return an empty arrays if there are no voices", () => {
            let l1 = scored.line({voices: ["voice1"]});
            let l2 = scored.line({voices: ["voice2"]});

            expect(getStaffItems([l1], [])).to.eql([[]]);
            expect(getStaffItems([l1, l2], [])).to.eql([[], []]);
        });
    });
});
