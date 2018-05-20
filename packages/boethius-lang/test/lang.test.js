import compile from "../src/main";
import Layout from '../src/Layout';

describe("parser", () => {
    test("should return an empty array for an empty file", () => {
        expect(compile("")).toEqual({
            voices: {}, chordSymbols: [], layout: new Layout().serialize()
        });
    });

    describe("notes", () => {
        test("should return an object with type and pitch", () => {
            const {voices} = compile("[mel e4]");
            expect(voices.mel[0].type).toEqual("note");
            expect(voices.mel[0].props).toEqual({
                octave: 4,
                pitchClass: "e",
                time: 0
            });
        });

        test("should return an object with type, pitch, and value", () => {
            const {voices} = compile("[mel c#3/8]");
            expect(voices.mel[0].props).toEqual({
                octave: 3,
                pitchClass: "c#",
                value: 8,
                dots: 0,
                time: 0
            });
        });

        test("should return an object with type, pitch, value, and dots", () => {
            const {voices} = compile("[mel bb5/1..]");
            expect(voices.mel[0].props).toEqual({
                "octave": 5,
                "pitchClass": "bb",
                "value": 1,
                "dots": 2,
                time: 0
            });
        });

        test('should allow n to be natural accidental', () => {
            const {voices} = compile("[mel cn an3]");
            expect(voices.mel[0].props.pitchClass).toEqual('c');
            expect(voices.mel[1].props.pitchClass).toEqual('a');
        });

        test("should take capitalized notes", () => {
            const {voices} = compile("[mel A1 B2 C3 D4 E5 F6 G7]");
            const [a, b, c, d, e, f, g] = voices.mel;
            expect(a.props.pitchClass).toBe("A");
            expect(b.props.pitchClass).toBe("B");
            expect(c.props.pitchClass).toBe("C");
            expect(d.props.pitchClass).toBe("D");
            expect(e.props.pitchClass).toBe("E");
            expect(f.props.pitchClass).toBe("F");
            expect(g.props.pitchClass).toBe("G");
            expect(a.props.octave).toBe(1);
            expect(b.props.octave).toBe(2);
            expect(c.props.octave).toBe(3);
            expect(d.props.octave).toBe(4);
            expect(e.props.octave).toBe(5);
            expect(f.props.octave).toBe(6);
            expect(g.props.octave).toBe(7);
        });
    });

    describe("rests", () => {
        test("should return an object with a type of rest", () => {
            const {voices} = compile("[mel r]");
            expect(voices.mel[0].type).toEqual("rest");
        });

        test("should return an object with type and value", () => {
            const {voices} = compile("[mel r/2]");
            expect(voices.mel[0].props).toEqual({value: 2, dots: 0, time: 0});
        });

        test("should return an object with type, value, and dots", () => {
            const {voices} = compile("[mel r/16.]");
            expect(voices.mel[0].props).toEqual({value: 16, dots: 1, time: 0});
        });
    });

    describe("chords", () => {
        test("should return and object with type and children", () => {
            const {voices} = compile("[mel <c4 e4 g4>]");
            expect(voices.mel[0].type).toEqual("chord");
            expect(voices.mel[0].props).toEqual({time: 0});
            expect(voices.mel[0].children.length).toBe(3);
        });

        test("should return an object with type, children, and value", () => {
            const {voices} = compile("[mel <c4 e4>/8]");
            expect(voices.mel[0].props).toEqual({value: 8, dots: 0, time: 0});
            expect(voices.mel[0].children.length).toEqual(2);
        });

        test("should return an object with type, children, dots, and value", () => {
            const {voices} = compile("[mel <c4 e4>/32...]");
            expect(voices.mel[0].props).toEqual({value: 32, dots: 3, time: 0});
        });
    });

    describe("chord symbols", () => {
        test("should create a chord symbol with csym", () => {
            const {chordSymbols} = compile("(csym :cmaj 4)");
            expect(chordSymbols[0]).toEqual({
                props: {
                    value: "cmaj",
                    measure: 4,
                    beat: 0
                },
                type: "chordSymbol"
            });
        });

        test("should take a beat param as integer", () => {
            const {chordSymbols} = compile("(csym :cmaj 2 3)");
            expect(chordSymbols[0]).toEqual({
                props: {
                    value: "cmaj",
                    measure: 2,
                    beat: 3
                },
                type: "chordSymbol"
            });
        });

        test("should take a beat param as float", () => {
            const {chordSymbols} = compile("(csym :cmaj 5 1.5)");
            expect(chordSymbols[0]).toEqual({
                props: {
                    value: "cmaj",
                    measure: 5,
                    beat: 1.5
                },
                type: "chordSymbol"
            });
        });

        test("should handle multiple chord symbols", () => {
            expect(compile("(csym :cmaj 5 1.5) (csym :fmin 0)").chordSymbols.length).toBe(2);
            expect(compile("(csym :cmaj 5 1.5) c4 <d4 f4> (csym :fmin 0)").chordSymbols.length).toBe(2);
        });
    });

    describe("multiple items", () => {
        test("should return an array of all items", () => {
            const parsed = compile("[mel g4 c5/8 r/8 <c4 e4 g4 c5>/1]");
            expect(parsed.voices.mel.length).toBe(4);
        });
    });

    describe("duration", () => {
        test("should set value and dots", () => {
            const {voices: {mel}} = compile("[mel f#3 g4/8 bb6/2.]");
            const [{props: note1}, {props: note2}, {props: note3}] = mel;
            expect(note1.value).not.toBeDefined();
            expect(note1.dots).not.toBeDefined();
            expect(note2.value).toBe(8);
            expect(note2.dots).toBe(0);
            expect(note3.value).toBe(2);
            expect(note3.dots).toBe(1);
        });

        test("should not override dots when there is a duration", () => {
            const {voices: {mel}} = compile("[mel c4/4 (dots=1 c4/4 c4/4.. c4)]");
            const [note1, note2, note3, note4] = mel;
            expect(note1.props.dots).not.toBeDefined();
            expect(note2.props.dots).toBe(0);
            expect(note3.props.dots).toBe(2);
            expect(note4.props.dots).toBe(1);
        });
    });

    describe("arbitrary properties", () => {
        test("should set true for the property if no value is given", () => {
            const {voices} = compile("[mel (slur a4)]");
            expect(voices.mel[0].props.slur).toBe(true);
        });

        test("should set boolean values if given", () => {
            const {voices} = compile("[mel (foo=false <c3 e4>)]");
            expect(voices.mel[0].props.foo).toBe(false);
        });

        test("should set integer values if given", () => {
            const {voices} = compile("[mel (dots=2 r)]");
            expect(voices.mel[0].props.dots).toBe(2);
        });

        test("should set float values if given", () => {
            const {voices} = compile("[mel (tempo=34.56 c4)]");
            expect(voices.mel[0].props.tempo).toBe(34.56);
        });

        test("should set an identifier as a string if given", () => {
            const {voices} = compile("[mel (bar=baz d5/8)]");
            expect(voices.mel[0].props.bar).toBe("baz");
        });

        test("should set ratios as as string if given", () => {
            const {voices} = compile("[mel (tuplet=3/2 c4)]");
            expect(voices.mel[0].props.tuplet).toEqual("3/2");
        });

        test("should set the value on all contained items", () => {
            const {voices: {mel}} = compile("[mel (foo=1 b4 c5 d5)]");
            const [note1, note2, note3] = mel;
            expect(note1.props.foo).toBe(1);
            expect(note2.props.foo).toBe(1);
            expect(note3.props.foo).toBe(1);
        });

        test("should parse multiple un-nested scopes", () => {
            const {voices: {mel}} = compile("[mel (foo=1 b4) (foo=2 c5) (foo=3 d5)]");
            const [note1, note2, note3] = mel;
            expect(note1.props.foo).toBe(1);
            expect(note2.props.foo).toBe(2);
            expect(note3.props.foo).toBe(3);
        });

        test("should give inner contexts priority", () => {
            const {voices: {mel}} = compile("[mel (foo=1 b4 (foo=2 c5) d5)]");
            const [note1, note2, note3] = mel;
            expect(note1.props.foo).toBe(1);
            expect(note2.props.foo).toBe(2);
            expect(note3.props.foo).toBe(1);
        });

        test("should handle multiple arbitrary properties in one scope", () => {
            const {voices: {mel}} = compile("[mel ({foo=bar bar=baz} c4)]");
            expect(mel[0].props.foo).toBe("bar");
            expect(mel[0].props.bar).toBe("baz");
        });
    });

    describe("single line comments", () => {
        test("should ignore text after ;", () => {
            expect(compile("; i'm a comment")).toEqual({
                voices: {}, chordSymbols: [], layout: new Layout().serialize()
            });
            const {voices: {mel}} = compile(`[mel c4 ; d4
            ]`);
            const [note1, note2] = mel;
            expect(note1).toBeTruthy();
            expect(note2).not.toBeTruthy();
        });

        test("should not carry over to a newline", () => {
            const {voices: {mel}} = compile(
                `[mel c4 ; d4
                e4]`);
            const [note1, note2] = mel;
            expect(note1.props).toEqual({pitchClass: "c", octave: 4, time: 0});
            expect(note2.props).toEqual({pitchClass: "e", octave: 4, time: 0.25});
        });
    });

    describe('multiline comments', () => {
        test('should ignore code inbetween /* and */', () => {
            const compiled = compile(`
                [mel c4 /* d4 */ e4]
            `);
            expect(compiled).toBeTruthy();
            const [note1, note2] = compiled.voices.mel;
            expect(note1.props).toEqual({pitchClass: "c", octave: 4, time: 0});
            expect(note2.props).toEqual({pitchClass: "e", octave: 4, time: 0.25});
        });

        test('should ignore code across multiple lines', () => {
            const compiled = compile(`
                [mel c4 /*
                    d4
                    This is a great piece of music!
                    */ e4]
            `);
            expect(compiled).toBeTruthy();
            const [note1, note2] = compiled.voices.mel;
            expect(note1.props).toEqual({pitchClass: "c", octave: 4, time: 0});
            expect(note2.props).toEqual({pitchClass: "e", octave: 4, time: 0.25});
        });

        test('should evaluate code between the first and second comment', () => {
            const compiled = compile(`
                [mel c4 /*
                    d4 **/
                    e4
                    /***
                    * This is a great piece of music!
                    */]
            `);
            expect(compiled).toBeTruthy();
            const [note1, note2] = compiled.voices.mel;
            expect(note1.props).toEqual({pitchClass: "c", octave: 4, time: 0});
            expect(note2.props).toEqual({pitchClass: "e", octave: 4, time: 0.25});
        });

        test('should not be comment inside of a string', () => {
            const compiled = compile(`
                [mel (myprop="this /* is no comment */" a4)]
            `);
            expect(compiled).toBeTruthy();
            expect(compiled.voices.mel[0].props.myprop).toBe("this /* is no comment */");
        });
    });

    describe("barlines", () => {
        test("should ignore them", () => {
            expect(compile("c4/1 | d4/1")).toBeTruthy();
        });
    });

    // Keywords can be used as inputs to built in functions
    describe('keywords', () => {
        test('should not fail', () => {
            expect(compile(':hello')).toBeTruthy();
        });
    });
});

