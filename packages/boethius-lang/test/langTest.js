import {expect} from "chai";
import {parser} from "../lang/lang";

describe("parser", () => {
    it("should return an empty array for an empty file", () => {
        expect(parser.parse("")).to.eql([]);
    });

    describe("notes", () => {
        it("should return an object with type and pitch", () => {
            const [parsed] = parser.parse("e4");
            expect(parsed).to.eql({
                type: "note",
                pitch: "e4",
                frequency: 329.6275569128699,
                interval: 4,
                midi: 64,
                octave: 4,
                pitchClass: "e"
            });
        });

        it("should return an object with type, pitch, and value", () => {
            const [parsed] = parser.parse("c#3/8");
            expect(parsed).to.eql({
                frequency: 138.59131548843604,
                interval: 1,
                midi: 49,
                octave: 3,
                pitch: "c#3",
                pitchClass: "c#",
                type: "note",
                value: 8,
                dots: undefined
            });
        });

        it("should return an object with type, pitch, value, and dots", () => {
            const [parsed] = parser.parse("bb5/1..");
            expect(parsed).to.eql({
                "frequency": 932.3275230361799,
                "interval": 10,
                "midi": 82,
                "octave": 5,
                "pitch": "bb5",
                "pitchClass": "bb",
                "type": "note",
                "value": 1,
                "dots": 2
            });
        });
    });

    describe("rests", () => {
        it("should return an object with a type of rest", () => {
            const [parsed] = parser.parse("r");
            expect(parsed).to.eql({type: "rest"});
        });

        it("should return an object with type and value", () => {
            const [parsed] = parser.parse("r/2");
            expect(parsed).to.eql({type: "rest", value: 2, dots: undefined});
        });

        it("should return an object with type, value, and dots", () => {
            const [parsed] = parser.parse("r/16.");
            expect(parsed).to.eql({type: "rest", value: 16, dots: 1});
        });
    });

    describe("chords", () => {
        it("should return and object with type and children", () => {
            let parsed = parser.parse("<c4 e4 g4>");
            let notes = parser.parse("c4 e4 g4");
            expect(parsed[0]).to.eql({type: "chord", children: notes});
        });

        it("should return an object with type, children, and value", () => {
            let parsed = parser.parse("<c4 e4>/8");
            let notes = parser.parse("c4 e4");
            expect(parsed[0]).to.eql({type: "chord", children: notes, value: 8, dots: undefined});
        });

        it("should return an object with type, children, dots, and value", () => {
            let parsed = parser.parse("<c4 e4>/32...");
            let notes = parser.parse("c4 e4");
            expect(parsed[0]).to.eql({type: "chord", children: notes, value: 32, dots: 3});
        });
    });

    describe("multiple items", () => {
        it("should return an array of all items", () => {
            let parsed = parser.parse("g4 c5/8 r/8 <c4 e4 g4 c5>/1");
            expect(parsed.length).to.equal(4);
        });
    });

    describe("arbitrary properties", () => {
        it("should set true for the property if no value is given", () => {
            let parsed = parser.parse("(slur a4)");
            expect(parsed[0].slur).to.be.true;
        });

        it("should set boolean values if given", () => {
            let parsed = parser.parse("(foo=false <c3 e4>)");
            expect(parsed[0].foo).to.be.false;
        });

        it("should set integer values if given", () => {
            let parsed = parser.parse("(dots=2 r/16)");
            expect(parsed[0].dots).to.equal(2);
        });

        it("should set an identifier as a string if given", () => {
            let parsed = parser.parse("(bar=baz d5/8)");
            expect(parsed[0].bar).to.equal("baz");
        });

        it("should set ratios as as string if given", () => {
            const [parsed] = parser.parse("(tuplet=3/2 c4)");
            expect(parsed.tuplet).to.eql("3/2");
        })

        it("should set the value on all contained items", () => {
            let [note1, note2, note3] = parser.parse("(foo=1 b4 c5 d5)");
            expect(note1.foo).to.equal(1);
            expect(note2.foo).to.equal(1);
            expect(note3.foo).to.equal(1);
        });

        it("should parse multiple un-nested scopes", () => {
            let [note1, note2, note3] = parser.parse("(foo=1 b4) (foo=2 c5) (foo=3 d5)");
            expect(note1.foo).to.equal(1);
            expect(note2.foo).to.equal(2);
            expect(note3.foo).to.equal(3);
        });

        it("should give inner contexts priority", () => {
            let [note1, note2, note3] = parser.parse("(foo=1 b4 (foo=2 c5) d5)");
            expect(note1.foo).to.equal(1);
            expect(note2.foo).to.equal(2);
            expect(note3.foo).to.equal(1);
        });
    });
});
