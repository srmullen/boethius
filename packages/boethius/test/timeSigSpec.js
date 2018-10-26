import {expect} from "chai";

import TimeSignature from "../src/views/TimeSignature";

describe("TimeSignature", () => {
  describe("getDurationTime", () => {
    const fourfour = new TimeSignature({value: '4/4'});
    const threeeight = new TimeSignature({value: '3/8'});
    it("should return duration for the given number of beats.", () => {
      expect(fourfour.getDurationTime({beat: 0})).to.equal(0);
      expect(fourfour.getDurationTime({beat: 1})).to.equal(0.25);
      expect(threeeight.getDurationTime({beat: 1})).to.equal(0.125);
      expect(threeeight.getDurationTime({beat: 2})).to.equal(0.25);
      expect(threeeight.getDurationTime({beat: 5})).to.equal(0.625);
    });

    it('should return duration for the given number of measures', () => {
      expect(fourfour.getDurationTime({measure: 0})).to.equal(0);
      expect(fourfour.getDurationTime({measure: 1})).to.equal(1);
      expect(threeeight.getDurationTime({measure: 1})).to.equal(0.375);
      expect(threeeight.getDurationTime({measure: 2})).to.equal(0.75);
    });

    it('should handle measure and beat together', () => {
      expect(fourfour.getDurationTime({measure: 1, beat: 1})).to.equal(1.25);
      expect(fourfour.getDurationTime({measure: 2, beat: 3})).to.equal(2.75);
      expect(threeeight.getDurationTime({measure: 1, beat: 1})).to.equal(0.5);
      expect(threeeight.getDurationTime({measure: 2, beat: 2})).to.equal(1);
      expect(threeeight.getDurationTime({measure: 3, beat: 5})).to.equal(1.75);
    });
  });
});
