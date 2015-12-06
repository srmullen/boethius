import {expect} from "chai";

import {concat, partitionBy, partitionWhen, map, mapDeep, juxt, reductions, isEven, isOdd} from "../src/utils/common";
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

    describe("partitionWhen", () => {
        it("should partition the collection everytime the given function returns true", () => {
            expect(partitionWhen([1, 2], isEven)).to.eql([[1], [2]]);
            expect(partitionWhen([1, 2], isOdd)).to.eql([[1, 2]]);
            expect(partitionWhen([1, 2, 3, 1, 2, 3, 4], x => x === 1)).to.eql([[1,2,3], [1,2,3,4]]);
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

    describe("mapDeep", () => {
        it("map fn across deepColl and and exraction of deepColl.length from flat coll", () => {
            expect(mapDeep((w, x) => map((y, z) => y + z, w, x), [[1,2,3], [4,5], [6,7,8]], [1,2,3,4,5,6,7,8])).to.eql([[2,4,6],[8,10],[12,14,16]]);
        });
    });

    describe("juxt", () => {
        it("should return a function that when called applied each of fns to the input", () => {
            let incFrom = juxt(x => x + 1, x => x + 2, x => x + 3);
            expect(incFrom(0)).to.eql([1, 2, 3]);
            expect(incFrom(5)).to.eql([6, 7, 8]);
        });
    });

    describe("reductions", () => {
        it("should return the intermediate results of the reduction", () => {
            expect(reductions((x, y) => x + y, [1, 1, 1, 1, 1])).to.eql([1, 2, 3, 4, 5]);
            expect(reductions((x, y) => x + y, [1, 1, 1, 1, 1], 1)).to.eql([1, 2, 3, 4, 5, 6]);
            expect(reductions((x, y) => x + y, [1, 2, 3, 4, 5])).to.eql([1, 3, 6, 10, 15]);
            expect(reductions((x, y) => x + y, [1, 2, 3, 4, 5], 1)).to.eql([1, 2, 4, 7, 11, 16]);

            expect(reductions(concat, [1, 2, 3], [])).to.eql([[], [1], [1, 2], [1, 2, 3]]);
        });

        it("should recognize init for all values except undefined", () => {
            expect(reductions((x, y) => x + y, [1, 2, 3, 4, 5], 0)).to.eql([0, 1, 3, 6, 10, 15]);
            expect(reductions((str, c) => str + c, ["a", "b", "c"], "")).to.eql(["", "a", "ab", "abc"]);
        });
    });

    describe("isEven", () => {
        it("should return true for even numbers, false otherwise", () => {
            expect(isEven(0)).to.be.true;
            expect(isEven(1)).to.be.false;
            expect(isEven(2)).to.be.true;
            expect(isEven(-0)).to.be.true;
            expect(isEven(-1)).to.be.false;
            expect(isEven(-2)).to.be.true;
        });
    });

    describe("isOdd", () => {
        it("should return true for odd numbers, false otherwise", () => {
            expect(isOdd(0)).to.be.false;
            expect(isOdd(1)).to.be.true;
            expect(isOdd(2)).to.be.false;
            expect(isOdd(-0)).to.be.false;
            expect(isOdd(-1)).to.be.true;
            expect(isOdd(-2)).to.be.false;
        });
    });
});
