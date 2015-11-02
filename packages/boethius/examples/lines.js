var line;
function run () {
	// clefLines();
	// timeSigLines();
	// keyLines();
	// line = fourBars();
	// createMeasures();
	// interaction();

	renderingNotesOnLine();
	noteValues();
}

function createMeasures () {
	var treble = scored.clef({value: "treble", measure: 0});
	var	bass = scored.clef({value: "bass"});
	var	measure1 = scored.measure({index: 1, length: 400}, [bass]);
	var	measure2 = scored.measure({index: 1}, [bass]);

	line = scored.line({measures: 2}, [treble, measure2]);

	scored.render(line, 750).translate(50, 500);
}

function interaction () {
	var lineLength = 750,
		measures = 4,
		measureLength = lineLength / measures;

	var treble = scored.clef({value: "treble", measure: 0}),
		alto = scored.clef({value: "alto", measure: 1}),
		tenor = scored.clef({value: "tenor", measure: 2})
		bass = scored.clef({value: "bass", measure: 3})
		line = scored.line({
			measureLength: measureLength,
			measures: measures
		}, [treble, alto, tenor, bass]);

	scored.render(line, lineLength).translate(50, 600);

	// line needs to be rendered first because that's when the measures are created.
	getMeasureFn = Scored.utils.line.getMeasure(line);

	$("canvas").click(function (e) {
		console.log(getMeasureFn(new paper.Point([e.offsetX, e.offsetY])));
	});

}

function clefLines () {
	var treble = scored.clef({value: "treble", measure: 0});
	var	bass = scored.clef({value: "bass", measure: 0});
	var	alto = scored.clef({value: "alto", measure: 0});
	var	tenor = scored.clef({value: "tenor", measure: 0});
	var	trebleLine = scored.line({}, [treble]);
	var	bassLine = scored.line({}, [bass]);
	var	altoLine = scored.line({}, [alto]);
	var	tenorLine = scored.line({}, [tenor]);
	var lineLength = 150;

	scored.render(trebleLine, lineLength).translate(20, 20);
	scored.render(bassLine, lineLength).translate(200, 20);
	scored.render(altoLine, lineLength).translate(400, 20);
	scored.render(tenorLine, lineLength).translate(600, 20);
}

function timeSigLines () {
	var common = scored.timeSig({value: "c", measure: 0}),
		half = scored.timeSig({value: "h", measure: 0}),
		fourfour = scored.timeSig({value: "4/4", measure: 0}),
		sixeight = scored.timeSig({value: "6/8", measure: 0}),
		twelveeight = scored.timeSig({value: "12/8", measure: 0}),
		commonLine = scored.line({}, [common]),
		halfLine = scored.line({}, [half]),
		fourfourLine = scored.line({}, [fourfour]),
		sixeightLine = scored.line({}, [sixeight]),
		twelveeightLine = scored.line({}, [twelveeight]);
	var lineLength = 150;

	scored.render(commonLine, lineLength).translate(20, 100);
	scored.render(halfLine, lineLength).translate(200, 100);
	scored.render(fourfourLine, lineLength).translate(400, 100);
	scored.render(sixeightLine, lineLength).translate(600, 100);
	scored.render(twelveeightLine, lineLength).translate(800, 100);
}

