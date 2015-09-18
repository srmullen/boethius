var line;
function run () {
	/* page 1 */
	// clefLines();
	// timeSigLines();
	// keyLines();
	// line = fourBars();

	/* page 2 */
	createMeasures();
	interaction();
}

function createMeasures () {
	// Each stave can have a certain number of measures on it.
	// If there is more room on the line either more measures can be added to it or measures can expand
	// to take up the area.
	var treble = scored.clef({value: "treble", measure: 0});
	var	bass = scored.clef({value: "bass"});
	var	measure1 = scored.measure({index: 1, length: 400}, [bass]);
	var	measure2 = scored.measure({index: 1}, [bass]);

	line = scored.line({lineLength: 800}, [treble, measure2]);

	line.render();
	line.translate(50);
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
			lineLength: lineLength,
			measureLength: measureLength,
			measures: measures
		}, [treble, alto, tenor, bass]);

	line.render();
	line.translate([50, 150]);

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
	var	trebleLine = scored.line({lineLength: 150}, [treble]);
	var	bassLine = scored.line({lineLength: 150}, [bass]);
	var	altoLine = scored.line({lineLength: 150}, [alto]);
	var	tenorLine = scored.line({lineLength: 150}, [tenor]);

	trebleLine.render();
	bassLine.render();
	altoLine.render();
	tenorLine.render();
	trebleLine.translate([20, 20]);
	bassLine.translate([200, 20]);
	altoLine.translate([400, 20]);
	tenorLine.translate([600, 20]);
}

function timeSigLines () {
	var common = scored.timeSignature({value: "c", measure: 0}),
		half = scored.timeSignature({value: "h", measure: 0}),
		fourfour = scored.timeSignature({value: "4/4", measure: 0}),
		sixeight = scored.timeSignature({value: "6/8", measure: 0}),
		twelveeight = scored.timeSignature({value: "12/8", measure: 0}),
		commonLine = scored.line({lineLength: 150}, [common]),
		halfLine = scored.line({lineLength: 150}, [half]),
		fourfourLine = scored.line({lineLength: 150}, [fourfour]),
		sixeightLine = scored.line({lineLength: 150}, [sixeight]),
		twelveeightLine = scored.line({lineLength: 150}, [twelveeight]);

	commonLine.render();
	halfLine.render();
	fourfourLine.render();
	sixeightLine.render();
	twelveeightLine.render();
	commonLine.translate([20, 100]);
	halfLine.translate([200, 100]);
	fourfourLine.translate([400, 100]);
	sixeightLine.translate([600, 100]);
	twelveeightLine.translate([800, 100]);
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

		cLine = scored.line({lineLength: 100}, [c]),
		gLine = scored.line({lineLength: 100}, [treb1, g]),
		dLine = scored.line({lineLength: 100}, [treb2, d]),
		aLine = scored.line({lineLength: 100}, [treb3, a]),
		eLine = scored.line({lineLength: 100}, [treb4, e]),
		bLine = scored.line({lineLength: 100}, [bass5, b]),
		fsLine = scored.line({lineLength: 100}, [bass6, fs]),
		csLine = scored.line({lineLength: 100}, [bass7, cs]),
		fLine = scored.line({lineLength: 100}, [bass1, f]),
		bbLine = scored.line({lineLength: 100}, [bass2, bb]),
		ebLine = scored.line({lineLength: 100}, [bass3, eb]),
		abLine = scored.line({lineLength: 100}, [bass4, ab]),
		dbLine = scored.line({lineLength: 100}, [treb5, db]),
		gbLine = scored.line({lineLength: 100}, [treb6, gb]),
		cbLine = scored.line({lineLength: 100}, [treb7, cb]);

	// cLine.render();
	// cLine.translate([20, 200]);

	gLine.render();
	dLine.render();
	aLine.render();
	eLine.render();
	bLine.render();
	fsLine.render();
	csLine.render();
	fLine.render();
	bbLine.render();
	ebLine.render();
	abLine.render();
	dbLine.render();
	gbLine.render();
	cbLine.render();


	gLine.translate([20, 200]);
	dLine.translate([150, 200]);
	aLine.translate([300, 200]);
	eLine.translate([450, 200]);
	bLine.translate([600, 200]);
	fsLine.translate([750, 200]);
	csLine.translate([900, 200]);
	fLine.translate([20, 300]);
	bbLine.translate([150, 300]);
	ebLine.translate([300, 300]);
	abLine.translate([450, 300]);
	dbLine.translate([600, 300]);
	gbLine.translate([750, 300]);
	cbLine.translate([900, 300]);
}

function fourBars () {
	var treble = scored.clef({value: "treble", measure: 0}),
		bass = scored.clef({value: "bass", measure: 1}),
		alto = scored.clef({value: "alto", measure: 2}),
		tenor = scored.clef({value: "tenor", measure: 3}),
		line = scored.line({lineLength: 1000, measures: 4}, [treble, bass, alto, tenor]);

	line.render()
	line.translate([20, 400]);
	return line;
}
