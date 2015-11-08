import {expect} from "chai";

import {partitionBy} from "../src/utils/common";
import Scored from "../src/Scored";

describe("common", () => {
    let scored = new Scored();
    describe("partitionBy", () => {
        it("should return an empty collection if the given collection is empty", () => {
            let empty = [],
                partitioned = partitionBy([], x => x);
            expect(partitioned.length).to.equal(0);
            expect(partitioned).not.to.equal(empty);
        });

        it("should return an array of arrays", () => {
            expect(partitionBy([1], x => x)).to.eql([[1]]);
            expect(partitionBy([1, 1], x => x)).to.eql([[1, 1]]);
        });

        it("should partion the elements everytime f returns a new value", () => {
            expect(partitionBy([1, 2, 3], x => x)).to.eql([[1], [2], [3]]);
            expect(partitionBy([1, 1, 2, 2, 1, 1], x => x)).to.eql([[1, 1], [2, 2], [1, 1]]);
            let notes = [scored.note({value: 16}), scored.note({value: 16}), scored.note({value: 16}), scored.note({value: 16}),
                scored.note({value: 4}), scored.note({value: 4}), scored.note({value: 8}), scored.note({value: 16})];

            expect(partitionBy(notes, (note) => note.needsFlag())).to.eql([
                [scored.note({value: 16}), scored.note({value: 16}), scored.note({value: 16}), scored.note({value: 16})],
                [scored.note({value: 4}), scored.note({value: 4})],
                [scored.note({value: 8}), scored.note({value: 16})]
            ]);
        });
    });
});
