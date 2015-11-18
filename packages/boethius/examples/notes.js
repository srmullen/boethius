var up = {}, down = {}, beamed = {};

function run () {
	pageOne();
	// pageTwo();
}

function pageOne () {
	up.whole = scored.note({value: 1}),
	up.half = scored.note({value: 2}),
	up.quarter = scored.note({value: 4}),
	up.eighth = scored.note({value: 8}),
	up.sixteenth = scored.note({value: 16}),
	up.thirtysecond = scored.note({value: 32}),
	up.sixtyfourth = scored.note({value: 64}),
	up.onetwentyeighth = scored.note({value: 128});
	up.sharp = scored.note({pitch: "a#"});
	up.flat = scored.note({pitch: "ab"});
	up.doubleSharp = scored.note({pitch: "ax"});
	up.doubleFlat = scored.note({pitch: "abb"});
	up.oneDot = scored.note({dots: 1});
	up.twoDot = scored.note({dots: 2})

	renderNotes(up, 50);

	down.whole = scored.note({value: 1, stemDirection: "down"}),
	down.half = scored.note({value: 2, stemDirection: "down"}),
	down.quarter = scored.note({value: 4, stemDirection: "down"}),
	down.eighth = scored.note({value: 8, stemDirection: "down"}),
	down.sixteenth = scored.note({value: 16, stemDirection: "down"}),
	down.thirtysecond = scored.note({value: 32, stemDirection: "down"}),
	down.sixtyfourth = scored.note({value: 64, stemDirection: "down"}),
	down.onetwentyeighth = scored.note({value: 128, stemDirection: "down"});
	down.sharp = scored.note({pitch: "a#", stemDirection: "down"});
	down.flat = scored.note({pitch: "ab", stemDirection: "down"});
	down.doublesharp = scored.note({pitch: "ax", stemDirection: "down"});
	down.doubleflat = scored.note({pitch: "abb", stemDirection: "down"});
	down.oneDot = scored.note({dots: 1, stemDirection: "down"});
	down.twoDot = scored.note({dots: 2, stemDirection: "down"});

	renderNotes(down, 100);

	// beamedEigthsUp();
	simpleBeam(8, 250);
	simpleBeam(16, 300);
	simpleBeam(32, 350);

	var stemDirection;
	// stemDirection = "down";
	testBeaming(8, 16, 350, stemDirection);
	testBeaming(16, 32, 450, stemDirection);
	testBeaming(32, 64, 550, stemDirection);
	testBeaming(64, 128, 650, stemDirection);
	testBeaming(128, 256, 750, stemDirection);

	testBeaming(8, 32, 350, stemDirection);

	drawRests();

	createClefs();
	createTimeSigs();
	createKeys();
}
var path;
function pageTwo () {
	var note1 = scored.note({value: 4}),
		note2 = scored.note({value: 4}),
		note3 = scored.note({value: 4}),
		note4 = scored.note({value: 4, stemDirection: "down"}),
		note5 = scored.note({value: 4, stemDirection: "down"}),
		note6 = scored.note({value: 4, stemDirection: "down"}),
		note7 = scored.note({value: 4, stemDirection: "down"}),
		note8 = scored.note({value: 4});

	scored.render(note1, [100, 100]);
	scored.render(note2, [125, 100]);
	Scored.utils.note.slur([note1, note2]);

	scored.render(note3, [175, 100]);
	scored.render(note4, [200, 100]);
	Scored.utils.note.slur([note3, note4]);

	scored.render(note5, [250, 100]);
	scored.render(note6, [275, 100]);
	Scored.utils.note.slur([note5, note6]);

	scored.render(note7, [325, 100]);
	scored.render(note8, [350, 100]);
	Scored.utils.note.slur([note7, note8]);
}

function beamedEigthsUp () {
	var n1 = scored.note({value: 8}),
		n2 = scored.note({value: 8}),
		n3 = scored.note({value: 8}),
		n4 = scored.note({value: 8});

	n1.render().translate([50, 200]);
	n2.render().translate([75, 200]);
	n3.render().translate([100, 225])
	n4.render().translate([125, 180]);

	Scored.utils.note.beam([n1, n2, n3, n4], {
		fulcrum: new paper.Point(150, 150),
		vector: new paper.Point(100, -15)
	});
}

function beamedEigthsDown () {
	var n1 = scored.note({value: 8, stemDirection: "down"}),
		n2 = scored.note({value: 8}),
		n3 = scored.note({value: 8}),
		n4 = scored.note({value: 8});

	n1.render([200, 200]);
	n2.render([225, 200]);
	n3.render([250, 260]);
	n4.render([275, 180]);

	Scored.utils.note.beam([n1, n2, n3, n4], {});
}

function simpleBeam (type, yPos) {
	var n1 = scored.note({value: type})
		n2 = scored.note({value: type}),
		n3 = scored.note({value: type, stemDirection: "down"}),
		n4 = scored.note({value: type});

	n1.render().translate([550, yPos]);
	n2.render().translate([575, yPos]);

	n3.render().translate([625, yPos - 25]);
	n4.render().translate([650, yPos - 25]);

	Scored.utils.note.beam([n1, n2], {vector: new paper.Point(100, 15)});
	Scored.utils.note.beam([n3, n4], {});
}

