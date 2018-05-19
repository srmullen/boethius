import {expect} from "chai";
import compile from "../src/main";
import Layout from '../src/Layout';

describe("parser", () => {
    it("should return an empty array for an empty file", () => {
        expect(compile("")).to.eql({
            voices: {}, chordSymbols: [], layout: new Layout().serialize()
        });
    });

    describe("notes", () => {
        it("should return an object with type and pitch", () => {
            const {voices} = compile("[mel e4]");
            expect(voices.mel[0].type).to.eql("note");
            expect(voices.mel[0].props).to.eql({
                octave: 4,
                pitchClass: "e",
                time: 0
            });
        });

        it("should return an object with type, pitch, and value", () => {
            const {voices} = compile("[mel c#3/8]");
            expect(voices.mel[0].props).to.eql({
                octave: 3,
                pitchClass: "c#",
                value: 8,
                dots: 0,
                time: 0
            });
        });

        it("should return an object with type, pitch, value, and dots", () => {
            const {voices} = compile("[mel bb5/1..]");
            expect(voices.mel[0].props).to.eql({
                "octave": 5,
                "pitchClass": "bb",
                "value": 1,
                "dots": 2,
                time: 0
            });
        });

        it("should take capitalized notes", () => {
            const {voices} = compile("[mel A1 B2 C3 D4 E5 F6 G7]");
            const [a, b, c, d, e, f, g] = voices.mel;
            expect(a.props.pitchClass).to.equal("A");
            expect(b.props.pitchClass).to.equal("B");
            expect(c.props.pitchClass).to.equal("C");
            expect(d.props.pitchClass).to.equal("D");
            expect(e.props.pitchClass).to.equal("E");
            expect(f.props.pitchClass).to.equal("F");
            expect(g.props.pitchClass).to.equal("G");
            expect(a.props.octave).to.equal(1);
            expect(b.props.octave).to.equal(2);
            expect(c.props.octave).to.equal(3);
            expect(d.props.octave).to.equal(4);
            expect(e.props.octave).to.equal(5);
            expect(f.props.octave).to.equal(6);
            expect(g.props.octave).to.equal(7);
        });
    });

    describe("rests", () => {
        it("should return an object with a type of rest", () => {
            const {voices} = compile("[mel r]");
            expect(voices.mel[0].type).to.eql("rest");
        });

        it("should return an object with type and value", () => {
            const {voices} = compile("[mel r/2]");
            expect(voices.mel[0].props).to.eql({value: 2, dots: 0, time: 0});
        });

        it("should return an object with type, value, and dots", () => {
            const {voices} = compile("[mel r/16.]");
            expect(voices.mel[0].props).to.eql({value: 16, dots: 1, time: 0});
        });
    });

    describe("chords", () => {
        it("should return and object with type and children", () => {
            const {voices} = compile("[mel <c4 e4 g4>]");
            expect(voices.mel[0].type).to.eql("chord");
            expect(voices.mel[0].props).to.eql({time: 0});
            expect(voices.mel[0].children.length).to.equal(3);
        });

        it("should return an object with type, children, and value", () => {
            const {voices} = compile("[mel <c4 e4>/8]");
            expect(voices.mel[0].props).to.eql({value: 8, dots: 0, time: 0});
            expect(voices.mel[0].children.length).to.eql(2);
        });

        it("should return an object with type, children, dots, and value", () => {
            const {voices} = compile("[mel <c4 e4>/32...]");
            expect(voices.mel[0].props).to.eql({value: 32, dots: 3, time: 0});
        });
    });

    describe("chord symbols", () => {
        it("should create a chord symbol with csym", () => {
            const {chordSymbols} = compile("(csym :cmaj 4)");
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
            const {chordSymbols} = compile("(csym :cmaj 2 3)");
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
            const {chordSymbols} = compile("(csym :cmaj 5 1.5)");
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
            expect(compile("(csym :cmaj 5 1.5) (csym :fmin 0)").chordSymbols.length).to.equal(2);
            expect(compile("(csym :cmaj 5 1.5) c4 <d4 f4> (csym :fmin 0)").chordSymbols.length).to.equal(2);
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
            const {voices: {mel}} = compile("[mel ({foo=bar bar=baz} c4)]");
            expect(mel[0].props.foo).to.equal("bar");
            expect(mel[0].props.bar).to.equal("baz");
        });
    });

    describe("single line comments", () => {
        it("should ignore text after ;", () => {
            expect(compile("; i'm a comment")).to.eql({
                voices: {}, chordSymbols: [], layout: new Layout().serialize()
            });
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
            expect(note1.props).to.eql({pitchClass: "c", octave: 4, time: 0});
            expect(note2.props).to.eql({pitchClass: "e", octave: 4, time: 0.25});
        });
    });

    describe('multiline comments', () => {
        it('should ignore code inbetween /* and */', () => {
            const compiled = compile(`
                [mel c4 /* d4 */ e4]
            `);
            expect(compiled).to.be.ok;
            const [note1, note2] = compiled.voices.mel;
            expect(note1.props).to.eql({pitchClass: "c", octave: 4, time: 0});
            expect(note2.props).to.eql({pitchClass: "e", octave: 4, time: 0.25});
        });

        it('should ignore code across multiple lines', () => {
            const compiled = compile(`
                [mel c4 /*
                    d4
                    This is a great piece of music!
                    */ e4]
            `);
            expect(compiled).to.be.ok;
            const [note1, note2] = compiled.voices.mel;
            expect(note1.props).to.eql({pitchClass: "c", octave: 4, time: 0});
            expect(note2.props).to.eql({pitchClass: "e", octave: 4, time: 0.25});
        });

        it('should evaluate code between the first and second comment', () => {
            const compiled = compile(`
                [mel c4 /*
                    d4 **/
                    e4
                    /***
                    * This is a great piece of music!
                    */]
            `);
            expect(compiled).to.be.ok;
            const [note1, note2] = compiled.voices.mel;
            expect(note1.props).to.eql({pitchClass: "c", octave: 4, time: 0});
            expect(note2.props).to.eql({pitchClass: "e", octave: 4, time: 0.25});
        });

        it('should not be comment inside of a string', () => {
            const compiled = compile(`
                [mel (myprop="this /* is no comment */" a4)]
            `);
            expect(compiled).to.be.ok;
            expect(compiled.voices.mel[0].props.myprop).to.equal("this /* is no comment */");
        });
    });

    describe("barlines", () => {
        it("should ignore them", () => {
            expect(compile("c4/1 | d4/1")).to.be.ok;
        });
    });

    // Keywords can be used as inputs to built in functions
    describe('keywords', () => {
        it('should not fail', () => {
            expect(compile(':hello')).to.be.ok;
        });
    });
});

