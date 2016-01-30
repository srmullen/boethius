function run () {
    testLine().translate(25, 50);
    // testStaffSingleLine().translate(25, 150);
    testStaffMultipleLines().translate(25, 150);
    // testScoreSingleStaff().translate(25, 250);
    testScoreMultipleStaves().translate(25, 350);
}

function testLine () {
    var line = scored.line({}, [
        scored.clef({measure: 0}),
        scored.key({measure: 0}),
        scored.timeSig({measure: 0})
    ]);

    return scored.render(line, {numMeasures: 4});
}

function testStaffSingleLine () {
    var line = scored.line({}, [
        scored.clef({measure: 0}),
        scored.key({measure: 0}),
        scored.timeSig({measure: 0})
    ]);

    var staff = scored.staff({}, [scored.timeSig({measure: 0})]);

    return scored.render(staff, {lines: [line]});
}

function testStaffMultipleLines () {
    var line1 = scored.line({}, [
        scored.clef({measure: 0}),
        scored.key({measure: 0}),
        scored.timeSig({measure: 0})
    ]);

    var line2 = scored.line({}, [
        scored.clef({value: "bass", measure: 0}),
        scored.key({measure: 0}),
        scored.timeSig({measure: 0})
    ]);

    var staff = scored.staff({}, [scored.timeSig({measure: 0})]);

    return scored.render(staff, {lines: [line1, line2]});
}

function testScoreSingleStaff () {
    var line1 = scored.line({}, [
        scored.clef({measure: 0}),
        scored.key({measure: 0}),
        scored.timeSig({measure: 0})
    ]);

    var line2 = scored.line({}, [
        scored.clef({value: "bass", measure: 0}),
        scored.key({measure: 0}),
        scored.timeSig({measure: 0})
    ]);

    var staff = scored.staff({});

    var score = scored.score({}, [scored.timeSig({measure: 0}), staff, line1, line2]);

    return scored.render(score, {});
}

function testScoreMultipleStaves () {
    var line1 = scored.line({}, [
        scored.clef({measure: 0}),
        scored.key({measure: 0}),
        scored.timeSig({measure: 0})
    ]);

    var line2 = scored.line({}, [
        scored.clef({value: "bass", measure: 0}),
        scored.key({measure: 0}),
        scored.timeSig({measure: 0})
    ]);

    var line3 = scored.line({}, [
        scored.clef({value: "tenor", measure: 0}),
        scored.key({value: "A", measure: 0}),
        scored.timeSig({measure: 0})
    ]);

    var staff1 = scored.staff({measures: 4});
    var staff2 = scored.staff({measures: 4});
    var staff3 = scored.staff({measures: 4});

    var score = scored.score({staffHeights: [0, 300]}, [scored.timeSig({measure: 0}), staff1, staff2, line1, line2, line3]);

    return scored.render(score, {});
}
