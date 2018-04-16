import {expect} from "chai";
import compile from "../src/main";

describe("boethius compilation", () => {
    describe("voices", () => {
        it("should not return notes outside of a voice", () => {
            const {voices} = compile("b4 [mel a4] c4");
            expect(voices.mel.length).to.equal(1);
        });

        it("should not return rests outside of a voice", () => {
            const {voices} = compile("b4 [mel a4 r/8] [chords r/4 <c4 e4>] r/4");
            expect(voices.mel.length).to.equal(2);
            expect(voices.chords.length).to.equal(2);
        });
    });

    describe("assignment", () => {
        it("should parse", () => {
            expect(compile("~melvar = (a4 bb4 c5)")).to.be.ok;
        });

        it("should expand declared variable in list", () => {
            expect(compile("~melvar = (a4 bb4 c5) ~melvar2 = (r/8 ~melvar)")).to.be.ok;
        });

        it("should expand variables in voices", () => {
            expect(compile("~melvar = (a4 bb4 c5) [mel ~melvar]")).to.be.ok;
        });

        it("should expand declared variable in list", () => {
            const {voices} = compile("~melvar = (a4 bb4 c5) ~melvar2 = (r/8 ~melvar) [mel ~melvar2]");
            expect(voices.mel.length).to.equal(4);
        });

        it("should return unique notes for expanded variables", () => {
            const {voices} = compile("~melvar = (a4) [mel ~melvar ~melvar a4]");
            expect(voices.mel.length).to.equal(3);
            expect(voices.mel[0]).not.to.equal(voices.mel[2]);
            expect(voices.mel[0]).not.to.equal(voices.mel[1]);
        });

        it("should return unique notes for expanded variables", () => {
            const {voices} = compile("~melvar = (a4) [mel bb4 ~melvar ~melvar a4]");
            expect(voices.mel.length).to.equal(4);
            expect(voices.mel[1]).not.to.equal(voices.mel[3]);
            expect(voices.mel[1]).not.to.equal(voices.mel[2]);
        });

        it("should return unique rests for expanded variables", () => {
            const {voices} = compile("~melvar = (r/16) [mel ~melvar ~melvar r/16]");
            expect(voices.mel.length).to.equal(3);
            expect(voices.mel[0]).not.to.equal(voices.mel[2]);
            expect(voices.mel[0]).not.to.equal(voices.mel[1]);
        });

        it("should return unique rests for expanded variables", () => {
            const {voices} = compile("~melvar = (r/8) [mel r/8 ~melvar ~melvar r/8]");
            expect(voices.mel.length).to.equal(4);
            expect(voices.mel[1]).not.to.equal(voices.mel[3]);
            expect(voices.mel[1]).not.to.equal(voices.mel[2]);
        });

        it("should return unique chords for expanded variables", () => {
            const {voices} = compile("~melvar = (<c4 e4>) [mel ~melvar ~melvar <c4 e4>]");
            expect(voices.mel.length).to.equal(3);
            expect(voices.mel[0]).not.to.equal(voices.mel[2]);
            expect(voices.mel[0]).not.to.equal(voices.mel[1]);
        });

        it("should return unique chords for expanded variables", () => {
            const {voices} = compile("~melvar = (<d5 bb5>) [mel <d5 bb5> ~melvar ~melvar <d5 bb5>]");
            expect(voices.mel.length).to.equal(4);
            expect(voices.mel[1]).not.to.equal(voices.mel[3]);
            expect(voices.mel[1]).not.to.equal(voices.mel[2]);
        });
    });

    describe("pitch class and octave", () => {
        it("should allow entry of pitch classes without octave", () => {
            const {voices} = compile(
                `~lower = (a b c d e f g)
                ~upper = (A B C D E F G)
                ~accdtls = (Ab gbb F# d##)
                [lower ~lower]
                [upper ~upper]
                [accdtls ~accdtls]`
            );
            expect(voices.lower.length).to.equal(7);
            expect(voices.upper.length).to.equal(7);
            expect(voices.accdtls.length).to.equal(4);
        });

        it("should assign octave as property", () => {
            const {voices} = compile("~mel = (a (octave=8 a)) [mel ~mel]");
            expect(voices.mel[0].props.octave).not.to.be.ok;
            expect(voices.mel[1].props.octave).to.equal(8);
        });

        xit("should translate integers as pitches", () => {
            const {voices} = compile("[mel a 4]");
            expect(voices.mel[0].props.pitchClass).to.be.ok;
        });
    });

    describe("nested scopes", () => {
        it("should flatten nested scopes", () => {
            const {voices} = compile("~mel = (a3 (foo=1 a4 (bar=2 a4))) [mel ~mel]");
            expect(voices.mel.length).to.equal(3);
            expect(voices.mel[1].props.foo).to.equal(1);
            expect(voices.mel[1].props.bar).not.to.be.ok;
            expect(voices.mel[2].props.foo).to.equal(1);
            expect(voices.mel[2].props.bar).to.equal(2);
        });
    });

    describe("time", () => {
        it("should set time as 0 on first item of voices", () => {
            const {voices} = compile("[mel a4]");
            expect(voices.mel[0].props.time).to.equal(0);
        });

        it("should default to quarter note values", () => {
            const {voices} = compile("[mel a4 g4]");
            expect(voices.mel[0].props.time).to.equal(0);
            expect(voices.mel[1].props.time).to.equal(0.25);
        });

        it("should handle duration style input", () => {
            const {voices} = compile("[mel a4/8 g4]");
            expect(voices.mel[0].props.time).to.equal(0);
            expect(voices.mel[1].props.time).to.equal(0.125);
        });

        it("should handle property style input", () => {
            const {voices} = compile("[mel (value=8 a4 g4)]");
            expect(voices.mel[0].props.time).to.equal(0);
            expect(voices.mel[1].props.time).to.equal(0.125);
        });

        it("should prioritize duration input over property input", () => {
            const {voices} = compile("[mel (value=2 a4/8 g4 f4)]");
            expect(voices.mel[0].props.time).to.equal(0);
            expect(voices.mel[1].props.time).to.equal(0.125);
            expect(voices.mel[2].props.time).to.equal(0.625);
        });

        it("should work with rests", () => {
            const {voices} = compile("[mel (value=2 r/8 r) r]");
            expect(voices.mel[0].props.time).to.equal(0);
            expect(voices.mel[1].props.time).to.equal(0.125);
            expect(voices.mel[2].props.time).to.equal(0.625);
        });

        it("should work with chords", () => {
            const {voices} = compile("[mel (value=2 <c4 e4>/8 <d4 f#4>) <g3 bb3 g4>]");
            expect(voices.mel[0].props.time).to.equal(0);
            expect(voices.mel[1].props.time).to.equal(0.125);
            expect(voices.mel[2].props.time).to.equal(0.625);
        });

        it("should work with variables", () => {
            const {voices} = compile(`
                ~theme = (a4/2 bb5/8 c6/16 c6/16 d2/4)
                [mel ~theme ~theme]
            `);
            expect(voices.mel[0].props.time).to.equal(0);
            expect(voices.mel[1].props.time).to.equal(0.5);
            expect(voices.mel[2].props.time).to.equal(0.625);
            expect(voices.mel[3].props.time).to.equal(0.6875);
            expect(voices.mel[4].props.time).to.equal(0.75);
            expect(voices.mel[5].props.time).to.equal(1);
            expect(voices.mel[6].props.time).to.equal(1.5);
            expect(voices.mel[7].props.time).to.equal(1.625);
            expect(voices.mel[8].props.time).to.equal(1.6875);
            expect(voices.mel[9].props.time).to.equal(1.75);
        });

        it("should work with multiple voices", () => {
            const {voices} = compile(`
                ~theme = (a4/2 bb5/8 c6/16 c6/16 d2/4)
                [mel1 ~theme]
                [mel2 ~theme]
            `);
            expect(voices.mel1[0].props.time).to.equal(0);
            expect(voices.mel1[1].props.time).to.equal(0.5);
            expect(voices.mel1[2].props.time).to.equal(0.625);
            expect(voices.mel1[3].props.time).to.equal(0.6875);
            expect(voices.mel1[4].props.time).to.equal(0.75);
            expect(voices.mel2[0].props.time).to.equal(0);
            expect(voices.mel2[1].props.time).to.equal(0.5);
            expect(voices.mel2[2].props.time).to.equal(0.625);
            expect(voices.mel2[3].props.time).to.equal(0.6875);
            expect(voices.mel2[4].props.time).to.equal(0.75);
        });
    });

    describe('layout', () => {
        it('should add have layout property', () => {
            const {layout} = compile(`
                (timesig 3 4)
            `);

            expect(layout).to.be.ok;
        });

        describe('timesig', () => {
            it('should create timeSignatures array', () => {
                const {layout} = compile(`
                    (timesig 3 4)
                `);

                expect(layout.timeSignatures).to.be.an('array');
                expect(layout.timeSignatures[0].value).to.eql([3, 4]);
                expect(layout.timeSignatures[0].measure).to.equal(0);
                expect(layout.timeSignatures[0].beat).to.equal(0);
            });

            it('should handle multiple time signatures', () => {
                const {layout} = compile(`
                    (timesig 3 4)
                    (timesig 7 8 3 0)
                `);

                expect(layout.timeSignatures[0].value).to.eql([3, 4]);
                expect(layout.timeSignatures[0].measure).to.equal(0);
                expect(layout.timeSignatures[0].beat).to.equal(0);
                expect(layout.timeSignatures[1].value).to.eql([7, 8]);
                expect(layout.timeSignatures[1].measure).to.eql(3);
                expect(layout.timeSignatures[1].beat).to.eql(0);
            });
        });

        describe('line', () => {
            it('should be added to the layout.lines array', () => {
                const {layout} = compile(`
                    (line :voice1)
                `);

                expect(layout.lines).to.be.an('array');
                expect(layout.lines.length).to.equal(1);
            });

            it('should add keywords to the lines voices', () => {
                const {layout} = compile(`
                    (line :voice1 :voice2)
                `);

                expect(layout.lines[0].voices.length).to.equal(2);
                expect(layout.lines[0].voices[0]).to.equal('voice1');
                expect(layout.lines[0].voices[1]).to.equal('voice2');
            });

            it('should add clefs to the line', () => {
                const {layout} = compile(`
                    (line :voice1 (clef :treble))
                `);

                expect(layout.lines[0].clefs.length).to.equal(1);
                expect(layout.lines[0].clefs[0].value).to.equal('treble');
            });

            it('should add measure and beat to the clefs', () => {
                const {layout} = compile(`
                    (line :voice1 (clef :treble) (clef :bass 4 2))
                `);

                expect(layout.lines[0].clefs.length).to.equal(2);
                expect(layout.lines[0].clefs[0].value).to.equal('treble');
                expect(layout.lines[0].clefs[1].value).to.equal('bass');
                expect(layout.lines[0].clefs[1].measure).to.equal(4);
                expect(layout.lines[0].clefs[1].beat).to.equal(2);
            });

            it('should add keys to the line', () => {
                const {layout} = compile(`
                    (line :voice1 (key :e :minor))
                `);

                expect(layout.lines[0].keys.length).to.equal(1);
                expect(layout.lines[0].keys[0].root).to.equal('e');
                expect(layout.lines[0].keys[0].mode).to.equal('minor');
            });

            it('should add measure and beat to the keys', () => {
                const {layout} = compile(`
                    (line :voice1 (key :ab :dorian) (key :c :major 5 0))
                `);

                expect(layout.lines[0].keys.length).to.equal(2);
                expect(layout.lines[0].keys[0].root).to.equal('ab');
                expect(layout.lines[0].keys[0].mode).to.equal('dorian');
                expect(layout.lines[0].keys[1].root).to.equal('c');
                expect(layout.lines[0].keys[1].mode).to.equal('major');
                expect(layout.lines[0].keys[1].measure).to.equal(5);
                expect(layout.lines[0].keys[1].beat).to.equal(0);
            });

            it('should have properties from the scope set upon it', () => {
                const {layout} = compile(`
                    (name=myline (line :voice1))
                `);

                expect(layout.lines[0].name).to.equal('myline');
            });
        });

        describe('System', () => {
            it('should be added to the layout.systems array', () => {
                const {layout} = compile(`
                    (system 4)
                `);

                expect(layout.systems.length).to.equal(1);
            });

            it('should add measures to the system', () => {
                const {layout} = compile(`
                    (system 4)
                    (system 3)
                `);

                expect(layout.systems[0].measures).to.equal(4);
                expect(layout.systems[1].measures).to.equal(3);
            });

            it('should take lineSpacing list', () => {
                const {layout} = compile(`
                    (system 4 0 200 300)
                    (system 3 20 30 40)
                    (system 5)
                `);

                expect(layout.systems[0].lineSpacing).to.eql([0, 200, 300]);
                expect(layout.systems[1].lineSpacing).to.eql([20, 30, 40]);
                expect(layout.systems[2].lineSpacing).to.eql([0]);
            });

            it('should have properties from the scope set upon it', () => {
                const {layout} = compile(`
                    (length=500 (system 3))
                `);

                expect(layout.systems[0].length).to.equal(500);
            });
        });
    });
});