describe('properties', () => {
    it('should allow single identifier properties', () => {
        expect(compile('props = {hello}')).to.be.ok;
    });

    it('should allow multiple identifier properties', () => {
        expect(compile('props = {hello goodbye}')).to.be.ok;
    });

    it('should allow single assignment properties', () => {
        expect(compile('props = {hello=1}')).to.be.ok;
    });

    it('should allow multiple assignment properties', () => {
        expect(compile('props = {hello=1 goodbye=2}')).to.be.ok;
    });

    it('should allow a mix of identifier and assignment properties', () => {
        expect(compile('props = {one hello=1 two goodbye=2}')).to.be.ok;
        expect(compile('props = {hello=1 one goodbye=2 two}')).to.be.ok;
    });
});

describe('scope', () => {
    it('should add prop to list items', () => {
        const {voices} = compile(`
            [mel ({prop=value} a4)]
        `);
        expect(voices.mel[0].props.prop).to.equal('value');
    });

    it('should handle multiple props', () => {
        const {voices} = compile(`
            [mel ({prop1=val1 prop2=val2} a4)]
        `);
        expect(voices.mel[0].props.prop1).to.equal('val1');
        expect(voices.mel[0].props.prop2).to.equal('val2');
    });

    it('should handle nested scopes', () => {
        const {voices} = compile(`
            [mel (prop3=val3 ({prop1=val1 prop2=val2} a4))]
        `);
        expect(voices.mel[0].props.prop1).to.equal('val1');
        expect(voices.mel[0].props.prop2).to.equal('val2');
        expect(voices.mel[0].props.prop3).to.equal('val3');
    });
});