function testBeaming (d1, d2, yPos, stemDirection) {
	stemDirection = stemDirection || "up";

	var n1 = scored.note({value: d1, stemDirection: stemDirection})
		n2 = scored.note({value: d2}),
		n3 = scored.note({value: d2}),
		n4 = scored.note({value: d1}),

		n5 = scored.note({value: d2, stemDirection: stemDirection}),
		n6 = scored.note({value: d1}),
		n7 = scored.note({value: d1}),
		n8 = scored.note({value: d2}),
		n9 = scored.note({value: d2}),

		n10 = scored.note({value: d1, stemDirection: stemDirection}),
		n11 = scored.note({value: d2}),

		n12 = scored.note({value: d2, stemDirection: stemDirection}),
		n13 = scored.note({value: d1});


	n1.render().translate([100, yPos]);
	n2.render().translate([125, yPos]);
	n3.render().translate([150, yPos]);
	n4.render().translate([175, yPos]);

	n5.render().translate([225, yPos]);
	n6.render().translate([250, yPos]);
	n7.render().translate([275, yPos]);
	n8.render().translate([300, yPos]);
	n9.render().translate([325, yPos]);

	n10.render().translate([375, yPos]);
	n11.render().translate([400, yPos]);

	n12.render().translate([450, yPos]);
	n13.render().translate([475, yPos]);

	Scored.utils.note.beam([n1, n2, n3, n4], {});
	Scored.utils.note.beam([n5, n6, n7, n8, n9], {vector: new paper.Point(100, -15)});
	Scored.utils.note.beam([n10, n11], {vector: new paper.Point(100, 25)});
	Scored.utils.note.beam([n12, n13], {vector: new paper.Point(100, 25)});
}

function renderNote (note, xPos, yPos) {
	scored.render(note, [xPos, yPos]);
}

function renderNotes (notes, yPos) {
	var xPos = 50, note, stemPoint, stemDirection;

	if (notes instanceof Array) {
		for (var i = 0; i < notes.length; i++) {
			renderNotes(notes, xPos, yPos);
		}
	} else {
		for (key in notes) {
			scored.render(notes[key], [xPos, yPos]);
			xPos = xPos + 50;
		}
	}
}

function drawRests () {
	var r1 = scored.rest({value: 1}),
		r2 = scored.rest({value: 2}),
		r3 = scored.rest({value: 4}),
		r4 = scored.rest({value: 8}),
		r5 = scored.rest({value: 16}),
		r6 = scored.rest({value: 32}),
		r7 = scored.rest({value: 64}),
		r8 = scored.rest({value: 128}),
		r9 = scored.rest({value: 256});

	r1.render().translate([100, 200]);
	r2.render().translate([125, 200]);
	r3.render().translate([150, 200]);
	r4.render().translate([175, 200]);
	r5.render().translate([200, 200]);
	r6.render().translate([225, 200]);
	r7.render().translate([250, 200]);
	r8.render().translate([275, 200]);
	r9.render().translate([300, 200]);
}

function createClefs () {
	var treble = scored.clef({value: "treble"}),
		bass = scored.clef({value: "bass"}),
		alto = scored.clef({value: "alto"}),
		tenor = scored.clef({value: "tenor"});

	treble.render([550, 400]);
	bass.render([600, 400]);
	alto.render([650, 400]);
	tenor.render([700, 400]);

	window.treble = treble;
}

function createTimeSigs () {
	var common = scored.timeSig({value: "c"}),
		half = scored.timeSig({value: "h"}),
		fourfour = scored.timeSig({value: "4/4"}),
		sixeight = scored.timeSig({value: "6/8"}),
		twelveeight = scored.timeSig({value: "12/8"});


	common.render([550, 500]);
	half.render([600, 500]);
	fourfour.render([650, 500]);
	sixeight.render([700, 500]);
	twelveeight.render([750, 500]);
}

function createKeys () {
	var c = scored.key({value: "C"}),
		g = scored.key({value: "G"}),
		d = scored.key({value: "D"}),
		a = scored.key({value: "A"}),
		e = scored.key({value: "E"}),
		b = scored.key({value: "B"}),
		fs = scored.key({value: "F#"}),
		cs = scored.key({value: "C#"}),
		f = scored.key({value: "F"}),
		bb = scored.key({value: "Bb"}),
		eb = scored.key({value: "Eb"}),
		ab = scored.key({value: "Ab"}),
		db = scored.key({value: "Db"}),
		gb = scored.key({value: "Gb"}),
		cb = scored.key({value: "Cb"});

	c.render([100, 800]);
	// sharps
	g.render([150, 800]);
	d.render([200, 800]);
	a.render([250, 800]);
	e.render([300, 800]);
	b.render([375, 800]);
	fs.render([450, 800]);
	cs.render([525, 800]);
	// flats
	f.render([150, 850]);
	bb.render([200, 850]);
	eb.render([250, 850]);
	ab.render([300, 850]);
	db.render([375, 850]);
	gb.render([450, 850]);
	cb.render([525, 850]);
}