function keyLines () {
	var treb1 = scored.clef({value: "treble", measure: 0}),
		treb2 = scored.clef({value: "treble", measure: 0}),
		treb3 = scored.clef({value: "treble", measure: 0}),
		treb4 = scored.clef({value: "treble", measure: 0}),
		treb5 = scored.clef({value: "treble", measure: 0}),
		treb6 = scored.clef({value: "treble", measure: 0}),
		treb7 = scored.clef({value: "treble", measure: 0}),
		bass1 = scored.clef({value: "bass", measure: 0}),
		bass2 = scored.clef({value: "bass", measure: 0}),
		bass3 = scored.clef({value: "bass", measure: 0}),
		bass4 = scored.clef({value: "bass", measure: 0}),
		bass5 = scored.clef({value: "bass", measure: 0}),
		bass6 = scored.clef({value: "bass", measure: 0}),
		bass7 = scored.clef({value: "bass", measure: 0}),
		c = scored.key({value: "C", measure: 0}),
		g = scored.key({value: "G", measure: 0}),
		d = scored.key({value: "D", measure: 0}),
		a = scored.key({value: "A", measure: 0}),
		e = scored.key({value: "E", measure: 0}),
		b = scored.key({value: "B", measure: 0}),
		fs = scored.key({value: "F#", measure: 0}),
		cs = scored.key({value: "C#", measure: 0}),
		f = scored.key({value: "F", measure: 0}),
		bb = scored.key({value: "Bb", measure: 0}),
		eb = scored.key({value: "Eb", measure: 0}),
		ab = scored.key({value: "Ab", measure: 0}),
		db = scored.key({value: "Db", measure: 0}),
		gb = scored.key({value: "Gb", measure: 0}),
		cb = scored.key({value: "Cb", measure: 0}),

		cLine = scored.line({}, [c]),
		gLine = scored.line({}, [treb1, g]),
		dLine = scored.line({}, [treb2, d]),
		aLine = scored.line({}, [treb3, a]),
		eLine = scored.line({}, [treb4, e]),
		bLine = scored.line({}, [bass5, b]),
		fsLine = scored.line({}, [bass6, fs]),
		csLine = scored.line({}, [bass7, cs]),
		fLine = scored.line({}, [bass1, f]),
		bbLine = scored.line({}, [bass2, bb]),
		ebLine = scored.line({}, [bass3, eb]),
		abLine = scored.line({}, [bass4, ab]),
		dbLine = scored.line({}, [treb5, db]),
		gbLine = scored.line({}, [treb6, gb]),
		cbLine = scored.line({}, [treb7, cb]);

	var linelength = 100;

	scored.render(gLine, linelength).translate(20, 200);
	scored.render(dLine, linelength).translate(150, 200);
	scored.render(aLine, linelength).translate(300, 200);
	scored.render(eLine, linelength).translate(450, 200);
	scored.render(bLine, linelength).translate(600, 200);
	scored.render(fsLine, linelength).translate(750, 200);
	scored.render(csLine, linelength).translate(900, 200);
	scored.render(fLine, linelength).translate(20, 300);
	scored.render(bbLine, linelength).translate(150, 300);
	scored.render(ebLine, linelength).translate(300, 300);
	scored.render(abLine, linelength).translate(450, 300);
	scored.render(dbLine, linelength).translate(600, 300);
	scored.render(gbLine, linelength).translate(750, 300);
	scored.render(cbLine, linelength).translate(900, 300);
}

function fourBars () {
	var treble = scored.clef({value: "treble", measure: 0}),
		bass = scored.clef({value: "bass", measure: 1}),
		alto = scored.clef({value: "alto", measure: 2}),
		tenor = scored.clef({value: "tenor", measure: 3}),
		line = scored.line({measures: 4}, [treble, bass, alto, tenor]);

	scored.render(line, 1000).translate(20, 400);
	return line;
}

function renderingNotesOnLine () {
	var trebleLine = scored.line({}, [scored.clef({measure: 0}), scored.clef({value: "bass", measure: 1})]);
	var voice = scored.voice({}, [scored.note({pitch: "c4", value: 2}), scored.note({pitch: "d4", value: 2}),
								  scored.note({pitch: "c4", value: 2}), scored.note({pitch: "d4", value: 4}), scored.rest({value: 4})]);
	// var composition = scored.compose(trebleLine, [voice]);

	scored.render(trebleLine, 400, [voice], 2).translate(50);
}

function noteValues () {
	var line = scored.line({}, [scored.clef({value: "treble", measure: 0}), scored.timeSig({value: "4/4", measure: 0})]);
	var notes = _.fill(new Array(16), 16).concat(_.fill(new Array(8), 8)).concat(_.fill(new Array(4), 4)).concat(_.fill(new Array(2), 2)).concat(_.fill(new Array(1), 1));
	var voice = scored.voice({}, _.map(notes, function (n) {return scored.note({value: n})}));

	scored.render(line, 400, [voice], 5).translate(50, 150);
}