describe('assignment', () => {
    it('should allow assignment of strings', () => {
        expect(compile('myvar = "hello"')).to.be.ok;
    });

    it('should allow assignment of booleans', () => {
        expect(compile('myvar = true')).to.be.ok;
        expect(compile('myvar = false')).to.be.ok;
    });

    it('should allow assignment of numbers', () => {
        expect(compile('myvar = 3')).to.be.ok;
        expect(compile('myvar = 5.2')).to.be.ok;
    });

    it('should allow assignment of ratios', () => {
        expect(compile('myvar = 3/2')).to.be.ok;
    });

    it('should allow assignment of scopes', () => {
        expect(compile('myvar = (a b c)')).to.be.ok;
        expect(compile('myvar = (legato a b c)')).to.be.ok;
        expect(compile('myvar = ({legato=true value=16} a b c)')).to.be.ok;
    });

    it('should allow assignment of properties', () => {
        expect(compile('myvar = {value=16 legato=true}')).to.be.ok;
    });
});

describe('builtins', () => {
    describe('legato', () => {
        it('should fail', () => {
            const {voices} = compile(`[mel (legato a4 b5)]`);
            expect(voices.mel[0].props.legato).to.be.a('string');
            expect(voices.mel[0].props.legato).to.equal(voices.mel[1].props.legato);
        });
    });

    describe('repeat', () => {
        it('should handle layout items', () => {
            const {layout} = compile(`(repeat 4 (system 1))`);
            expect(layout.systems.length).to.equal(4);
        });

        it('should handle voice items', () => {
            const {voices} = compile(`
                [mel (repeat 3 a4)]
            `);
            expect(voices.mel.length).to.equal(3);
            expect(voices.mel[0].props.pitchClass).to.equal('a');
        });
    });

    describe('in-key!', () => {
        it('should compile', () => {
            expect(compile(`(in-key! (key :C :minor))`)).to.be.ok;
        });

        it('should apply accidentals from the given key to the notes', () => {
            const {voices} = compile(`
                (in-key! (key :C :minor))
                [scale (value=8 c d e f g a b)]
            `);
            expect(voices.scale.length).to.equal(7);
            expect(voices.scale.map(note => note.props.pitchClass))
                .to.eql(['c', 'd', 'eb', 'f', 'g', 'ab', 'bb']);
        });

        it('should not make any change if the note already has an accidental', () => {
            const {voices} = compile(`
                (in-key! (key :D :major))
                [scale fb f]
            `);
            expect(voices.scale.map(note => note.props.pitchClass))
                .to.eql(['fb', 'f#']);
        });

        it('should be able to change keys', () => {
            const {voices} = compile(`
                (in-key! (key :D :major))
                ~ns1 = (value=8 fb f)
                (in-key! (key :C :minor))
                ~ns2 = (value=8 e c)
                [scale ~ns1 ~ns2]
            `);
            expect(voices.scale.map(note => note.props.pitchClass))
                .to.eql(['fb', 'f#', 'eb', 'c']);
        });

        it('should accept :none keyword to remove current key', () => {
            const {voices} = compile(`
                (in-key! (key :D :major))
                ~ns1 = (value=8 fb f)
                (in-key! :none)
                ~ns2 = (value=8 e c)
                [scale ~ns1 ~ns2]
            `);
            expect(voices.scale.map(note => note.props.pitchClass))
                .to.eql(['fb', 'f#', 'e', 'c']);
        });

        it('should add key to layout if in voice', () => {
            const {voices, layout} = compile(`
                (line :mel)
                ~ns1 = (value=8 (in-key! (key :D :major)) fb f (in-key! (key :F# :minor)))
                [mel ~ns1]
            `);
            expect(voices.mel.map(note => note.props.pitchClass))
                .to.eql(['fb', 'f#']);

            expect(layout.lines[0].keys[0].root).to.equal('D');
            expect(layout.lines[0].keys[0].mode).to.equal('major');
            expect(layout.lines[0].keys[1].root).to.equal('F#');
            expect(layout.lines[0].keys[1].mode).to.equal('minor');
        });
    });
});
