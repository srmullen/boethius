import {expect} from "chai";
import Staff from "../src/views/Staff";
import {groupVoices} from "../src/utils/staff";
import Scored from "../src/Scored";

describe("Staff", () => {
    const scored = new Scored();
    describe("groupVoices", () => {
        it("should add one voice to each line if there are no voice names", () => {
            let l1 = scored.line();
            let l2 = scored.line();
            let v1 = scored.voice();
            let v2 = scored.voice();
            let voiceMap = groupVoices([l1, l2], [v1, v2]);
            expect(voiceMap.get(l1)).to.eql([v1]);
            expect(voiceMap.get(l1)).to.eql([v2]);
        });

        xit("should add voices with names to lines that ask for that name", () => {
            let highLine = scored.line({voices: ["soprano", "alto"]});
            let lowLine = scored.line({voices: ["tenor", "bass"]});
            let [soprano, alto, tenor, bass] = ["soprano", "alto", "tenor", "bass"].map(name => scored.line({name}));
            let voiceMap = groupVoices([lowLine, highLine], [soprano, alto, tenor, bass]);
            expect(voiceMap.get(highLine)).to.eql([soprano, alto]);
            expect(voiceMap.get(lowLine)).to.eql(tenor, bass);
        });
    });
});
