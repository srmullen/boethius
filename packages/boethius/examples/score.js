var examples = {
    testDoubleStaffScore: function () {
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

    testVoicePastEndOfScore: function () {
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

    testNoStemsOnSecondStave: function () {
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

    testPages: function () {
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
            length: 1000,
            systemHeights: [0, 350, 0, 0]
        }, [fourfour, system1, system2, system3, system4, trebleLine, bassLine, page0, page1, page2]);

        // render it all as a score.
        return scored.render(score, {voices: [soprano, bass], pages: [1]});
    },

    testChords: function () {
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
            c({value: 2}, [{value: 4, pitch: "c4"}, "eb4", "g4", "c5"]), n({value: 4, dots: 1}), n({value:2, pitch: "d#4"}), n({value:2, pitch: "d#4"}), n({value:1, pitch: "e4"}), n({value:1, pitch: "f4"}),
    		n({value:1, pitch: "g4"}), n({value:1, pitch: "a4"}), n({value:1, pitch: "b4"}), n({value:1, pitch: "c5"}),
    		n({value:1, pitch: "d5"}), n({value:1, pitch: "e5"}), n({value:1, pitch: "f5"}), n({value:1, pitch: "g5"})
        ]);
        var bass = scored.voice({name: "bass"}, [
            n({value:8, pitch: "c4"}), r({value: 8}), n({value: 4}), n({value: 2}), n({value:1, pitch: "b3"}), n({value:1, pitch: "a3"}), n({value:1, pitch: "g3"}),
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

    testSlurs: function () {
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

    testClefChange: function () {
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
    		n({value:2, pitch: "g4"}), n({value:2, pitch: "a4"}), n({value:2, pitch: "b4"}), n({value:2, pitch: "c5"}),
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

    testTimeSigChange: function () {
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

    testChordSymbols: function () {
        var n = scored.note;
        var c = scored.chord;
        // create lines
        var trebleLine = scored.line({voices: ["treble", "alto"]}, [
            scored.clef({value: "treble", measure: 0}), scored.key({value: "C", measure: 0}), scored.timeSig({value: "4/4", measure: 0}),
        ]);
        var bassLine = scored.line({voices: ["bass"]}, [
            scored.clef({value: "bass", measure: 0}), scored.key({value: "C", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
        ]);

        // create voices
        var soprano = scored.voice({name: "treble"}, [
            n({value: 1, pitch: "c5"}), n({value: 1, pitch: "c5"}), n({value: 1, pitch: "f4"}), n({value: 1, pitch: "f4"}),
            n({value: 1, pitch: "c5"}), n({value: 1, pitch: "c5"}), n({value: 1, pitch: "f4"}), n({value: 1, pitch: "f4"}),
            n({value: 1, pitch: "c5"}), n({value: 1, pitch: "c5"}), n({value: 1, pitch: "g4"}), n({value: 1, pitch: "g4"}),
            n({value: 1, pitch: "f5"}), n({value: 1, pitch: "f5"}), n({value: 1, pitch: "c4"}), n({value: 1, pitch: "c4"})
        ]);

        var alto = scored.voice({name: "alto"}, [
            n({value: 2, pitch: "g4"}), n({value: 2, pitch: "e4"}), n({value: 2, pitch: "d4"}), n({value: 2, pitch: "e4"})
        ]);

        var bass = scored.voice({name: "bass"}, [
            c({value: 2}, ["e3", "c4"]), n({value: 2, pitch: "c4"}), n({value: 1, pitch: "bb3"}), n({value: 1, pitch: "a3"}), n({value: 1, pitch: "f3"}),
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
    }
};

function createSelect () {
    var select = document.createElement("select");

    for (k in examples) {
        var option = document.createElement("option");
        option.innerHTML = k;
        option.value = k;
        select.appendChild(option);
    }

    document.getElementById("exampleList").appendChild(select);

    return select;
}

function run () {
    var select = createSelect();
    var example = window.location.hash.slice(1) ? window.location.hash.slice(1) : Object.keys(examples)[0];
    var score = examples[example]().translate(25, 50);

    select.onchange = function (e) {
        var example = e.target.value;
        window.location.hash = example;
        if (score) score.remove();
        score = examples[example]().translate(25, 50);
    };
}
