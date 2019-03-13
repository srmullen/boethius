import "styles/index.css";
import {start} from "./loader";

import testDoubleStaffScore from './tests/testDoubleStaffScore';
import testVoicePastEndOfScore from './tests/testVoicePastEndOfScore';
import testNoStemsOnSecondStave from './tests/testNoStemsOnSecondStave';
import testPages from './tests/testPages';
import testChords from './tests/testChords';
import testSlurs from './tests/testSlurs';
import testLegato from './tests/testLegato';
import testLegatoSystemBreaks from './tests/testLegatoSystemBreaks';
import testLegatoHeight from './tests/testLegatoHeight';
import testChordTies from './tests/testChordTies';
import testStemHeights from './tests/testStemHeights';
import testClefChange from './tests/testClefChange';
import testTimeSigChange from './tests/testTimeSigChange';
import testChordSymbols from './tests/testChordSymbols';
import testRepeats from './tests/testRepeats';
import testPitchClassOctave from './tests/testPitchClassOctave';
import testUnusedVoices from './tests/testUnusedVoices';
import testBarlineNoteBreaks from './tests/testBarlineNoteBreaks';
import testBarlineRestBreaks from './tests/testBarlineRestBreaks';
import testBarlineChordBreaks from './tests/testBarlineChordBreaks';
import testSystemLength from './tests/testSystemLength';
import testSystemIndentation from './tests/testSystemIndentation';
import testTuplets from './tests/testTuplets';
import testParsing from './tests/testParsing';
import testForceAccidental from './tests/testForceAccidental';
import testBunchedClefChange from './tests/testBunchedClefChange';
import testNoteArticulations from './tests/testNoteArticulations';
import testAnacrusis from './tests/testAnacrusis';
import testFreeTimeSignature from './tests/testFreeTimeSignature';
import testMeasureAcrossSystems from './tests/testMeasureAcrossSystems';

const examples = {
    testDoubleStaffScore,
    testVoicePastEndOfScore,
    testNoStemsOnSecondStave,
    testPages,
    testChords,
    testSlurs,
    testLegato,
    testLegatoSystemBreaks,
    testLegatoHeight,
    testChordTies,
    testStemHeights,
    testClefChange,
    testTimeSigChange,
    testChordSymbols,
    testRepeats,
    testPitchClassOctave,
    testUnusedVoices,
    testBarlineNoteBreaks,
    testBarlineRestBreaks,
    testBarlineChordBreaks,
    testSystemLength,
    testSystemIndentation,
    testTuplets,
    testParsing,
    testForceAccidental,
    testBunchedClefChange,
    testNoteArticulations,
    testAnacrusis,
    testFreeTimeSignature,
    testMeasureAcrossSystems
};

function createSelect (value) {
    var select = document.createElement("select");

    for (let k in examples) {
        var option = document.createElement("option");
        option.innerHTML = k;
        option.value = k;
        select.appendChild(option);
    }

    select.value = value;
    document.getElementById("exampleList").appendChild(select);

    return select;
}

export function run (scored) {
  var example = window.location.hash.slice(1) ? window.location.hash.slice(1) : Object.keys(examples)[0];
  var select = createSelect(example);
  var score;
  examples[example](scored).then(acc => {
    score = acc.score
  });

  select.onchange = function (e) {
    var example = e.target.value;
    window.location.hash = example;
    if (score && score.group) {
        score.group.remove();
    }
    examples[example](scored).then((acc) => {
        score = acc.score
    });
  };
}

start(run);
