import {expect} from "chai";
import compile from "../src/main";

describe("parser", () => {
    it("should return an empty array for an empty file", () => {
        expect(compile("")).to.eql({voices: {}, chordSymbols: []});
    });

    describe("notes", () => {
        it("should return an object with type and pitch", () => {
            const {voices} = compile("[mel e4]");
            expect(voices.mel[0].type).to.eql("note");
            expect(voices.mel[0].props).to.eql({
                pitch: "e4",
                frequency: 329.6275569128699,
                interval: 4,
                midi: 64,
                octave: 4,
                pitchClass: "e"
            });
        });

        it("should return an object with type, pitch, and value", () => {
            const {voices} = compile("[mel c#3/8]");
            expect(voices.mel[0].props).to.eql({
                frequency: 138.59131548843604,
                interval: 1,
                midi: 49,
                octave: 3,
                pitch: "c#3",
                pitchClass: "c#",
                value: 8,
                dots: 0
            });
        });

        it("should return an object with type, pitch, value, and dots", () => {
            const {voices} = compile("[mel bb5/1..]");
            expect(voices.mel[0].props).to.eql({
                "frequency": 932.3275230361799,
                "interval": 10,
                "midi": 82,
                "octave": 5,
                "pitch": "bb5",
                "pitchClass": "bb",
                "value": 1,
                "dots": 2
            });
        });

        it("should take capitalized notes", () => {
            const {voices} = compile("[mel A4 B4 C4 D4 E4 F4 G4]");
            const [a, b, c, d, e, f, g] = voices.mel;
            expect(a.props.pitch).to.equal("A4");
            expect(b.props.pitch).to.equal("B4");
            expect(c.props.pitch).to.equal("C4");
            expect(d.props.pitch).to.equal("D4");
            expect(e.props.pitch).to.equal("E4");
            expect(f.props.pitch).to.equal("F4");
            expect(g.props.pitch).to.equal("G4");
        });
    });

    describe("rests", () => {
        it("should return an object with a type of rest", () => {
            const {voices} = compile("[mel r]");
            expect(voices.mel[0].type).to.eql("rest");
        });

        it("should return an object with type and value", () => {
            const {voices} = compile("[mel r/2]");
            expect(voices.mel[0].props).to.eql({value: 2, dots: 0});
        });

        it("should return an object with type, value, and dots", () => {
            const {voices} = compile("[mel r/16.]");
            expect(voices.mel[0].props).to.eql({value: 16, dots: 1});
        });
    });

    xdescribe("chords", () => {
        it("should return and object with type and children", () => {
            const {voices} = compile("[mel <c4 e4 g4>]");
            const notes = compile("(c4 e4 g4");
            expect(voices.mel[0]).to.eql({type: "chord", props: {}, children: notes});
        });

        it("should return an object with type, children, and value", () => {
            let parsed = compile("<c4 e4>/8");
            let notes = compile("c4 e4");
            expect(parsed[0]).to.eql({type: "chord", children: notes, props: {value: 8, dots: 0}});
        });

        it("should return an object with type, children, dots, and value", () => {
            let parsed = compile("<c4 e4>/32...");
            let notes = compile("c4 e4");
            expect(parsed[0]).to.eql({type: "chord", children: notes, props: {value: 32, dots: 3}});
        });
    });

    describe("chord symbols", () => {
        it("should create a chord symbol with csym", () => {
            const {chordSymbols} = compile("(csym cmaj 4)");
            expect(chordSymbols[0]).to.eql({
                props: {
                    value: "cmaj",
                    measure: 4,
                    beat: 0
                },
                type: "chordSymbol"
            });
        });

        it("should take a beat param as integer", () => {
            const {chordSymbols} = compile("(csym cmaj 2 3)");
            expect(chordSymbols[0]).to.eql({
                props: {
                    value: "cmaj",
                    measure: 2,
                    beat: 3
                },
                type: "chordSymbol"
            });
        });

        it("should take a beat param as float", () => {
            const {chordSymbols} = compile("(csym cmaj 5 1.5)");
            expect(chordSymbols[0]).to.eql({
                props: {
                    value: "cmaj",
                    measure: 5,
                    beat: 1.5
                },
                type: "chordSymbol"
            });
        });

        it("should handle multiple chord symbols", () => {
            expect(compile("(csym cmaj 5 1.5) (csym fmin 0)").chordSymbols.length).to.equal(2);
            expect(compile("(csym cmaj 5 1.5) c4 <d4 f4> (csym fmin 0)").chordSymbols.length).to.equal(2);
        });
    });

    describe("multiple items", () => {
        it("should return an array of all items", () => {
            const parsed = compile("[mel g4 c5/8 r/8 <c4 e4 g4 c5>/1]");
            expect(parsed.voices.mel.length).to.equal(4);
        });
    });

    describe("duration", () => {
        it("should set value and dots", () => {
            const {voices: {mel}} = compile("[mel f#3 g4/8 bb6/2.]");
            const [{props: note1}, {props: note2}, {props: note3}] = mel;
            expect(note1.value).not.to.be.defined;
            expect(note1.dots).not.to.be.defined;
            expect(note2.value).to.equal(8);
            expect(note2.dots).to.equal(0);
            expect(note3.value).to.equal(2);
            expect(note3.dots).to.equal(1);
        });

        it("should not override dots when there is a duration", () => {
            const {voices: {mel}} = compile("[mel c4/4 (dots=1 c4/4 c4/4.. c4)]");
            const [note1, note2, note3, note4] = mel;
            expect(note1.props.dots).not.to.be.defined;
            expect(note2.props.dots).to.equal(0);
            expect(note3.props.dots).to.equal(2);
            expect(note4.props.dots).to.equal(1);
        });
    });

    describe("arbitrary properties", () => {
        it("should set true for the property if no value is given", () => {
            const {voices} = compile("[mel (slur a4)]");
            expect(voices.mel[0].props.slur).to.be.true;
        });

        it("should set boolean values if given", () => {
            const {voices} = compile("[mel (foo=false <c3 e4>)]");
            expect(voices.mel[0].props.foo).to.be.false;
        });

        it("should set integer values if given", () => {
            const {voices} = compile("[mel (dots=2 r)]");
            expect(voices.mel[0].props.dots).to.equal(2);
        });

        it("should set float values if given", () => {
            const {voices} = compile("[mel (tempo=34.56 c4)]");
            expect(voices.mel[0].props.tempo).to.equal(34.56);
        });

        it("should set an identifier as a string if given", () => {
            const {voices} = compile("[mel (bar=baz d5/8)]");
            expect(voices.mel[0].props.bar).to.equal("baz");
        });

        it("should set ratios as as string if given", () => {
            const {voices} = compile("[mel (tuplet=3/2 c4)]");
            expect(voices.mel[0].props.tuplet).to.eql("3/2");
        });

        it("should set the value on all contained items", () => {
            const {voices: {mel}} = compile("[mel (foo=1 b4 c5 d5)]");
            const [note1, note2, note3] = mel;
            expect(note1.props.foo).to.equal(1);
            expect(note2.props.foo).to.equal(1);
            expect(note3.props.foo).to.equal(1);
        });

        it("should parse multiple un-nested scopes", () => {
            const {voices: {mel}} = compile("[mel (foo=1 b4) (foo=2 c5) (foo=3 d5)]");
            const [note1, note2, note3] = mel;
            expect(note1.props.foo).to.equal(1);
            expect(note2.props.foo).to.equal(2);
            expect(note3.props.foo).to.equal(3);
        });

        it("should give inner contexts priority", () => {
            const {voices: {mel}} = compile("[mel (foo=1 b4 (foo=2 c5) d5)]");
            const [note1, note2, note3] = mel;
            expect(note1.props.foo).to.equal(1);
            expect(note2.props.foo).to.equal(2);
            expect(note3.props.foo).to.equal(1);
        });

        it("should handle multiple arbitrary properties in one scope", () => {
            const {voices: {mel}} = compile("[mel (foo=bar bar=baz c4)]");
            expect(mel[0].props.foo).to.equal("bar");
            expect(mel[0].props.bar).to.equal("baz");
        });
    });

    describe("comments", () => {
        it("should ignore text after ;", () => {
            expect(compile("; i'm a comment")).to.eql({voices: {}, chordSymbols: []});
            const {voices: {mel}} = compile(`[mel c4 ; d4
            ]`);
            const [note1, note2] = mel;
            expect(note1).to.be.ok;
            expect(note2).not.to.be.ok;
        });

        it("should not carry over to a newline", () => {
            const {voices: {mel}} = compile(
                `[mel c4 ; d4
                e4]`);
            const [note1, note2] = mel;
            expect(note1.props.pitch).to.equal("c4");
            expect(note2.props.pitch).to.equal("e4");
        });
    });

    describe("barlines", () => {
        it("should ignore them", () => {
            expect(compile("c4/1 | d4/1")).to.be.ok;
        });
    });

    xdescribe("time", () => {
        it("should add a time property", () => {
            const [parsedNote] = compile("c4");
            expect(parsedNote.props.time).to.equal(0);

            const [parsedRest] = compile("r");
            expect(parsedRest.props.time).to.equal(0);

            const [parsedChord] = compile("<d4 f4>");
            expect(parsedChord.props.time).to.equal(0);
        });

        it("should increment time for subsequent items", () => {
            const items = compile("c4 d4/8 r");
            expect(items[0].props.time).to.equal(0);
            expect(items[1].props.time).to.equal(0.25);
            expect(items[2].props.time).to.equal(0.375);
        });
    });
});
