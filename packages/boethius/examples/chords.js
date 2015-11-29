function run () {
    testTriads();
    testSevenths();
    testClusters();
}

function testTriads () {
    var rootPosition = scored.chord({}, ["c4", "e4", "g4"]),
        firstInversion = scored.chord({stemDirection: "down"}, ["e4", "g4", "c5"]),
        secondInversion = scored.chord({}, ["g4", "c5", "e5"]);

    scored.render(rootPosition).translate(50, 100);
    scored.render(firstInversion).translate(75, 100);
    scored.render(secondInversion).translate(100, 100);
}

function testSevenths () {
    var rootPositionStemUp = scored.chord({stemDirection: "up"}, ["c4", "e4", "g4", "b4"]),
        rootPositionStemDown = scored.chord({stemDirection: "down"}, ["c4", "e4", "g4", "b4"]),
        firstInversionStemUp = scored.chord({stemDirection: "up"}, ["e4", "g4", "b4", "c5"]),
        firstInversionStemDown = scored.chord({stemDirection: "down"}, ["e4", "g4", "b4", "c5"]),
        secondInversionStemUp = scored.chord({stemDirection: "up"}, ["g4", "b4", "c5", "e5"]),
        secondInversionStemDown = scored.chord({stemDirection: "down"}, ["g4", "b4", "c5", "e5"]),
        thirdInversionStemUp = scored.chord({stemDirection: "up"}, ["b4", "c5", "e5", "g5"]);
        thirdInversionStemDown = scored.chord({stemDirection: "down"}, ["b4", "c5", "e5", "g5"]);

    scored.render(rootPositionStemUp).translate(150, 100);
    scored.render(rootPositionStemDown).translate(200, 100);
    scored.render(firstInversionStemUp).translate(250, 100);
    scored.render(firstInversionStemDown).translate(300, 100);
    scored.render(secondInversionStemUp).translate(350, 100);
    scored.render(secondInversionStemDown).translate(400, 100);
    scored.render(thirdInversionStemUp).translate(450, 100);
    scored.render(thirdInversionStemDown).translate(500, 100);
}

function testClusters () {
    var twoClusterStemUp = scored.chord({stemDirection: "up"}, ["c4", "d4"]),
        twoClusterStemDown = scored.chord({stemDirection: "down"}, ["c4", "d4"]),
        threeClusterStemUp = scored.chord({stemDirection: "up"}, ["c4", "d4", "e4"]),
        threeClusterStemDown = scored.chord({stemDirection: "down"}, ["c4", "d4", "e4"]),
        fourClusterStemUp = scored.chord({stemDirection: "up"}, ["c4", "d4", "e4", "f4"]),
        fourClusterStemDown = scored.chord({stemDirection: "down"}, ["c4", "d4", "e4", "f4"]);

    scored.render(twoClusterStemUp).translate(50, 200);
    scored.render(twoClusterStemDown).translate(100, 200);
    scored.render(threeClusterStemUp).translate(150, 200);
    scored.render(threeClusterStemDown).translate(200, 200);
    scored.render(fourClusterStemUp).translate(250, 200);
    scored.render(fourClusterStemDown).translate(300, 200);
}
