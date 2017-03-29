import "../styles/index.css";
import {start} from "./loader";

const examples = {
    testDoubleStaffScore: function (scored) {
        var n = scored.note;
        var r = scored.rest;
        // create lines
        var trebleLine = scored.line({voices: ["treble"]}, [
            scored.clef({value: "treble", measure: 0}), scored.key({value: "c", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
        ]);
        var bassLine = scored.line({voices: ["bass"]}, [
            scored.clef({value: "bass", measure: 0}), scored.key({value: "c", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
        ]);

        // create voices
        var soprano = scored.voice({name: "treble"}, [
            n({value:1, pitch: "c4"}), r({value:2, pitch: "d#4"}), n({value:2, pitch: "d#4"}), n({value:1, pitch: "e4"}), n({value:1, pitch: "f4"}),
    		n({value:1, pitch: "g4"}), n({value:1, pitch: "a4"}), n({value:1, pitch: "b4"}), n({value:1, pitch: "c5"}),
    		n({value:1, pitch: "d5"}), n({value:1, pitch: "e5"}), n({value:1, pitch: "f5"}), n({value:1, pitch: "g5"})
        ]);
        var bass = scored.voice({name: "bass"}, [
            n({value:1, pitch: "c4"}), n({value:1, pitch: "b3"}), n({value:1, pitch: "a3"}), n({value:1, pitch: "g3"}),
    		n({value:1, pitch: "f3"}), r({value:1, pitch: "e3"}), n({value:1, pitch: "d3"}), n({value:1, pitch: "c3"}),
    		n({value:1, pitch: "b2"}), n({value:1, pitch: "a2"}), n({value:1, pitch: "g2"}), n({value:1, pitch: "f2"})
        ]);

        var fourfour = scored.timeSig({value: "4/4", measure: 0});

        // create staves
        var system1 = scored.system({measures: 6, lineHeights: [0, 200]});
        var system2 = scored.system({measures: 6});

        var page0 = scored.page();

        var score = scored.score({length: 1000, systemHeights: [0, 350]}, [fourfour, system1, system2, trebleLine, bassLine, page0]);

        // render it all as a score.
        return scored.render(score, {voices: [soprano, bass]});
    },

    testVoicePastEndOfScore: function (scored) {
        var timeSig = scored.timeSig({value: "4/4", measure: 0});

        var line = scored.line({voices: ["v"]}, [
            scored.clef({value: "treble", measure: 0}),
            scored.key({value: "C", measure: 0}),
            scored.key({value: "d", measure: 1}),
            scored.timeSig({value: "4/4", measure: 0})
        ]);

        var system = scored.system({measures: 2, startMeasure: 0});

        var voice = scored.voice({name: "v"}, [
            scored.note({pitch: "a4", value: 1}),
            scored.note({pitch: "a4", value: 1}),
            scored.note({pitch: "a4", value: 4})
        ]);

        var page0 = scored.page();

        var score = scored.score({}, [timeSig, system, line, page0]);

        return scored.render(score, {voices: [voice]});
    },

    testNoStemsOnSecondStave: function (scored) {
        var timeSig = scored.timeSig({value: "4/4", measure: 0});

        var line = scored.line({voices: ["v"]}, [
            scored.clef({value: "treble", measure: 0}),
            scored.key({value: "C", measure: 0}),
            scored.timeSig({value: "4/4", measure: 0})
        ]);

        var system1 = scored.system({measures: 1, startMeasure: 0});
        var system2 = scored.system({measures: 1, startmeasure: 1});

        var page0 = scored.page();

        var score = scored.score({}, [timeSig, line, system1, system2, page0]);

        var n = scored.note;
        var voice = scored.voice({name: "v"}, [
            n(), n(), n(), n(),
            n(), n(), n(), n(),
            n()
        ]);

        return scored.render(score, {voices: [voice]});
    },

    testPages: function (scored) {
        var n = scored.note;
        var r = scored.rest;
        // create lines
        var trebleLine = scored.line({voices: ["treble"]}, [
            scored.clef({value: "treble", measure: 0}), scored.key({value: "c", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
        ]);
        var bassLine = scored.line({voices: ["bass"]}, [
            scored.clef({value: "bass", measure: 0}), scored.key({value: "c", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
        ]);

        // create voices
        var soprano = scored.voice({name: "treble"}, [
            n({value:1, pitch: "c4"}), r({value:2, pitch: "d#4"}), n({value:2, pitch: "d#4"}), n({value:1, pitch: "e4"}), n({value:1, pitch: "f4"}),
    		n({value:1, pitch: "g4"}), n({value:1, pitch: "a4"}), n({value:1, pitch: "b4"}), n({value:1, pitch: "c5"}),
    		n({value:1, pitch: "d5"}), n({value:1, pitch: "e5"}), n({value:1, pitch: "f5"}), n({value:1, pitch: "g5"}),
            r({value:1}), r({value:1}), r({value:1}), r({value:1})
        ]);
        var bass = scored.voice({name: "bass"}, [
            n({value:1, pitch: "c4"}), n({value:1, pitch: "b3"}), n({value:1, pitch: "a3"}), n({value:1, pitch: "g3"}),
    		n({value:1, pitch: "f3"}), r({value:1, pitch: "e3"}), n({value:1, pitch: "d3"}), n({value:1, pitch: "c3"}),
    		n({value:1, pitch: "b2"}), n({value:1, pitch: "a2"}), n({value:1, pitch: "g2"}), n({value:1, pitch: "f2"}),
            r({value:1}), r({value:1}), r({value:1}), r({value:1})
        ]);

        var fourfour = scored.timeSig({value: "4/4", measure: 0});

        // create staves
        var system1 = scored.system({measures: 4, lineHeights: [0, 200], page: 0});
        var system2 = scored.system({measures: 4, page: 0});
        var system3 = scored.system({measures: 4, page: 1});
        var system4 = scored.system({measures: 4, page: 2});

        var page0 = scored.page();
        var page1 = scored.page();
        var page2 = scored.page();

        var score = scored.score({
            title: "Test Pages",
            length: 1000,
            systemHeights: [0, 350, 0, 0]
        }, [fourfour, system1, system2, system3, system4, trebleLine, bassLine, page0, page1, page2]);

        // render it all as a score.
        return scored.render(score, {voices: [soprano, bass], pages: [1]});
    },

    testChords: function (scored) {
        var n = scored.note;
        var r = scored.rest;
        var c = scored.chord;

        // create lines
        var trebleLine = scored.line({voices: ["treble"]}, [
            scored.clef({value: "treble", measure: 0}), scored.key({value: "c", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
        ]);
        var bassLine = scored.line({voices: ["bass"]}, [
            scored.clef({value: "bass", measure: 0}), scored.key({value: "c", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
        ]);

        // create voices
        var soprano = scored.voice({name: "treble"}, [
            c({value: 2}, [{value: 4, pitch: "c4"}, "eb4", "g4", "c5"]), n({value: 4, dots: 1}), n({value:8, pitch: "d#4"}),
            n({value:2, pitch: "d#4"}), n({value:2, pitch: "e4"}), n({value:1, pitch: "f4"}),
    		n({value:1, pitch: "g4"}), n({value:1, pitch: "a4"}), n({value:1, pitch: "b4"}), n({value:1, pitch: "c5"}),
    		n({value:1, pitch: "d5"}), n({value:1, pitch: "e5"}), n({value:1, pitch: "f5"}), n({value:1, pitch: "g5"})
        ]);
        var bass = scored.voice({name: "bass"}, [
            n({value:8, pitch: "c4"}), r({value: 8}), n({value: 4, pitch: "ab4"}), n({value: 2}), n({value:1, pitch: "b3"}), n({value:1, pitch: "a3"}), n({value:1, pitch: "g3"}),
    		n({value:1, pitch: "f3"}), r({value:1, pitch: "e3"}), n({value:1, pitch: "d3"}), n({value:1, pitch: "c3"}),
    		n({value:1, pitch: "b2"}), n({value:1, pitch: "a2"}), n({value:1, pitch: "g2"}), n({value:1, pitch: "f2"})
        ]);

        var fourfour = scored.timeSig({value: "4/4", measure: 0});

        // create staves
        var system1 = scored.system({measures: 6, lineHeights: [0, 200]});
        var system2 = scored.system({measures: 6});

        var page0 = scored.page();

        var score = scored.score({length: 1000, systemHeights: [0, 350]}, [fourfour, system1, system2, trebleLine, bassLine, page0]);

        // render it all as a score.
        return scored.render(score, {voices: [soprano, bass]});
    },

    testSlurs: function (scored) {
        var n = scored.note;
        var r = scored.rest;
        var c = scored.chord;

        // create lines
        var trebleLine = scored.line({voices: ["treble"]}, [
            scored.clef({value: "treble", measure: 0}), scored.key({value: "c", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
        ]);
        var bassLine = scored.line({voices: ["bass"]}, [
            scored.clef({value: "bass", measure: 0}), scored.key({value: "c", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
        ]);

        // create voices
        var soprano = scored.voice({name: "treble"}, [
            // slur across systems
            n({value: 2, pitch: 'a4'}), n({value: 2, pitch: 'a4', slur: 1}), n({value: 1, pitch: 'ab4', slur: 1}), n({value: 1, pitch: 'c5', slur: 2}),
            n({value: 2, pitch: 'a4', slur: 2}), n({value: 2, pitch: 'a4', slur: 1}), n({value: 1, pitch: 'ab4', slur: 1}), n({value: 1, pitch: 'c5', slur: 2}),
            n({value: 2, pitch: 'a4', slur: 2}), n({value: 2, pitch: 'c5', slur: 1}), n({value: 1, pitch: 'ab4', slur: 1}), n({value: 1, pitch: 'c5', slur: 2}),
            n({value: 2, pitch: 'a4', slur: 2}), n({value: 2, pitch: 'c5', slur: 1}), n({value: 1, pitch: 'ab4', slur: 1}), n({value: 1, pitch: 'c5'})
        ]);
        var bass = scored.voice({name: "bass"}, [
            n({value: 1, pitch: 'e3'}), n({value: 1, pitch: 'e3'}), n({value: 1, pitch: 'e3'}),
            n({value: 1, pitch: 'e3'}), n({value: 1, pitch: 'e3'}), n({value: 1, pitch: 'e3'}),
            n({value: 1, pitch: 'e3'}), n({value: 1, pitch: 'f3'}), n({value: 1, pitch: 'g3'}),
            n({value: 1, pitch: 'e3'}), n({value: 1, pitch: 'f3'}), n({value: 1, pitch: 'g3'})
        ]);

        var fourfour = scored.timeSig({value: "4/4", measure: 0});

        // create staves
        var system1 = scored.system({measures: 3, page: 0});
        var system2 = scored.system({measures: 3, page: 0});
        var system3 = scored.system({measures: 3, page: 1});
        var system4 = scored.system({measures: 3, page: 1});

        var page0 = scored.page();
        var page1 = scored.page();

        var score = scored.score({
            systemHeights: [0, 250, 500, 750]
        }, [fourfour, system1, system2, system3, system4, trebleLine, bassLine, page0, page1]);

        // render it all as a score.
        return scored.render(score, {voices: [soprano, bass], pages: [1]});
    },

    testClefChange: function (scored) {
        var n = scored.note;
        var r = scored.rest;
        // create lines
        var trebleLine = scored.line({voices: ["treble"]}, [
            scored.clef({value: "alto", measure: 0}), scored.key({value: "c", measure: 0}), scored.timeSig({value: "4/4", measure: 0}),
            scored.clef({value: "treble", measure: 4}) , scored.clef({value: "bass", measure: 8, beat: 2})
        ]);
        var bassLine = scored.line({voices: ["bass"]}, [
            scored.clef({value: "bass", measure: 0}), scored.key({value: "c", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
        ]);

        // create voices
        var soprano = scored.voice({name: "treble"}, [
            n({value:2, pitch: "c4"}), r({value:2, pitch: "d#4"}), n({value:2, pitch: "d#4"}), n({value:2, pitch: "e4"}), n({value:2, pitch: "f4"}),
    		n({value:2, pitch: "g4"}), n({value:2, pitch: "a4"}), n({value:2, pitch: "b4"}), r({value:2, pitch: "c#5"}),
    		n({value:2, pitch: "d5"}), n({value:2, pitch: "e5"}), n({value:2, pitch: "f5"}), n({value:2, pitch: "g5"}),

            n({value:2, pitch: "c3"}), r({value:2, pitch: "d#3"}), n({value:2, pitch: "d#3"}), n({value:2, pitch: "e3"}), n({value:2, pitch: "f3"}),
    		n({value:2, pitch: "g3"}), n({value:2, pitch: "a3"}), n({value:2, pitch: "b3"}), n({value:2, pitch: "c4"}),
    		n({value:2, pitch: "d4"}), n({value:2, pitch: "e4"}), n({value:2, pitch: "f4"}), n({value:2, pitch: "g4"})
        ]);
        var bass = scored.voice({name: "bass"}, [
            n({value:1, pitch: "c4"}), n({value:1, pitch: "b3"}), n({value:1, pitch: "a3"}), n({value:1, pitch: "g3"}),
    		n({value:1, pitch: "f3"}), r({value:1, pitch: "e3"}), n({value:1, pitch: "d3"}), n({value:1, pitch: "c3"}),
    		n({value:1, pitch: "b2"}), n({value:1, pitch: "a2"}), n({value:1, pitch: "g2"}), n({value:1, pitch: "f2"})
        ]);

        var fourfour = scored.timeSig({value: "4/4", measure: 0});

        var page0 = scored.page();
        var system1 = scored.system({measures: 6, lineHeights: [0, 200]});
        var system2 = scored.system({measures: 6});

        var score = scored.score({length: 1000, systemHeights: [0, 150]}, [fourfour, page0, system1, system2, trebleLine]);

        // render it all as a score.
        return scored.render(score, {voices: [soprano, bass], pages: [0]});
    },

    testTimeSigChange: function (scored) {
        var n = scored.note;
        var r = scored.rest;
        // create lines
        var trebleLine = scored.line({voices: ["treble"]}, [
            scored.clef({value: "treble", measure: 0}), scored.key({value: "c", measure: 0}), scored.timeSig({value: "4/4", measure: 0}),
            scored.timeSig({value: "3/4", measure: 1})
        ]);
        var bassLine = scored.line({voices: ["bass"]}, [
            scored.clef({value: "bass", measure: 0}), scored.key({value: "c", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
        ]);

        // create voices
        var soprano = scored.voice({name: "treble"}, [
            n({value:2, pitch: "c4"}), r({value:2, pitch: "d#4"}), n({value:2, pitch: "d#4"}), n({value:4, pitch: "e4"}),
            n({value:2, pitch: "f4"}), n({value:4, pitch: "g4"}), n({value:2, pitch: "a4"}), n({value:4, pitch: "b4"}),
            n({value:2, pitch: "c5"}), n({value:2, pitch: "d5"}), n({value:2, pitch: "e5"}), n({value:2, pitch: "f5"}),
            n({value:2, pitch: "g5"}),

            n({value:2, pitch: "c3"}), r({value:2, pitch: "d#3"}), n({value:2, pitch: "d#3"}), n({value:2, pitch: "e3"}), n({value:2, pitch: "f3"}),
    		n({value:2, pitch: "g3"}), n({value:2, pitch: "a3"}), n({value:2, pitch: "b3"}), n({value:2, pitch: "c4"}),
    		n({value:2, pitch: "d4"}), n({value:2, pitch: "e4"}), n({value:2, pitch: "f4"}), n({value:2, pitch: "g4"})
        ]);

        var bass = scored.voice({name: "bass"}, [
            n({value:1, pitch: "c4"}), n({value:1, pitch: "b3"}), n({value:1, pitch: "a3"}), n({value:1, pitch: "g3"}),
    		n({value:1, pitch: "f3"}), r({value:1, pitch: "e3"}), n({value:1, pitch: "d3"}), n({value:1, pitch: "c3"}),
    		n({value:1, pitch: "b2"}), n({value:1, pitch: "a2"}), n({value:1, pitch: "g2"}), n({value:1, pitch: "f2"})
        ]);

        var fourfour = scored.timeSig({value: "4/4", measure: 0});
        var threefour = scored.timeSig({value: "3/4", measure: 1});
        var threeEight = scored.timeSig({value: "3/8", measure: 2});
        var page0 = scored.page();
        var system1 = scored.system({measures: 6, lineHeights: [0, 200]});
        var system2 = scored.system({measures: 6});

        var score = scored.score({length: 1000, systemHeights: [0, 150]}, [fourfour, threefour, page0, system1, system2, trebleLine]);

        // render it all as a score.
        return scored.render(score, {voices: [soprano, bass], pages: [0]});
    },

    testChordSymbols: function (scored) {
        var n = scored.note;
        var r = scored.rest;
        var c = scored.chord;
        var d = scored.dynamic;
        // create lines
        var trebleLine = scored.line({voices: ["treble", "alto"]}, [
            scored.clef({value: "treble", measure: 0}), scored.key({value: "C", measure: 0}), scored.timeSig({value: "4/4", measure: 0}),
        ]);
        var bassLine = scored.line({voices: ["bass"]}, [
            scored.clef({value: "bass", measure: 0}), scored.key({value: "C", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
        ]);

        // create voices
        var soprano = scored.voice({name: "treble"}, [
            d({value: "f"}),
            r({value: 1, pitch: "c5"}), r({value: 1, pitch: "c5"}), n({value: 1, pitch: "f4"}),
            r({value: 4}), r({value: 8}), r({value: 8}),r({value: 8, dots: 1}), r({value: 16}), r({value: 4}),
            n({value: 1, pitch: "c5"}), n({value: 1, pitch: "c5"}), n({value: 1, pitch: "f4"}), n({value: 1, pitch: "f4"}),
            n({value: 1, pitch: "c5"}), n({value: 1, pitch: "c5"}), n({value: 1, pitch: "g4"}), n({value: 1, pitch: "g4"}),
            n({value: 1, pitch: "f5"}), n({value: 1, pitch: "f5"}), n({value: 1, pitch: "c4"}), n({value: 1, pitch: "c4"})
        ]);

        var alto = scored.voice({name: "alto"}, [
            n({value: 2, pitch: "g4"}), d({value: "p"}),
            n({value: 2, pitch: "e4"}), n({value: 2, pitch: "d4"}), n({value: 2, pitch: "e4"})
        ]);

        var bass = scored.voice({name: "bass"}, [
            c({value: 2}, ["e3", "c4"]), r({value: 2, pitch: "c4"}), n({value: 1, pitch: "bb3"}),
            n({value: 2, pitch: "a3"}), r({value: 2}),
            r({value: 4}), r({value: 8}), r({value: 8}),r({value: 8, dots: 1}), r({value: 16}), r({value: 4}),
            n({value: 1, pitch: "c5"}), n({value: 1, pitch: "c5"}), n({value: 1, pitch: "f4"}), n({value: 1, pitch: "f4"}),
            n({value: 1, pitch: "c5"}), n({value: 1, pitch: "c5"}), n({value: 1, pitch: "g4"}), n({value: 1, pitch: "g4"}),
            n({value: 1, pitch: "f5"}), n({value: 1, pitch: "f5"}), n({value: 1, pitch: "c4"}), n({value: 1, pitch: "c4"})
        ]);

        var cmaj1 = scored.chordSymbol({value: "C", measure: 0});
        var fmaj1 = scored.chordSymbol({value: "Fm", measure: 2});

        var page0 = scored.page();
        var fourfour = scored.timeSig({value: "4/4", measure: 0});
        var system1 = scored.system({measures: 6});
        var system2 = scored.system({measures: 6});

        var score = scored.score({length: 1000, systemHeights: [0, 150]}, [fourfour, page0, system1, system2, trebleLine, bassLine]);

        // render it all as a score.
        return scored.render(score, {
            voices: [soprano, alto, bass],
            pages: [0],
            chordSymbols: [cmaj1, fmaj1]
        });
    },

    testRepeats: function (scored) {
        var n = scored.note;
        var r = scored.rest;
        var c = scored.chord;
        var d = scored.dynamic;

        // If a repeat is given to a line then it will just be a repeat of the previous measure.
        // It can be represented by a % in boethius-lang.
        // If a repeat is given to a system it will go back to the beginning or inverse repeat.
        // It can be represented by :| and |: in boethius-lang.

        // create lines
        var trebleLine = scored.line({voices: ["treble"]}, [
            scored.clef({value: "treble", measure: 0}), scored.key({value: "C", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
        ]);
        var bassLine = scored.line({voices: ["bass"]}, [
            scored.clef({value: "bass", measure: 0}), scored.key({value: "C", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
        ]);

        // create voices
        var soprano = scored.voice({name: "treble"}, [
            n({value: 1, pitch: "f5"}), n({value: 1, pitch: "f5"}), n({value: 1, pitch: "c4"}), n({value: 1, pitch: "c4"})
        ]);

        var bass = scored.voice({name: "bass"}, [
            n({value: 1, pitch: "f3"}), n({value: 1, pitch: "f3"}), n({value: 1, pitch: "c4"}), n({value: 1, pitch: "c4"})
        ]);

        var page0 = scored.page();
        var fourfour = scored.timeSig({value: "4/4", measure: 0});
        var system1 = scored.system({measures: 6});
        var system2 = scored.system({measures: 6});
        var repeatM4 = scored.repeat({measure: 2});

        var score = scored.score({length: 1000, systemHeights: [0, 150]}, [fourfour, page0, system1, system2, trebleLine, bassLine]);

        // render it all as a score.
        return scored.render(score, {
            voices: [soprano, bass],
            repeats: [repeatM4],
            pages: [0]
        });
    },

    testPitchClassOctave: (scored) => {
        var n = scored.note;
        var c = scored.chord;
        // create lines
        var trebleLine = scored.line({voices: ["treble"]}, [
            scored.clef({value: "treble", measure: 0}), scored.key({value: "C", measure: 0}), scored.timeSig({value: "4/4", measure: 0}),
        ]);

        // create voices
        var soprano = scored.voice({name: "treble"}, [
            n({value: 1, pitchClass: "c", octave: 5}),
            n({value: 2, pitchClass: "c", octave: 5}), n({value: 2, pitchClass: "f", octave: 5}),
            n({value: 4, pitch: "f4"}), n({value: 4, pitch: "c5"}), n({value: 4, pitch: "c5"}), n({value: 4, pitch: "g4"}),
            c({value: 1}, [{pitchClass: "g", octave: 4}, {pitchClass: "d", octave: 5}]),
            c({value: 2}, [{pitchClass: "bb", octave: 4}, {pitchClass: "f", octave: 5}]),
            c({value: 4}, [{pitchClass: "d", octave: 5}, {pitchClass: "f", octave: 5}]),
            c({value: 4}, [{pitchClass: "f", octave: 4}, {pitchClass: "eb", octave: 5}])
        ]);

        var page0 = scored.page();
        var fourfour = scored.timeSig({value: "4/4", measure: 0});
        var system1 = scored.system({measures: 6});

        var score = scored.score({length: 1000}, [fourfour, page0, system1, trebleLine]);

        // render it all as a score.
        return scored.render(score, {
            voices: [soprano],
            pages: [0]
        });
    },

    // Some rendering still is attempted on voices even if they aren't on a line. Causing errors.
    testUnusedVoices: (scored) => {
        var n = scored.note;
        var c = scored.chord;
        // create lines
        var trebleLine = scored.line({voices: ["treble"]}, [
            scored.clef({value: "treble", measure: 0}), scored.key({value: "C", measure: 0}), scored.timeSig({value: "4/4", measure: 0}),
        ]);

        var unused = scored.voice({name: "unused"}, [
            n({slur: 1}), n({slur: 1})
        ]);
        // create voices
        var soprano = scored.voice({name: "treble"}, [
            n({value: 1, pitchClass: "c", octave: 5}),
            n({value: 2, pitchClass: "c", octave: 5}), n({value: 2, pitchClass: "f", octave: 5}),
            n({value: 4, pitch: "f4"}), n({value: 4, pitch: "c5", slur: 2}), n({value: 4, pitch: "c5", slur: 2}), n({value: 4, pitch: "g4"}),
            c({value: 1}, [{pitchClass: "g", octave: 4}, {pitchClass: "d", octave: 5}]),
            c({value: 2}, [{pitchClass: "bb", octave: 4}, {pitchClass: "f", octave: 5}]),
            c({value: 4}, [{pitchClass: "d", octave: 5}, {pitchClass: "f", octave: 5}]),
            c({value: 4}, [{pitchClass: "f", octave: 4}, {pitchClass: "eb", octave: 5}])
        ]);

        var page0 = scored.page();
        var fourfour = scored.timeSig({value: "4/4", measure: 0});
        var system1 = scored.system({measures: 6});

        var score = scored.score({length: 1000}, [fourfour, page0, system1, trebleLine]);

        // render it all as a score.
        return scored.render(score, {
            voices: [unused, soprano],
            pages: [0]
        });
    },

    testBarlineNoteBreaks: (scored) => {
        var n = scored.note;
        var c = scored.chord;
        var r = scored.rest;

        // whole note => two half notes
        // whole => quarter | dotted half
        var l1 = scored.line({voices: ["v1"]}, [
            scored.clef({value: "treble", measure: 0}), scored.key({value: "C", measure: 0}), scored.timeSig({value: "4/4", measure: 0}),
        ]);
        var v1 = scored.voice({name: "v1"}, [
            r({value: 2}), n({value: 1}),
            r({value: 4}), n({value: 1})
        ]);

        // half note => two quarter notes
        // half => dotted quarter | eighth
        var l2 = scored.line({voices: ["v2"]}, [
            scored.clef({value: "treble", measure: 0}), scored.key({value: "C", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
        ]);
        var v2 = scored.voice({name: "v2"}, [
            r({value: 2}), r({value: 4}), n({value: 2}),
            r({value: 4}), r({value: 8}), n({value: 2})

        ]);

        // quarter note => two eigth notes
        // quarter => dotted eighth | sixteenth
        var l3 = scored.line({voices: ["v3"]}, [
            scored.clef({value: "treble", measure: 0}), scored.key({value: "C", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
        ]);
        var v3 = scored.voice({name: "v3"}, [
            r({value: 2}), r({value: 4}), r({value: 8}), n({value: 4}),
            r({value: 8}), r({value: 4}), r({value: 4}), r({value: 16}), n({value: 4})
        ]);

        // eighth note => two sixteenth notes
        // eighth => 32nd | dotted sixteenth
        var l4 = scored.line({voices: ["v4"]}, [
            scored.clef({value: "treble", measure: 0}), scored.key({value: "C", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
        ]);
        var v4 = scored.voice({name: "v4"}, [
            r({value: 2}), r({value: 4}), r({value: 8}), r({value: 16}), n({value: 8}),
            r({value: 8, dots: 1}), r({value: 4}), r({value: 4}), r({value: 8}), r({value: 16, dots: 1}), n({value: 8})
        ]);

        // 1/4. => 1/4 1/8
        // 1/2 => 1/8 1/4.
        var l5 = scored.line({voices: ["v5"]}, [
            scored.clef({value: "treble", measure: 0}), scored.key({value: "C", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
        ]);
        var v5 = scored.voice({name: "v5"}, [
            r({value: 2}), r({value: 4}), n({value: 4, dots: 1}), r({value: 8}),
            r({value: 4}), r({value: 4}), r({value: 8}), n({value: 2})
        ]);

        var page0 = scored.page();
        var fourfour = scored.timeSig({value: "4/4", measure: 0});
        var system1 = scored.system({measures: 4});

        var score = scored.score({length: 1000}, [fourfour, page0, system1, l1, l2, l3, l4, l5]);
        // var score = scored.score({}, [fourfour, page0, system1, l1, l2, l3, l4]);

        // render it all as a score.
        return scored.render(score, {
            voices: [v1, v2, v3, v4, v5],
            pages: [0]
        });
    },

    testBarlineRestBreaks: (scored) => {
        var n = scored.note;
        var c = scored.chord;
        var r = scored.rest;

        // whole note => two half notes
        // whole => quarter | dotted half
        var l1 = scored.line({voices: ["v1"]}, [
            scored.clef({value: "treble", measure: 0}), scored.key({value: "C", measure: 0}), scored.timeSig({value: "4/4", measure: 0}),
        ]);
        var v1 = scored.voice({name: "v1"}, [
            n({value: 2}), r({value: 1}),
            n({value: 4}), r({value: 1})
        ]);

        // half note => two quarter notes
        // half => dotted quarter | eighth
        var l2 = scored.line({voices: ["v2"]}, [
            scored.clef({value: "treble", measure: 0}), scored.key({value: "C", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
        ]);
        var v2 = scored.voice({name: "v2"}, [
            n({value: 2}), n({value: 4}), r({value: 2}),
            n({value: 4}), n({value: 8}), r({value: 2})
        ]);

        // quarter note => two eigth notes
        // quarter => dotted eighth | sixteenth
        var l3 = scored.line({voices: ["v3"]}, [
            scored.clef({value: "treble", measure: 0}), scored.key({value: "C", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
        ]);
        var v3 = scored.voice({name: "v3"}, [
            n({value: 2}), n({value: 4}), n({value: 8}), r({value: 4}),
            n({value: 8}), n({value: 4}), n({value: 4}), n({value: 16}), r({value: 4})
        ]);

        // eighth note => two sixteenth notes
        // eighth => 32nd | dotted sixteenth
        var l4 = scored.line({voices: ["v4"]}, [
            scored.clef({value: "treble", measure: 0}), scored.key({value: "C", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
        ]);
        var v4 = scored.voice({name: "v4"}, [
            n({value: 2}), n({value: 4}), n({value: 8}), n({value: 16}), r({value: 8}),
            n({value: 8, dots: 1}), n({value: 4}), n({value: 4}), n({value: 8}), n({value: 16, dots: 1}), r({value: 8})
        ]);

        // 1/4. => 1/4 1/8
        // 1/2 => 1/8 1/4.
        var l5 = scored.line({voices: ["v5"]}, [
            scored.clef({value: "treble", measure: 0}), scored.key({value: "C", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
        ]);
        var v5 = scored.voice({name: "v5"}, [
            n({value: 2}), n({value: 4}), r({value: 4, dots: 1}), n({value: 8}),
            n({value: 4}), n({value: 4}), n({value: 8}), r({value: 2})
        ]);

        var page0 = scored.page();
        var fourfour = scored.timeSig({value: "4/4", measure: 0});
        var system1 = scored.system({measures: 4});

        var score = scored.score({length: 1000}, [fourfour, page0, system1, l1, l2, l3, l4, l5]);
        // var score = scored.score({}, [fourfour, page0, system1, l1]);

        // render it all as a score.
        return scored.render(score, {
            voices: [v1, v2, v3, v4, v5],
            pages: [0]
        });
    },

    testBarlineChordBreaks: (scored) => {
        var c = scored.chord;
        var r = scored.rest;

        // whole note => two half notes
        // whole => quarter | dotted half
        var l1 = scored.line({voices: ["v1"]}, [
            scored.clef({value: "treble", measure: 0}), scored.key({value: "C", measure: 0}), scored.timeSig({value: "4/4", measure: 0}),
        ]);
        var v1 = scored.voice({name: "v1"}, [
            r({value: 2}), c({value: 1}, ["f4", "a4"]),
            r({value: 4}), c({value: 1}, ["f4", "a4"])
        ]);

        // half note => two quarter notes
        // half => dotted quarter | eighth
        var l2 = scored.line({voices: ["v2"]}, [
            scored.clef({value: "treble", measure: 0}), scored.key({value: "C", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
        ]);
        var v2 = scored.voice({name: "v2"}, [
            r({value: 2}), r({value: 4}), c({value: 2}, ["f4", "a4"]),
            r({value: 4}), r({value: 8}), c({value: 2}, ["f4", "a4"])

        ]);

        // quarter note => two eigth notes
        // quarter => dotted eighth | sixteenth
        var l3 = scored.line({voices: ["v3"]}, [
            scored.clef({value: "treble", measure: 0}), scored.key({value: "C", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
        ]);
        var v3 = scored.voice({name: "v3"}, [
            r({value: 2}), r({value: 4}), r({value: 8}), c({value: 4}, ["f4", "a4"]),
            r({value: 8}), r({value: 4}), r({value: 4}), r({value: 16}), c({value: 4}, ["f4", "a4"])
        ]);

        // eighth note => two sixteenth notes
        // eighth => 32nd | dotted sixteenth
        var l4 = scored.line({voices: ["v4"]}, [
            scored.clef({value: "treble", measure: 0}), scored.key({value: "C", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
        ]);
        var v4 = scored.voice({name: "v4"}, [
            r({value: 2}), r({value: 4}), r({value: 8}), r({value: 16}), c({value: 8}, ["f4", "a4"]),
            r({value: 8, dots: 1}), r({value: 4}), r({value: 4}), r({value: 8}), r({value: 16, dots: 1}), c({value: 8}, ["f4", "a4"])
        ]);

        // 1/4. => 1/4 1/8
        // 1/2 => 1/8 1/4.
        var l5 = scored.line({voices: ["v5"]}, [
            scored.clef({value: "treble", measure: 0}), scored.key({value: "C", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
        ]);
        var v5 = scored.voice({name: "v5"}, [
            r({value: 2}), r({value: 4}), c({value: 4, dots: 1}, ["f4", "a4"]), r({value: 8}),
            r({value: 4}), r({value: 4}), r({value: 8}), c({value: 2}, ["f4", "a4"])
        ]);

        var page0 = scored.page();
        var fourfour = scored.timeSig({value: "4/4", measure: 0});
        var system1 = scored.system({measures: 4});

        var score = scored.score({length: 1000}, [fourfour, page0, system1, l1, l2, l3, l4, l5]);
        // var score = scored.score({}, [fourfour, page0, system1, l1]);

        // render it all as a score.
        return scored.render(score, {
            voices: [v1, v2, v3, v4, v5],
            pages: [0]
        });
    },

    testSystemLength (scored) {
        var n = scored.note;
        var c = scored.chord;
        var r = scored.rest;

        var l1 = scored.line({voices: ["v1"]}, [
            scored.clef({value: "treble", measure: 0}), scored.key({value: "C", measure: 0}), scored.timeSig({value: "4/4", measure: 0}),
        ]);
        var v1 = scored.voice({name: "v1"}, [
            r({value: 2}), n({value: 1}),
            r({value: 4}), n({value: 1})
        ]);

        var l2 = scored.line({voices: ["v2"]}, [
            scored.clef({value: "treble", measure: 0}), scored.key({value: "C", measure: 0}), scored.timeSig({value: "4/4", measure: 0}),
        ]);
        var v2 = scored.voice({name: "v2"}, [
            r({value: 2}), r({value: 4}), n({value: 2}),
            r({value: 4}), r({value: 8}), n({value: 2})
        ]);

        var page0 = scored.page();
        var fourfour = scored.timeSig({value: "4/4", measure: 0});
        var system1 = scored.system({measures: 4, length: 500});
        var system2 = scored.system({measures: 4, length: 750});
        var system3 = scored.system({measures: 4}); // gets length of score.

        var score = scored.score({length: 1000}, [fourfour, page0, system1, system2, system3, l1, l2]);
        // var score = scored.score({}, [fourfour, page0, system1, system2, l1, l2]);

        // render it all as a score.
        return scored.render(score, {
            voices: [v1, v2],
            pages: [0]
        });
    },

    testSystemIndentation (scored) {
        var n = scored.note;
        var r = scored.rest;
        // create lines
        var trebleLine = scored.line({voices: ["treble"]}, [
            scored.clef({value: "treble", measure: 0}), scored.key({value: "c", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
        ]);
        var bassLine = scored.line({voices: ["bass"]}, [
            scored.clef({value: "bass", measure: 0}), scored.key({value: "c", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
        ]);

        // create voices
        var soprano = scored.voice({name: "treble"}, [
            n({value:1, pitch: "c4"}), r({value:2, pitch: "d#4"}), n({value:2, pitch: "d#4"}), n({value:1, pitch: "e4"}), n({value:1, pitch: "f4"}),
    		n({value:1, pitch: "g4"}), n({value:1, pitch: "a4"}), n({value:1, pitch: "b4"}), n({value:1, pitch: "c5"}),
    		n({value:1, pitch: "d5"}), n({value:1, pitch: "e5"}), n({value:1, pitch: "f5"}), n({value:1, pitch: "g5"})
        ]);
        var bass = scored.voice({name: "bass"}, [
            n({value:1, pitch: "c4"}), n({value:1, pitch: "b3"}), n({value:1, pitch: "a3"}), n({value:1, pitch: "g3"}),
    		// n({value:1, pitch: "f3"}), r({value:1, pitch: "e3"}), n({value:1, pitch: "d3"}), n({value:1, pitch: "c3"}),
    		// n({value:1, pitch: "b2"}), n({value:1, pitch: "a2"}), n({value:1, pitch: "g2"}), n({value:1, pitch: "f2"})
        ]);

        var fourfour = scored.timeSig({value: "4/4", measure: 0});

        // create staves
        var system1 = scored.system({measures: 6, indentation: 100, length: 900});
        var system2 = scored.system({measures: 6});

        var page0 = scored.page();

        var score = scored.score({
            length: 1000, systemHeights: [0, 350], title: {value: "Test Title", fontSize: 50}
        }, [fourfour, system1, system2, trebleLine, bassLine, page0]);

        // render it all as a score.
        return scored.render(score, {voices: [soprano, bass]});
    },

    testTuplets (scored) {
        var n = scored.note;
        var r = scored.rest;
        // create lines
        var trebleLine = scored.line({voices: ["treble"]}, [
            scored.clef({value: "treble", measure: 0}), scored.key({value: "c", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
        ]);
        var bassLine = scored.line({voices: ["bass"]}, [
            scored.clef({value: "bass", measure: 0}), scored.key({value: "c", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
        ]);

        // create voices
        var soprano = scored.voice({name: "treble"}, [
            n({value: 4, tuplet: "3/2"}), n({value: 4, tuplet: "3/2"}), n({value: 4, tuplet: "3/2"}),
            n({value: 8, tuplet: "3/2"}), n({value: 8, tuplet: "3/2"}), n({value: 8, tuplet: "3/2"}),
            n({value: 16, tuplet: "3/2"}), n({value: 16, tuplet: "3/2"}), n({value: 16, tuplet: "3/2"}),
            n({value: 16, tuplet: "3/2"}), n({value: 16, tuplet: "3/2"}), n({value: 16, tuplet: "3/2"})
        ]);
        var bass = scored.voice({name: "bass"}, [
            r({value: 4, tuplet: "3/2"}), r({value: 4, tuplet: "3/2"}), r({value: 4, tuplet: "3/2"}),
            r({value: 8, tuplet: "3/2"}), r({value: 8, tuplet: "3/2"}), r({value: 8, tuplet: "3/2"}),
            r({value: 16, tuplet: "3/2"}), r({value: 16, tuplet: "3/2"}), r({value: 16, tuplet: "3/2"}),
            r({value: 16, tuplet: "3/2"}), r({value: 16, tuplet: "3/2"}), r({value: 16, tuplet: "3/2"})
        ]);

        var fourfour = scored.timeSig({value: "4/4", measure: 0});

        // create staves
        var system1 = scored.system({measures: 6, indentation: 100, length: 900});
        var system2 = scored.system({measures: 6});

        var page0 = scored.page();

        var score = scored.score({
            length: 1000, systemHeights: [0, 350], title: {value: "Test Tuplets", fontSize: 50}
        }, [fourfour, system1, system2, trebleLine, bassLine, page0]);

        // render it all as a score.
        return scored.render(score, {voices: [soprano, bass]});
    }
};

function createSelect () {
    var select = document.createElement("select");

    for (let k in examples) {
        var option = document.createElement("option");
        option.innerHTML = k;
        option.value = k;
        select.appendChild(option);
    }

    document.getElementById("exampleList").appendChild(select);

    return select;
}

export function run (scored) {
    var select = createSelect();
    var example = window.location.hash.slice(1) ? window.location.hash.slice(1) : Object.keys(examples)[0];
    var score = examples[example](scored).translate(25, 50);

    select.onchange = function (e) {
        var example = e.target.value;
        window.location.hash = example;
        if (score) score.remove();
        score = examples[example](scored).translate(25, 50);
    };
}

start(run);
