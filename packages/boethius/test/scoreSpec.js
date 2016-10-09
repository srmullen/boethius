import {expect} from "chai";
import Scored from "../src/Scored";
import Score, {getTimeFrame} from "../src/views/Score";

describe("Score", () => {

    const scored = new Scored();

    describe("getLineByVoice", () => {
        it("should return a Line that contains the given voice", () => {
            let fourfour = scored.timeSig({value: "4/4", measure: 0}),
                line1 = scored.line({voices: [0]}),
                line2 = scored.line({voices: [1]}),
                line3 = scored.line({voices: ["alto"]}),
                score = scored.score({}, [line1, line2, line3, fourfour]);
            expect(Score.getLineByVoice(0, score.lines)).to.equal(line1);
            expect(Score.getLineByVoice(1, score.lines)).to.equal(line2);
            expect(Score.getLineByVoice("alto", score.lines)).to.equal(line3);
        });
    });
});
