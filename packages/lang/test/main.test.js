import compile from "../src/main";

describe("boethius compilation", () => {
    describe("voices", () => {
        test("should not return notes outside of a voice", () => {
            const {voices} = compile("b4 [mel a4] c4");
            expect(voices.mel.length).toBe(1);
        });

        test("should not return rests outside of a voice", () => {
            const {voices} = compile("b4 [mel a4 r/8] [chords r/4 <c4 e4>] r/4");
            expect(voices.mel.length).toBe(2);
            expect(voices.chords.length).toBe(2);
        });
    });

    describe("assignment", () => {
        test("should parse", () => {
            expect(compile("~melvar = (a4 bb4 c5)")).toBeTruthy();
        });

        test("should expand declared variable in list", () => {
            expect(compile("~melvar = (a4 bb4 c5) ~melvar2 = (r/8 ~melvar)")).toBeTruthy();
        });

        test("should expand variables in voices", () => {
            expect(compile("~melvar = (a4 bb4 c5) [mel ~melvar]")).toBeTruthy();
        });

        test("should expand declared variable in list", () => {
            const {voices} = compile("~melvar = (a4 bb4 c5) ~melvar2 = (r/8 ~melvar) [mel ~melvar2]");
            expect(voices.mel.length).toBe(4);
        });

        test("should return unique notes for expanded variables", () => {
            const {voices} = compile("~melvar = (a4) [mel ~melvar ~melvar a4]");
            expect(voices.mel.length).toBe(3);
            expect(voices.mel[0]).not.toBe(voices.mel[2]);
            expect(voices.mel[0]).not.toBe(voices.mel[1]);
        });

        test("should return unique notes for expanded variables", () => {
            const {voices} = compile("~melvar = (a4) [mel bb4 ~melvar ~melvar a4]");
            expect(voices.mel.length).toBe(4);
            expect(voices.mel[1]).not.toBe(voices.mel[3]);
            expect(voices.mel[1]).not.toBe(voices.mel[2]);
        });

        test("should return unique rests for expanded variables", () => {
            const {voices} = compile("~melvar = (r/16) [mel ~melvar ~melvar r/16]");
            expect(voices.mel.length).toBe(3);
            expect(voices.mel[0]).not.toBe(voices.mel[2]);
            expect(voices.mel[0]).not.toBe(voices.mel[1]);
        });

        test("should return unique rests for expanded variables", () => {
            const {voices} = compile("~melvar = (r/8) [mel r/8 ~melvar ~melvar r/8]");
            expect(voices.mel.length).toBe(4);
            expect(voices.mel[1]).not.toBe(voices.mel[3]);
            expect(voices.mel[1]).not.toBe(voices.mel[2]);
        });

        test("should return unique chords for expanded variables", () => {
            const {voices} = compile("~melvar = (<c4 e4>) [mel ~melvar ~melvar <c4 e4>]");
            expect(voices.mel.length).toBe(3);
            expect(voices.mel[0]).not.toBe(voices.mel[2]);
            expect(voices.mel[0]).not.toBe(voices.mel[1]);
        });

        test("should return unique chords for expanded variables", () => {
            const {voices} = compile("~melvar = (<d5 bb5>) [mel <d5 bb5> ~melvar ~melvar <d5 bb5>]");
            expect(voices.mel.length).toBe(4);
            expect(voices.mel[1]).not.toBe(voices.mel[3]);
            expect(voices.mel[1]).not.toBe(voices.mel[2]);
        });

        test('should allow dashes in variable names', () => {
            expect(compile("~mel-var = (a4 bb4 c5) ~mel-var2 = (r/8 ~mel-var)")).toBeTruthy();
        });
    });

    describe("pitch class and octave", () => {
        test("should allow entry of pitch classes without octave", () => {
            const {voices} = compile(
                `~lower = (a b c d e f g)
                ~upper = (A B C D E F G)
                ~accdtls = (Ab gbb F# d##)
                [lower ~lower]
                [upper ~upper]
                [accdtls ~accdtls]`
            );
            expect(voices.lower.length).toBe(7);
            expect(voices.upper.length).toBe(7);
            expect(voices.accdtls.length).toBe(4);
        });

        test("should assign octave as property", () => {
            const {voices} = compile("~mel = (a (octave=8 a)) [mel ~mel]");
            expect(voices.mel[0].props.octave).not.toBeTruthy();
            expect(voices.mel[1].props.octave).toBe(8);
        });

        xit("should translate integers as pitches", () => {
            const {voices} = compile("[mel a 4]");
            expect(voices.mel[0].props.pitchClass).toBeTruthy();
        });
    });

    describe("nested scopes", () => {
        test("should flatten nested scopes", () => {
            const {voices} = compile("~mel = (a3 (foo=1 a4 (bar=2 a4))) [mel ~mel]");
            expect(voices.mel.length).toBe(3);
            expect(voices.mel[1].props.foo).toBe(1);
            expect(voices.mel[1].props.bar).not.toBeTruthy();
            expect(voices.mel[2].props.foo).toBe(1);
            expect(voices.mel[2].props.bar).toBe(2);
        });
    });

    describe("time", () => {
        test("should set time as 0 on first item of voices", () => {
            const {voices} = compile("[mel a4]");
            expect(voices.mel[0].props.time).toBe(0);
        });

        test("should default to quarter note values", () => {
            const {voices} = compile("[mel a4 g4]");
            expect(voices.mel[0].props.time).toBe(0);
            expect(voices.mel[1].props.time).toBe(0.25);
        });

        test("should handle duration style input", () => {
            const {voices} = compile("[mel a4/8 g4]");
            expect(voices.mel[0].props.time).toBe(0);
            expect(voices.mel[1].props.time).toBe(0.125);
        });

        test("should handle property style input", () => {
            const {voices} = compile("[mel (value=8 a4 g4)]");
            expect(voices.mel[0].props.time).toBe(0);
            expect(voices.mel[1].props.time).toBe(0.125);
        });

        test("should prioritize duration input over property input", () => {
            const {voices} = compile("[mel (value=2 a4/8 g4 f4)]");
            expect(voices.mel[0].props.time).toBe(0);
            expect(voices.mel[1].props.time).toBe(0.125);
            expect(voices.mel[2].props.time).toBe(0.625);
        });

        test("should work with rests", () => {
            const {voices} = compile("[mel (value=2 r/8 r) r]");
            expect(voices.mel[0].props.time).toBe(0);
            expect(voices.mel[1].props.time).toBe(0.125);
            expect(voices.mel[2].props.time).toBe(0.625);
        });

        test("should work with chords", () => {
            const {voices} = compile("[mel (value=2 <c4 e4>/8 <d4 f#4>) <g3 bb3 g4>]");
            expect(voices.mel[0].props.time).toBe(0);
            expect(voices.mel[1].props.time).toBe(0.125);
            expect(voices.mel[2].props.time).toBe(0.625);
        });

        test("should work with variables", () => {
            const {voices} = compile(`
                ~theme = (a4/2 bb5/8 c6/16 c6/16 d2/4)
                [mel ~theme ~theme]
            `);
            expect(voices.mel[0].props.time).toBe(0);
            expect(voices.mel[1].props.time).toBe(0.5);
            expect(voices.mel[2].props.time).toBe(0.625);
            expect(voices.mel[3].props.time).toBe(0.6875);
            expect(voices.mel[4].props.time).toBe(0.75);
            expect(voices.mel[5].props.time).toBe(1);
            expect(voices.mel[6].props.time).toBe(1.5);
            expect(voices.mel[7].props.time).toBe(1.625);
            expect(voices.mel[8].props.time).toBe(1.6875);
            expect(voices.mel[9].props.time).toBe(1.75);
        });

        test("should work with multiple voices", () => {
            const {voices} = compile(`
                ~theme = (a4/2 bb5/8 c6/16 c6/16 d2/4)
                [mel1 ~theme]
                [mel2 ~theme]
            `);
            expect(voices.mel1[0].props.time).toBe(0);
            expect(voices.mel1[1].props.time).toBe(0.5);
            expect(voices.mel1[2].props.time).toBe(0.625);
            expect(voices.mel1[3].props.time).toBe(0.6875);
            expect(voices.mel1[4].props.time).toBe(0.75);
            expect(voices.mel2[0].props.time).toBe(0);
            expect(voices.mel2[1].props.time).toBe(0.5);
            expect(voices.mel2[2].props.time).toBe(0.625);
            expect(voices.mel2[3].props.time).toBe(0.6875);
            expect(voices.mel2[4].props.time).toBe(0.75);
        });

        test('should work when voice is split', () => {
            const {voices} = compile(`
                [mel a4/2 bb5/8 c6/16 c6/16 d2/4]
                [mel a4/2 bb5/8 c6/16 c6/16 d2/4]
            `);

            expect(voices.mel[0].props.time).toBe(0);
            expect(voices.mel[1].props.time).toBe(0.5);
            expect(voices.mel[2].props.time).toBe(0.625);
            expect(voices.mel[3].props.time).toBe(0.6875);
            expect(voices.mel[4].props.time).toBe(0.75);
            expect(voices.mel[5].props.time).toBe(1);
            expect(voices.mel[6].props.time).toBe(1.5);
            expect(voices.mel[7].props.time).toBe(1.625);
            expect(voices.mel[8].props.time).toBe(1.6875);
            expect(voices.mel[9].props.time).toBe(1.75);
        });
    });

    describe('layout', () => {
        test('should add have layout property', () => {
            const {layout} = compile(`
                (timesig 3 4)
            `);

            expect(layout).toBeTruthy();
        });

        describe('timesig', () => {
            test('should create timeSignatures array', () => {
                const {layout} = compile(`
                    (timesig 3 4)
                `);

                expect(Array.isArray(layout.timeSignatures)).toBe(true);
                expect(layout.timeSignatures[0].value).toEqual([3, 4]);
                expect(layout.timeSignatures[0].measure).toBe(0);
                expect(layout.timeSignatures[0].beat).toBe(0);
            });

            test('should handle multiple time signatures', () => {
                const {layout} = compile(`
                    (timesig 3 4)
                    (timesig 7 8 3 0)
                `);

                expect(layout.timeSignatures[0].value).toEqual([3, 4]);
                expect(layout.timeSignatures[0].measure).toBe(0);
                expect(layout.timeSignatures[0].beat).toBe(0);
                expect(layout.timeSignatures[1].value).toEqual([7, 8]);
                expect(layout.timeSignatures[1].measure).toEqual(3);
                expect(layout.timeSignatures[1].beat).toEqual(0);
            });
        });

        describe('line', () => {
            test('should be added to the layout.lines array', () => {
                const {layout} = compile(`
                    (line :voice1)
                `);

                expect(Array.isArray(layout.lines)).toBe(true);
                expect(layout.lines.length).toBe(1);
            });

            test('should add keywords to the lines voices', () => {
                const {layout} = compile(`
                    (line :voice1 :voice2)
                `);

                expect(layout.lines[0].voices.length).toBe(2);
                expect(layout.lines[0].voices[0]).toBe('voice1');
                expect(layout.lines[0].voices[1]).toBe('voice2');
            });

            test('should add clefs to the line', () => {
                const {layout} = compile(`
                    (line :voice1 (clef :treble))
                `);

                expect(layout.lines[0].clefs.length).toBe(1);
                expect(layout.lines[0].clefs[0].value).toBe('treble');
            });

            test('should add measure and beat to the clefs', () => {
                const {layout} = compile(`
                    (line :voice1 (clef :treble) (clef :bass 4 2))
                `);

                expect(layout.lines[0].clefs.length).toBe(2);
                expect(layout.lines[0].clefs[0].value).toBe('treble');
                expect(layout.lines[0].clefs[1].value).toBe('bass');
                expect(layout.lines[0].clefs[1].measure).toBe(4);
                expect(layout.lines[0].clefs[1].beat).toBe(2);
            });

            test('should add keys to the line', () => {
                const {layout} = compile(`
                    (line :voice1 (key :e :minor))
                `);

                expect(layout.lines[0].keys.length).toBe(1);
                expect(layout.lines[0].keys[0].root).toBe('e');
                expect(layout.lines[0].keys[0].mode).toBe('minor');
            });

            test('should add measure and beat to the keys', () => {
                const {layout} = compile(`
                    (line :voice1 (key :ab :dorian) (key :c :major 5 0))
                `);

                expect(layout.lines[0].keys.length).toBe(2);
                expect(layout.lines[0].keys[0].root).toBe('ab');
                expect(layout.lines[0].keys[0].mode).toBe('dorian');
                expect(layout.lines[0].keys[1].root).toBe('c');
                expect(layout.lines[0].keys[1].mode).toBe('major');
                expect(layout.lines[0].keys[1].measure).toBe(5);
                expect(layout.lines[0].keys[1].beat).toBe(0);
            });

            test('should have properties from the scope set upon it', () => {
                const {layout} = compile(`
                    (name=myline (line :voice1))
                `);
                expect(layout.lines[0].name).toBe('myline');
            });
        });

        describe('System', () => {
            test('should be added to the layout.systems array', () => {
                const {layout} = compile(`
                    (system 4)
                `);

                expect(layout.systems.length).toBe(1);
            });

            test('should add measures to the system', () => {
                const {layout} = compile(`
                    (system 4)
                    (system 3)
                `);

                expect(layout.systems[0].duration.measure).toBe(4);
                expect(layout.systems[1].duration.measure).toBe(3);
            });

            test('should take lineSpacing list', () => {
                const {layout} = compile(`
                    (system 4 0 200 300)
                    (system 3 20 30 40)
                    (system 5)
                `);

                expect(layout.systems[0].lineSpacing).toEqual([0, 200, 300]);
                expect(layout.systems[1].lineSpacing).toEqual([20, 30, 40]);
                expect(layout.systems[2].lineSpacing).toEqual([0]);
            });

            test('should have properties from the scope set upon it', () => {
                const {layout} = compile(`
                    (length=500 (system 3))
                `);

                expect(layout.systems[0].length).toBe(500);
            });
        });

        describe('pages', () => {
            test('should default to one page', () => {
                const {layout} = compile(`
                    [mel a4]
                `);
                expect(Array.isArray(layout.pages)).toBe(true);
                expect(layout.pages.length).toBe(1);
            });

            test('default page should contain all the systems', () => {
                const {layout} = compile(`
                    (system 3)
                    (system 3)
                `);

                expect(layout.pages[0].systems).toBe(2);
            });

            test('should create pages', () => {
                const {layout} = compile(`
                    (page 4)
                    (page 5)
                `);

                expect(layout.pages.length).toBe(2);
                expect(layout.pages[0].systems).toBe(4);
                expect(layout.pages[1].systems).toBe(5);
            });

            test('should have properties from the scope set upon it', () => {
                const {layout} = compile(`
                    (name=page1 (page 6))
                `);

                expect(layout.pages[0].name).toBe('page1');
            });
        });
    });

    describe('layout', () => {
        test('should only take an even number of arguments', () => {
            expect(() => compile(`(layout :onearg)`)).toThrowError(Error);
            expect(() => compile(`(layout :onearg :twoarg)`)).not.toThrowError(Error);
        });

        test('should set string arguments on the layout', () => {
            const {layout} = compile(`(layout "title" "awesome composition")`);
            expect(layout.title).toBe("awesome composition");
        });

        test('should set keyword arguments on the layout', () => {
            const {layout} = compile(`(layout :title "awesome composition")`);
            expect(layout.title).toBe("awesome composition");
        });

        test('should handle multiple items to set', () => {
            const {layout} = compile(`
                (layout :title "awesome composition" "composer" "Sean")
            `);
            expect(layout.title).toBe("awesome composition");
            expect(layout.composer).toBe('Sean');
        });
    });

    describe('easyOctave', () => {
        test('should default the first note to 4 if not given', () => {
            const {voices} = compile(`[mel c]`, {easyOctave: true});
            expect(voices.mel[0].props.octave).toBe(4);
        });

        test('should have no effect if note already has an octave', () => {
            const {voices} = compile(`[mel c6 (octave = 7 a)]`, {easyOctave: true});
            expect(voices.mel[0].props.octave).toBe(6);
            expect(voices.mel[1].props.octave).toBe(7);
        });

        test(
            'should increase the octave when the higher octave is the closest pitch',
            () => {
                const {voices} = compile(`
                    [v1 b5 c]
                    [v2 a4 c]
                    [v3 g2 c]
                `, {easyOctave: true});
                expect(voices.v1[1].props.octave).toBe(6);
                expect(voices.v2[1].props.octave).toBe(5);
                expect(voices.v3[1].props.octave).toBe(3);
            }
        );

        test(
            'should decrease the octave when the lower octave is the closest pitch',
            () => {
                const {voices} = compile(`
                    [v1 c5 b]
                    [v2 d4 b]
                    [v3 e2 b]
                `, {easyOctave: true});
                expect(voices.v1[1].props.octave).toBe(4);
                expect(voices.v2[1].props.octave).toBe(3);
                expect(voices.v3[1].props.octave).toBe(1);
            }
        );

        test('should keep the same octave in the case of tritones', () => {
            const {voices} = compile(`
                [v1 c5 f#]
                [v2 d4 ab]
                [v3 e2 a#]
            `, {easyOctave: true});
            expect(voices.v1[1].props.octave).toBe(5);
            expect(voices.v2[1].props.octave).toBe(4);
            expect(voices.v3[1].props.octave).toBe(2);
        });

        test('should apply to chords', () => {
            const {voices} = compile(`[chords <a c e>]`, {easyOctave: true});
            expect(voices.chords[0].children[0].props.octave).toBe(4);
            expect(voices.chords[0].children[1].props.octave).toBe(5);
            expect(voices.chords[0].children[2].props.octave).toBe(5);
        });
    });

    describe('Voice markings', () => {
        test('should add clefs in the voice to the layout', () => {
            const compiled = compile(`
                (line :mel)
                [mel (clef :bass) a3 (clef :alto)]
            `);
            expect(compiled.layout.lines[0].clefs[0].value).toBe('bass');
            expect(compiled.layout.lines[0].clefs[1].value).toBe('alto');
        });

        test('should set time on the clefs', () => {
            const compiled = compile(`
                (line :mel)
                [mel (clef :bass) a3 (clef :alto)]
            `);
            expect(compiled.layout.lines[0].clefs[0].time).toBe(0);
            expect(compiled.layout.lines[0].clefs[1].time).toBe(0.25);
        });

        test('should set clef on the line the voice belongs to', () => {
            const compiled = compile(`
                (name=line1 (line :mel1))
                (name=line2 (line :mel2))
                [mel1 (clef :bass) a3]
                [mel2 (clef :tenor) c#4]
            `);
            const line1 = compiled.layout.lines.find(line => line.name === 'line1')
            const line2 = compiled.layout.lines.find(line => line.name === 'line2')
            expect(line1.clefs.length).toBe(1);
            expect(line2.clefs.length).toBe(1);
            expect(line1.clefs[0].value).toBe('bass');
            expect(line2.clefs[0].value).toBe('tenor');
        });

        test('should work for clefs inside scope nodes', () => {
            const compiled = compile(`
                (line :mel (clef :treble))
                [mel (staccato f5/4 (clef :bass) a3)]
            `);
            expect(compiled.layout.lines[0].clefs[0].value).toBe('treble');
            expect(compiled.layout.lines[0].clefs[1].value).toBe('bass');
        });
    });
});
