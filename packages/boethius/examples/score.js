function run () {
    // testDoubleStaffScore().translate(25, 50);
    // testVoicePastEndOfScore().translate(25, 50);
    // testNoStemsOnSecondStave().translate(25, 50);
    testPages().translate(25, 50);
}

var l;
function runTimes (f, n) {
	for (var i = 0; i < n; i++) {
		if (l && l.remove) l.remove();
		l = f();
	}
}

function remove () {
    if (scr) scr.remove();
}

function testDoubleStaffScore () {
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

    var score = scored.score({length: 1000, systemHeights: [0, 350]}, [fourfour, system1, system2, trebleLine, bassLine]);

    // render it all as a score.
    return scored.render(score, {voices: [soprano, bass]});
}

function testVoicePastEndOfScore () {
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

    var score = scored.score({}, [timeSig, system, line]);

    return scored.render(score, {voices: [voice]});
}

function testNoStemsOnSecondStave () {
    var timeSig = scored.timeSig({value: "4/4", measure: 0});

    var line = scored.line({voices: ["v"]}, [
        scored.clef({value: "treble", measure: 0}),
        scored.key({value: "C", measure: 0}),
        scored.timeSig({value: "4/4", measure: 0})
    ]);

    var system1 = scored.system({measures: 1, startMeasure: 0});
    var system2 = scored.system({measures: 1, startmeasure: 1});

    var score = scored.score({}, [timeSig, line, system1, system2]);

    var n = scored.note;
    var voice = scored.voice({name: "v"}, [
        n(), n(), n(), n(),
        n(), n(), n(), n(),
        n()
    ]);

    return scored.render(score, {voices: [voice]});
}

function testPages () {
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
    var system1 = scored.system({measures: 4, lineHeights: [0, 200], page: 1});
    var system2 = scored.system({measures: 4, page: 1});
    var system3 = scored.system({measures: 4, page: 2});

    var score = scored.score({
        length: 1000,
        systemHeights: [0, 350, 600]
    }, [fourfour, system1, system2, system3, trebleLine, bassLine]);

    // render it all as a score.
    return scored.render(score, {voices: [soprano, bass], pages: [1]});

}
