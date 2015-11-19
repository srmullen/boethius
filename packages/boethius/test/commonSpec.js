import {expect} from "chai";

import {partitionBy, map, juxt} from "../src/utils/common";
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

    describe("map", () => {
        it("should work like regular map for one collection", () => {
            let coll = [1,2,3,4],
                inc = x => x + 1;
            expect(map(inc, coll)).to.eql([2,3,4,5]);
            expect(map(x => x.toString(), coll)).to.eql(["1", "2", "3", "4"]);
        });

        it("should work on multiple collections", () => {
            let sumThree = (x, y, z) => x + y + z;
            expect(map(sumThree, [1,2,3,4], [1,2,3,4], [1,2,3,4])).to.eql([3,6,9,12]);
            expect(map(sumThree, ["hello", "bonjour", "goodnight"],
                 [" ", " ", " "],
                 ["world", "madame", "moon"])).to.eql(["hello world", "bonjour madame", "goodnight moon"]);
        });

        it("should return a collection only as long as the shortest input collection", () => {
            expect(map((x, y) => x + y, [1,2], [3,4,5])).to.eql([4,6]);
            expect(map((x, y) => x + y, [3,4,5], [1,2])).to.eql([4,6]);
        });
    });

    describe("juxt", () => {
        it("should return a function that when called applied each of fns to the input", () => {
            let incFrom = juxt(x => x + 1, x => x + 2, x => x + 3);
            expect(incFrom(0)).to.eql([1, 2, 3]);
            expect(incFrom(5)).to.eql([6, 7, 8]);
        });
    });
});