describe('properties', () => {
    test('should allow single identifier properties', () => {
        expect(compile('props = {hello}')).toBeTruthy();
    });

    test('should allow multiple identifier properties', () => {
        expect(compile('props = {hello goodbye}')).toBeTruthy();
    });

    test('should allow single assignment properties', () => {
        expect(compile('props = {hello=1}')).toBeTruthy();
    });

    test('should allow multiple assignment properties', () => {
        expect(compile('props = {hello=1 goodbye=2}')).toBeTruthy();
    });

    test('should allow a mix of identifier and assignment properties', () => {
        expect(compile('props = {one hello=1 two goodbye=2}')).toBeTruthy();
        expect(compile('props = {hello=1 one goodbye=2 two}')).toBeTruthy();
    });
});

describe('scope', () => {
    test('should add prop to list items', () => {
        const {voices} = compile(`
            [mel ({prop=value} a4)]
        `);
        expect(voices.mel[0].props.prop).toBe('value');
    });

    test('should handle multiple props', () => {
        const {voices} = compile(`
            [mel ({prop1=val1 prop2=val2} a4)]
        `);
        expect(voices.mel[0].props.prop1).toBe('val1');
        expect(voices.mel[0].props.prop2).toBe('val2');
    });

    test('should handle nested scopes', () => {
        const {voices} = compile(`
            [mel (prop3=val3 ({prop1=val1 prop2=val2} a4))]
        `);
        expect(voices.mel[0].props.prop1).toBe('val1');
        expect(voices.mel[0].props.prop2).toBe('val2');
        expect(voices.mel[0].props.prop3).toBe('val3');
    });
});

