function run () {
    testTriads();
}

function testTriads () {
    var rootPosition = scored.chord({}, ["c4", "e4", "g4"]),
        firstInversion = scored.chord({stemDirection: "down"}, ["e4", "g4", "c5"]),
        secondInversion = scored.chord({}, ["g4", "c5", "e5"]);

    scored.render(rootPosition).translate(50, 100);
    scored.render(firstInversion).translate(75, 100);
    scored.render(secondInversion).translate(100, 100);
}
