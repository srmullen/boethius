import {expect} from "chai";
import Voice from "../src/views/Voice";
import Scored from "../src/Scored";

describe("Voice", () => {
    const scored = new Scored();
    const n = scored.note;

    describe("findBeaming", () => {
        const findBeaming = Voice.findBeaming;
        const n = scored.note;
        const fourfour = scored.timeSig({value: "4/4", beatStructure: [2, 2]});
        const nineeight = scored.timeSig({value: "9/8", beatStructure: [3, 3, 3]});

        it("should return an empty array if there are no notes in the collection", () => {
            expect(findBeaming(fourfour, [])).to.eql([]);
        });

        it("should return a note grouped by itself if it doesn't need beaming", () => {
            expect(findBeaming(fourfour, [scored.note({type: 4, time: 0})])).to.eql([[scored.note({type: 4, time: 0})]]);
            expect(findBeaming(fourfour, [scored.note({type: 2, time: 0})])).to.eql([[scored.note({type: 4, time: 0})]]);
            expect(findBeaming(fourfour, [scored.note({type: 1, time: 0})])).to.eql([[scored.note({type: 4, time: 0})]]);
        });

        it("should return notes so they can have stems and flags drawn", () => {
            expect(findBeaming(fourfour, [scored.note({type: 1, time: 0})])).to.eql([[scored.note({type: 1, time: 0})]]);
            expect(findBeaming(fourfour, [scored.note({type: 2, time: 0})])).to.eql([[scored.note({type: 2, time: 0})]]);
            expect(findBeaming(fourfour, [scored.note({type: 4, time: 0})])).to.eql([[scored.note({type: 4, time: 0})]]);
            expect(findBeaming(fourfour, [scored.note({value: 8, time: 0})])).to.eql([[scored.note({value: 8, time: 0})]]);
            expect(findBeaming(fourfour, [scored.note({value: 16, time: 0})])).to.eql([[scored.note({value: 16, time: 0})]]);
            expect(findBeaming(fourfour, [scored.note({value: 32, time: 0})])).to.eql([[scored.note({value: 32, time: 0})]]);
            expect(findBeaming(fourfour, [scored.note({value: 64, time: 0})])).to.eql([[scored.note({value: 64, time: 0})]]);
        });

        it("should handle chords", () => {
            expect(findBeaming(fourfour, [scored.chord({type: 1, time: 0}, ["c4", "e4"])])).to.eql([[scored.chord({type: 1, time: 0}, ["c4", "e4"])]]);
            expect(findBeaming(fourfour, [scored.chord({type: 2, time: 0}, ["c4", "e4"])])).to.eql([[scored.chord({type: 2, time: 0}, ["c4", "e4"])]]);
            expect(findBeaming(fourfour, [scored.chord({type: 4, time: 0}, ["c4", "e4"])])).to.eql([[scored.chord({type: 4, time: 0}, ["c4", "e4"])]]);
            expect(findBeaming(fourfour, [scored.chord({value: 8, time: 0}, ["c4", "e4"])])).to.eql([[scored.chord({value: 8, time: 0}, ["c4", "e4"])]]);
            expect(findBeaming(fourfour, [scored.chord({value: 16, time: 0}, ["c4", "e4"])])).to.eql([[scored.chord({value: 16, time: 0}, ["c4", "e4"])]]);
            expect(findBeaming(fourfour, [scored.chord({value: 32, time: 0}, ["c4", "e4"])])).to.eql([[scored.chord({value: 32, time: 0}, ["c4", "e4"])]]);
            expect(findBeaming(fourfour, [scored.chord({value: 64, time: 0}, ["c4", "e4"])])).to.eql([[scored.chord({value: 64, time: 0}, ["c4", "e4"])]]);
        });

        it("should split collection of notes into groups that need to be beamed", () => {
            const notes = [n({value: 8}), n({value: 8}), n({value: 8}), n({value: 8}), n({value: 8}), n({value: 8}), n({value: 8}), n({value: 8})];
            const voice = scored.voice({}, notes);
            expect(findBeaming(fourfour, voice.children)).to.eql([
                [notes[0], notes[1], notes[2], notes[3]], [notes[4], notes[5], notes[6], notes[7]]
            ]);
        });

        it("should split notes that don't need a flag even if the fit into a beat group", () => {
            const notes = [n({pitch: "g4", value: 4, tuplet: "3/2"}), n({pitch: "a4", value: 4, tuplet: "3/2"}), n({pitch: "b4", value: 4, tuplet: "3/2"})];
            const voice = scored.voice({}, notes);
            expect(findBeaming(fourfour, voice.children)).to.eql([
                [notes[0]], [notes[1]], [notes[2]]
            ]);
        });

        it("should handle eighth note to qurter note within a beat", () => {
            const eighth = n({value: 8});
            const quarter = n({value: 4});
            const voice = scored.voice({}, [eighth, quarter]);
            expect(findBeaming(fourfour, voice.children)).to.eql([
                [eighth], [quarter]
            ]);
        });
    });

    describe("groupTuplets", () => {
        const groupTuplets = Voice.groupTuplets;

        it("should group consecutive tuplet items together", () => {
            const eighthTriplet = n({value: 8, tuplet: "3/2"});
            expect(groupTuplets([
                eighthTriplet, eighthTriplet, eighthTriplet
            ])).to.eql([[eighthTriplet, eighthTriplet, eighthTriplet]]);
        });

        it("should not group any items that don't have a tuplet property", () => {
            const eighthTriplet = n({value: 8, tuplet: "3/2"});
            expect(groupTuplets([
                eighthTriplet, eighthTriplet, eighthTriplet,
                n({value: 8}), n({value: 8}),
                eighthTriplet, eighthTriplet, eighthTriplet
            ])).to.eql([[eighthTriplet, eighthTriplet, eighthTriplet], [eighthTriplet, eighthTriplet, eighthTriplet]]);
        });

        it("should not split tuplets of the same type", () => {
            const eighthTriplet = n({value: 8, tuplet: "3/2"});
            const sixteenthTriplet = n({value: 16, tuplet: "3/2"});
            const sixteenthQuintuplet = n({value: 16, tuplet: "5/4"});

            expect(groupTuplets([
                eighthTriplet, eighthTriplet, eighthTriplet, sixteenthTriplet, sixteenthTriplet, eighthTriplet, eighthTriplet
            ])).to.eql([[eighthTriplet, eighthTriplet, eighthTriplet], [sixteenthTriplet, sixteenthTriplet, eighthTriplet, eighthTriplet]]);

            expect(groupTuplets([
                sixteenthQuintuplet, sixteenthQuintuplet, sixteenthQuintuplet, sixteenthQuintuplet, sixteenthQuintuplet,
                n({value: 16, tuplet: "7/12"}),
                sixteenthQuintuplet, sixteenthQuintuplet, sixteenthQuintuplet, sixteenthQuintuplet, sixteenthQuintuplet
            ])).to.eql([
                [sixteenthQuintuplet, sixteenthQuintuplet, sixteenthQuintuplet, sixteenthQuintuplet, sixteenthQuintuplet],
                [n({value: 16, tuplet: "7/12"})],
                [sixteenthQuintuplet, sixteenthQuintuplet, sixteenthQuintuplet, sixteenthQuintuplet, sixteenthQuintuplet]
            ]);
        });
    });

    describe("groupSlurs", () => {
        const groupSlurs = Voice.groupSlurs;

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

    describe("getTimeFrame", () => {
        it("should return an array", () => {
            let v = scored.voice();
            expect(v.getTimeFrame(0, 1)).to.eql([]);
        });

        it("should return only the items that fall in the given time frame", () => {
            let n1 = scored.note({value: 4}),
                n2 = scored.note({value: 4}),
                n3 = scored.note({value: 4}),
                n4 = scored.note({value: 4}),
                n5 = scored.note({value: 4});
            let v = scored.voice({}, [n1, n2, n3, n4, n5]);
            expect(v.getTimeFrame(0, 1)).to.eql([n1, n2, n3, n4]);
            expect(v.getTimeFrame(0.25, 0.5)).to.eql([n2]);
        });
    });

    describe("equals", () => {
        it("should compare type", () => {
            const v = scored.voice({});
            const c = scored.chord({});
            expect(v.equals(c)).to.be.false;
        });

        it("should compare name", () => {
            const v1 = scored.voice({name: "treble"});
            const v2 = scored.voice({name: "bass"});
            expect(v1.equals(v2)).to.be.false;
        });

        it("should compare stemDirection", () => {
            const v1 = scored.voice({stemDirection: "up"});
            const v2 = scored.voice({stemDirection: "down"});
            expect(v1.equals(v2)).to.be.false;
        });

        it("should compare children", () => {
            const v1 = scored.voice({}, [scored.note({pitch: "a4"})]);
            const v2 = scored.voice({}, [scored.note({pitch: "b4"})]);
            const v3 = scored.voice({}, [scored.note({pitch: "a4"})]);
            expect(v1.equals(v2)).to.be.false;
            expect(v1.equals(v3)).to.be.true;
        });

        it("should compare children length", () => {
            const v1 = scored.voice({}, [scored.note({pitch: "a4"})]);
            const v2 = scored.voice({}, [scored.note({pitch: "a4"}), scored.rest()]);
            expect(v1.equals(v2)).to.be.false;
            expect(v2.equals(v1)).to.be.false;
        });
    });

    describe("iteration", () => {
        it("should have nothing to iterate if no children are passed", () => {
            const v = scored.voice({name: "treble"});
            expect([...v].length).to.equal(0);
        });

        it("should have items equals to the number of children given they're all at different times", () => {
            const v1 = scored.voice({name: "treble"}, [scored.note()]);
            const v2 = scored.voice({name: "bass"}, [scored.note, scored.rest]);
            const v3 = scored.voice({name: "alto"}, [scored.chord({}, ["c4", "e4"]), scored.rest(), scored.note]);
            expect([...v1].length).to.equal(1);
            expect([...v2].length).to.equal(2);
            expect([...v3].length).to.equal(3);
        });

        it("should return an array as the iterable value", () => {
            const v = scored.voice({}, [scored.note()]);
            const iter = v.iterate();
            const {value} = iter.next();
            expect(value).to.be.an("array");
        });

        it("should group the items by time", () => {
            const v = scored.voice({}, [scored.clef(), scored.key()]);
            const iter = v.iterate();
            const {value} = iter.next();
            expect(value.length).to.equal(2);
        });

        it("should return the times in order", () => {
            const v = scored.voice({}, [
                scored.clef(), scored.key(), scored.note({value: 8}), scored.rest({value: 4}), scored.chord({}, ["c3", "e3", "g3"])
            ]);
            const times = [];
            for (let items of v) {
                times.push(items[0].time);
            }

            expect(times).to.eql([0, 0.125, 0.375]);
        });
    });
});
