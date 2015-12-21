function run () {
    testDoubleStaffScore();
}

function testDoubleStaffScore () {
    var treble = scored.line({}, [
        scored.clef({value: "treble", measure: 0}), scored.key({value: "C", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
    ]);
    var bass = scored.line({}, [
        scored.clef({value: "bass", measure: 0}), scored.key({value: "C", measure: 0}), scored.timeSig({value: "4/4", measure: 0})
    ]);
    var staff = scored.staff({});
    var score = scored.score({}, [staff]);

}
