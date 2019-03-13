import { expect } from 'chai';
import Scored from '../src/Scored';
import Beaming from '../src/views/Beaming';
import {createMeasures} from '../src/views/Measure';

describe('beaming', () => {
    const scored = new Scored();
    const n = scored.note;

    describe("groupItems", () => {
        const findBeaming = Beaming.groupItems;
        const n = scored.note;
        const fourfour = scored.timeSig({value: "4/4", beatStructure: [2, 2]});
        const nineeight = scored.timeSig({value: "9/8", beatStructure: [3, 3, 3]});
        const measures = createMeasures(4, [fourfour]);

        it("should return an empty array if there are no notes in the collection", () => {
            expect(findBeaming([], {measures})).to.eql([]);
        });

        it("should return a note grouped by itself if it doesn't need beaming", () => {
            expect(findBeaming([scored.note({type: 4, time: 0})], {measures})).to.eql([[scored.note({type: 4, time: 0})]]);
            expect(findBeaming([scored.note({type: 2, time: 0})], {measures})).to.eql([[scored.note({type: 4, time: 0})]]);
            expect(findBeaming([scored.note({type: 1, time: 0})], {measures})).to.eql([[scored.note({type: 4, time: 0})]]);
        });

        it("should return notes so they can have stems and flags drawn", () => {
            expect(findBeaming([scored.note({type: 1, time: 0})], {measures})).to.eql([[scored.note({type: 1, time: 0})]]);
            expect(findBeaming([scored.note({type: 2, time: 0})], {measures})).to.eql([[scored.note({type: 2, time: 0})]]);
            expect(findBeaming([scored.note({type: 4, time: 0})], {measures})).to.eql([[scored.note({type: 4, time: 0})]]);
            expect(findBeaming([scored.note({value: 8, time: 0})], {measures})).to.eql([[scored.note({value: 8, time: 0})]]);
            expect(findBeaming([scored.note({value: 16, time: 0})], {measures})).to.eql([[scored.note({value: 16, time: 0})]]);
            expect(findBeaming([scored.note({value: 32, time: 0})], {measures})).to.eql([[scored.note({value: 32, time: 0})]]);
            expect(findBeaming([scored.note({value: 64, time: 0})], {measures})).to.eql([[scored.note({value: 64, time: 0})]]);
        });

        it("should handle chords", () => {
            expect(findBeaming([scored.chord({type: 1, time: 0}, ["c4", "e4"])], {measures})).to.eql([[scored.chord({type: 1, time: 0}, ["c4", "e4"])]]);
            expect(findBeaming([scored.chord({type: 2, time: 0}, ["c4", "e4"])], {measures})).to.eql([[scored.chord({type: 2, time: 0}, ["c4", "e4"])]]);
            expect(findBeaming([scored.chord({type: 4, time: 0}, ["c4", "e4"])], {measures})).to.eql([[scored.chord({type: 4, time: 0}, ["c4", "e4"])]]);
            expect(findBeaming([scored.chord({value: 8, time: 0}, ["c4", "e4"])], {measures})).to.eql([[scored.chord({value: 8, time: 0}, ["c4", "e4"])]]);
            expect(findBeaming([scored.chord({value: 16, time: 0}, ["c4", "e4"])], {measures})).to.eql([[scored.chord({value: 16, time: 0}, ["c4", "e4"])]]);
            expect(findBeaming([scored.chord({value: 32, time: 0}, ["c4", "e4"])], {measures})).to.eql([[scored.chord({value: 32, time: 0}, ["c4", "e4"])]]);
            expect(findBeaming([scored.chord({value: 64, time: 0}, ["c4", "e4"])], {measures})).to.eql([[scored.chord({value: 64, time: 0}, ["c4", "e4"])]]);
        });

        it("should split collection of notes into groups that need to be beamed", () => {
            const notes = [n({value: 8}), n({value: 8}), n({value: 8}), n({value: 8}), n({value: 8}), n({value: 8}), n({value: 8}), n({value: 8})];
            const voice = scored.voice({}, notes);
            expect(findBeaming(voice.children, {measures})).to.eql([
                [notes[0], notes[1], notes[2], notes[3]], [notes[4], notes[5], notes[6], notes[7]]
            ]);
        });

        it("should split notes that don't need a flag even if the fit into a beat group", () => {
            const notes = [n({pitch: "g4", value: 4, tuplet: "3/2"}), n({pitch: "a4", value: 4, tuplet: "3/2"}), n({pitch: "b4", value: 4, tuplet: "3/2"})];
            const voice = scored.voice({}, notes);
            expect(findBeaming(voice.children, {measures})).to.eql([
                [notes[0]], [notes[1]], [notes[2]]
            ]);
        });

        it("should handle eighth note to qurter note within a beat", () => {
            const eighth = n({value: 8});
            const quarter = n({value: 4});
            const voice = scored.voice({}, [eighth, quarter]);
            expect(findBeaming(voice.children, {measures})).to.eql([
                [eighth], [quarter]
            ]);
        });
    });
});
