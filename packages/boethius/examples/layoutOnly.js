function run () {
    // testLine().translate(25, 50);
    testStaffSingleLine().translate(25, 50);
}

function testLine () {
    var line = scored.line({}, [
        scored.clef({measure: 0}),
        scored.key({measure: 0}),
        scored.timeSig({measure: 0})
    ]);

    return scored.render(line, {length: 500, numMeasures: 3});
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

}

function testScoreSingleStaff () {

}

function testScoreMultipleStaves () {

}