describe('assignment', () => {
    test('should allow assignment of strings', () => {
        expect(compile('myvar = "hello"')).toBeTruthy();
    });

    test('should allow assignment of booleans', () => {
        expect(compile('myvar = true')).toBeTruthy();
        expect(compile('myvar = false')).toBeTruthy();
    });

    test('should allow assignment of numbers', () => {
        expect(compile('myvar = 3')).toBeTruthy();
        expect(compile('myvar = 5.2')).toBeTruthy();
    });

    test('should allow assignment of ratios', () => {
        expect(compile('myvar = 3/2')).toBeTruthy();
    });

    test('should allow assignment of scopes', () => {
        expect(compile('myvar = (a b c)')).toBeTruthy();
        expect(compile('myvar = (legato a b c)')).toBeTruthy();
        expect(compile('myvar = ({legato=true value=16} a b c)')).toBeTruthy();
    });

    test('should allow assignment of properties', () => {
        expect(compile('myvar = {value=16 legato=true}')).toBeTruthy();
    });
});

describe('builtins', () => {
    describe('legato', () => {
        test('should fail', () => {
            const {voices} = compile(`[mel (legato a4 b5)]`);
            expect(typeof voices.mel[0].props.legato).toBe('string');
            expect(voices.mel[0].props.legato).toBe(voices.mel[1].props.legato);
        });
    });

    describe('repeat', () => {
        test('should handle layout items', () => {
            const {layout} = compile(`(repeat 4 (system 1))`);
            expect(layout.systems.length).toBe(4);
        });

        test('should handle voice items', () => {
            const {voices} = compile(`
                [mel (repeat 3 a4)]
            `);
            expect(voices.mel.length).toBe(3);
            expect(voices.mel[0].props.pitchClass).toBe('a');
        });
    });

    describe('in-key!', () => {
        test('should compile', () => {
            expect(compile(`(in-key! (key :C :minor))`)).toBeTruthy();
        });

        test('should apply accidentals from the given key to the notes', () => {
            const {voices} = compile(`
                (in-key! (key :C :minor))
                [scale (value=8 c d e f g a b)]
            `);
            expect(voices.scale.length).toBe(7);
            expect(voices.scale.map(note => note.props.pitchClass)).toEqual(['c', 'd', 'eb', 'f', 'g', 'ab', 'bb']);
        });

        test(
            'should not make any change if the note already has an accidental',
            () => {
                const {voices} = compile(`
                    (in-key! (key :D :major))
                    [scale fb f]
                `);
                expect(voices.scale.map(note => note.props.pitchClass)).toEqual(['fb', 'f#']);
            }
        );

        test('should be able to change keys', () => {
            const {voices} = compile(`
                (in-key! (key :D :major))
                ~ns1 = (value=8 fb f)
                (in-key! (key :C :minor))
                ~ns2 = (value=8 e c)
                [scale ~ns1 ~ns2]
            `);
            expect(voices.scale.map(note => note.props.pitchClass)).toEqual(['fb', 'f#', 'eb', 'c']);
        });

        test('should accept :none keyword to remove current key', () => {
            const {voices} = compile(`
                (in-key! (key :D :major))
                ~ns1 = (value=8 fb f)
                (in-key! :none)
                ~ns2 = (value=8 e c)
                [scale ~ns1 ~ns2]
            `);
            expect(voices.scale.map(note => note.props.pitchClass)).toEqual(['fb', 'f#', 'e', 'c']);
        });

        test(
            'should not apply the key to notes that have a natural accidental',
            () => {
                const {voices} = compile(`
                    (in-key! (key :D :major))
                    ~ns1 = (value=8 fb f fn)
                    [scale ~ns1]
                `);
                expect(voices.scale.map(note => note.props.pitchClass)).toEqual(['fb', 'f#', 'f']);
            }
        );

        test('should add key to layout if in voice', () => {
            const {voices, layout} = compile(`
                (line :mel)
                ~ns1 = (value=8 (in-key! (key :D :major)) fb f (in-key! (key :F# :minor)))
                [mel ~ns1]
            `);
            expect(voices.mel.map(note => note.props.pitchClass)).toEqual(['fb', 'f#']);

            expect(layout.lines[0].keys[0].root).toBe('D');
            expect(layout.lines[0].keys[0].mode).toBe('major');
            expect(layout.lines[0].keys[1].root).toBe('F#');
            expect(layout.lines[0].keys[1].mode).toBe('minor');
        });
    });
});
