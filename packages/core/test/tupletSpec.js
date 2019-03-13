import {expect} from "chai";
import Tuplet from '../src/views/Tuplet';
import Scored from "../src/Scored";

describe('Tupelet', () => {
    const scored = new Scored();
    const n = scored.note;
    
    describe("groupItems", () => {
        const groupItems = Tuplet.groupItems;

        it("should group consecutive tuplet items together", () => {
            const eighthTriplet = n({value: 8, tuplet: "3/2"});
            expect(groupItems([
                eighthTriplet, eighthTriplet, eighthTriplet
            ])).to.eql([[eighthTriplet, eighthTriplet, eighthTriplet]]);
        });

        it("should not group any items that don't have a tuplet property", () => {
            const eighthTriplet = n({value: 8, tuplet: "3/2"});
            expect(groupItems([
                eighthTriplet, eighthTriplet, eighthTriplet,
                n({value: 8}), n({value: 8}),
                eighthTriplet, eighthTriplet, eighthTriplet
            ])).to.eql([[eighthTriplet, eighthTriplet, eighthTriplet], [eighthTriplet, eighthTriplet, eighthTriplet]]);
        });

        it("should not split tuplets of the same type", () => {
            const eighthTriplet = n({value: 8, tuplet: "3/2"});
            const sixteenthTriplet = n({value: 16, tuplet: "3/2"});
            const sixteenthQuintuplet = n({value: 16, tuplet: "5/4"});

            expect(groupItems([
                eighthTriplet, eighthTriplet, eighthTriplet, sixteenthTriplet, sixteenthTriplet, eighthTriplet, eighthTriplet
            ])).to.eql([[eighthTriplet, eighthTriplet, eighthTriplet], [sixteenthTriplet, sixteenthTriplet, eighthTriplet, eighthTriplet]]);

            expect(groupItems([
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
});
