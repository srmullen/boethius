import {expect} from "chai";
import _ from "lodash";
import * as common from "../src/utils/common";
import Scored from "../src/Scored";
import Score from "../src/views/Score";

describe("Scored", () => {
	const scored = new Scored();

	describe("fromJSON", () => {
		it("should exist", () => {
			expect(scored.fromJSON).to.be.ok;
		});
	});

	describe("note", () => {
		it("should return a Note object", () => {
			let note = scored.note();
			expect(note.type).to.equal("note");
			expect(note.voice).not.to.be.defined;
			expect(note.value).to.equal(4);
			expect(note.pitch).to.equal("a4");
			expect(note.dots).to.equal(0);

			note = scored.note({pitch: "g#6", value: 8, dots: 2});
			expect(note.type).to.equal("note");
			expect(note.value).to.equal(8);
			expect(note.pitch).to.equal("g#6");
			expect(note.dots).to.equal(2);
		});
	});
	describe("rest", () => {
		it("should return a Rest object", () => {
			let rest = scored.rest();
			expect(rest.type).to.equal("rest");
			expect(rest.voice).to.equal(0);
			expect(rest.value).to.equal(4);
			expect(rest.dots).to.equal(0);

			rest = scored.rest({value: 16, voice: 3, dots: 1});
			expect(rest.type).to.equal("rest");
			expect(rest.voice).to.equal(3);
			expect(rest.value).to.equal(16);
			expect(rest.dots).to.equal(1);
		});
	});
	describe("clef", () => {
		it("should return a Clef object", () => {
			let clef = scored.clef();
			expect(clef.type).to.equal("clef");
			expect(clef.value).to.equal("treble");

			clef = scored.clef({value: "bass"});
			expect(clef.value).to.equal("bass");
		});
	});
	describe("key", () => {
		it("should return a Key object", () => {
			let key = scored.key();
			expect(key.type).to.equal("key");
			expect(key.value).to.equal("C");

			key = scored.key({value: "D#"});
			expect(key.value).to.equal("D#");
		});
	});
	describe("timeSig", () => {
		it("should return a timeSig object", () => {
			let timeSig = scored.timeSig();
			expect(timeSig.type).to.equal("timeSig");
			expect(timeSig.value).to.equal("4/4");

			timeSig = scored.timeSig({value: "h"});
			expect(timeSig.value).to.equal("h");
		});
	});
	describe("dynamic", () => {
		it("should have a type of dynamic.", () => {
			const dynamic = scored.dynamic();
			expect(dynamic.type).to.equal("dynamic");
		});
		it("should have no default value", () => {
			const dynamic = scored.dynamic({value: "fff"});
			expect(dynamic.value).not.to.be.defined;
		});
	});
	describe("measure", () => {
		it("should return a Measure object", () => {
			let fourfour = scored.timeSig(),
				threefour = scored.timeSig({value: 3/4}),
			 	measure = scored.measure({timeSig: fourfour});
			expect(measure.type).to.equal("measure");
			expect(measure.timeSig).to.equal(fourfour);
			expect(measure.startsAt).to.equal(0);
			expect(measure.children).to.be.empty;

			measure = scored.measure({timeSig: threefour, startsAt: 4});
			expect(measure.timeSig).to.equal(threefour);
			expect(measure.startsAt).to.equal(4);
			expect(measure.children).to.be.empty;
		});
	});
	describe("line", () => {
		it("should return a Line object", () => {
			let line = scored.line();
			expect(line.type).to.equal("line");
			expect(line.children.length).to.equal(0);
			expect(line.voices).to.eql({});

			line = scored.line({voices: 2});
			expect(line.voices).to.equal(2);
		});
		xit("should no longer set up its measures. Measure.createMeasures does that.", () => {
			let line = scored.line({measures: 4});
			expect(line.children.length).to.equal(4);
			expect(_.map(line.children, m => m.startsAt)).to.eql([0, 1, 2, 3]);

			line = scored.line({measures: 4}, common.doTimes(4, () => scored.measure({timeSig: "3/4"})));
			expect(line.children.length).to.equal(4);
			expect(_.map(line.children, m => m.startsAt)).to.eql([0, 0.75, 1.5, 2.25]);
		});
	});
	
    xdescribe("layout", () => {
		describe("key", () => {
			it("should layout", () => {
				let key = scored.layout(["key"]);
				expect(key).to.eql(scored.key());
				expect(JSON.stringify(scored.serialize(key))).to.equal(JSON.stringify(["key", {value: "C"}]));

				key = scored.layout(["key", {value: "D"}]);
				expect(key).to.eql(scored.key({value: "D"}));
				expect(JSON.stringify(scored.serialize(key))).to.equal(JSON.stringify(["key", {value: "D"}]));
			});
		});
		describe("timeSig", () => {
			it("should layout", () => {
				let timeSig = scored.layout(["timeSig"]);
				expect(timeSig).to.eql(scored.timeSig());
				expect(JSON.stringify(scored.serialize(timeSig))).to.equal(JSON.stringify(["timeSig", {value: "4/4", beatStructure: [2,2]}]));

				timeSig = scored.layout(["timeSig", {value: "3/8"}]);
				expect(timeSig).to.eql(scored.timeSig({value: "3/8"}));
				expect(JSON.stringify(scored.serialize(timeSig))).to.equal(JSON.stringify(["timeSig", {value: "3/8"}]));
			});
		});
		describe("clef", () => {
			it("should layout", () => {
				let clef = scored.layout(["clef"]);
				expect(clef).to.eql(scored.clef());
				expect(JSON.stringify(scored.serialize(clef))).to.equal(JSON.stringify(["clef", {value: "treble"}]));

				clef = scored.layout(["clef", {value: "bass"}]);
				expect(clef).to.eql(scored.clef({value: "bass"}));
				expect(JSON.stringify(scored.serialize(clef))).to.equal(JSON.stringify(["clef", {value: "bass"}]));
			});
		});
		describe("measure", () => {
			it("should layout", () => {
				let measure = scored.layout(["measure"]);
				expect(measure).to.eql(scored.measure());

				measure = scored.layout(["measure", {timeSig: "c"}]);
				expect(measure).to.eql(scored.measure({timeSig: "c"}));

				measure = scored.layout(["measure", {timeSig: "h"}]);
				expect(measure).to.eql(scored.measure({timeSig: "h"}));

				measure = scored.layout(["measure", {timeSig: "3/4"}]);
				expect(measure).to.eql(scored.measure({timeSig: "3/4"}));
			});
			it("can have a child clef", () => {
				let measure = scored.layout(["measure", {}, [["clef", {value: "bass"}]]]);
				expect(measure).to.eql(scored.measure({}, [scored.clef({value: "bass"})]));
			});
			it("can have a child timeSig", () => {
				let measure = scored.layout(["measure", {}, [["timeSig", {value: "12/8"}]]]);
				expect(measure).to.eql(scored.measure({}, [scored.timeSig({value: "12/8"})]));
			});
			it("can have a child key", () => {
				let measure = scored.layout(["measure", {}, [["key", {value: "G#"}]]]);
				expect(measure).to.eql(scored.measure({}, [scored.key({value: "G#"})]));
			});
			it("can have a mixture of children", () => {
				let measure = scored.layout(["measure", {}, [["clef", {value: "alto"}],
				                                              ["key", {value: "G#"}],
															  ["timeSig", {value: "3/4"}]]]);
				expect(measure.children[0].type).to.equal("clef");
				expect(measure.children[0].value).to.equal("alto");
				expect(measure.children[1].type).to.equal("key");
				expect(measure.children[1].value).to.equal("G#");
				expect(measure.children[2].type).to.equal("timeSig");
				expect(measure.children[2].value).to.equal("3/4");
				expect(measure).to.eql(scored.measure({}, [scored.clef({value: "alto"}), scored.key({value: "G#"}), scored.timeSig({value: "3/4"})]));
			});
		});
        describe("line", () => {
			it("should layout", () => {
				let line = scored.layout(["line"]);
				expect(line).to.eql(scored.line());
			});
			it("should only have measures as children", () => {
				let line = scored.layout(["line", {measures: 2}, [["clef"]]]);
				expect(line).to.eql(scored.line({measures: 2}, [scored.clef()]));
			});
			xit("should place a clef in the correct mesure", () => { // now the responsibillity of Measure.createMeasures
				let line = scored.layout(["line", {"measures": 2}, [["clef"]]]);
				expect(line.children[0].children[0]).to.eql(scored.clef());
			});
		});

        describe("staff", () => {
            it("should layout", () => {
                let staff = scored.layout(["staff"]);
                expect(staff).to.eql(scored.staff());
            });
        });

        describe("Score", () => {
            it("should have no staves or lines by default", () => {
                let score = scored.score();
                expect(score.lines).to.eql([]);
                expect(score.staves).to.eql([]);
            });
            it("should add Line children to the staves array", () => {
                let score = scored.score({}, [scored.line()]);
                expect(score.lines.length).to.equal(1);
            });
            it("should add Staff children to the staves array", () => {
                let score = scored.score({}, [scored.staff(), scored.staff()]);
                expect(score.staves.length).to.equal(2);
            });
            it("should index lines and staves in the order they are in in the children array", () => {
                let children = [scored.line({voices: 10}), scored.staff({measures: 3}),
                                scored.line({voices: 11}), scored.line({voices: 12}),
                                scored.staff({measures: 4}), scored.staff({measures: 5})];
                let score = scored.score({}, children);
                expect(score.lines.map(line => line.voices)).to.eql([10, 11, 12]);
                expect(score.staves.map(staff => staff.measures)).to.eql([3, 4, 5]);
            });
        });

		describe("composing layout and music", () => {
			let voice = ["voice", {value: 0}, [["note"]]];
			describe("line with no measures", () => {
				xit("should have nothing added to it", () => {
					let line = scored.compose(scored.layout(["line"]), scored.createEvents(voice));
					expect(line.type).to.equal("line");
					expect(line.children.length).to.equal(0);
				});
			});

            describe("composing with Score view", () => {
                it("should add events to the correct line", () => {
                    let score = scored.score({}, [scored.line({voices: ["alto"]}), scored.line({voices: ["bass"]})]),
                        events = scored.createEvents([
                            ["voice", {value: "alto"}, [["note", {pitch: "a5"}],["note", {pitch: "b5"}],["note", {pitch: "c5"}]]],
                            ["voice", {value: "bass"}, [["note", {pitch: "c3"}],["note", {pitch: "d3"}],["note", {pitch: "e3"}]]]
                        ]);
                    let composition = scored.compose(score, events);
                    let altoLine = Score.getLineByVoice("alto", composition.lines),
                        bassLine = Score.getLineByVoice("alto", composition.lines);
                    // expect something!
                });
            });
		});
    });
	describe("createEvents", () => {
		it("should return an array", () => {
			let music = scored.createEvents();
			expect(music).to.eql([]);
		});
		it("should take a single event array", () => {
			let music = ["note"];
			expect(scored.createEvents(music)).to.eql([scored.note({time: 0})]);

			music = ["note", {pitch: "f#3", value: 2}];
			expect(scored.createEvents(music)).to.eql([scored.note({pitch: "f#3", value: 2, time: 0})]);

			let rest = ["rest"];
			expect(scored.createEvents(rest)).to.eql([scored.rest({time: 0})]);

			rest = ["rest", {value: 8, tuplet: "3/2"}];
			expect(scored.createEvents(rest)).to.eql([scored.rest({value: 8, tuplet: "3/2", time: 0})]);
		});
		it("should take nested arrays", () => {
			let music = [["note"]];
			expect(scored.createEvents(music)).to.eql([scored.note({time: 0})]);
		});
		it("should add time to the events", () => {
			let music = [["note"], ["note", {value: 8}], ["note", {value: 16}]];
			expect(scored.createEvents(music)).to.eql([scored.note({time: 0}),
				scored.note({value: 8, time: 0.25}),
				scored.note({value: 16, time: 0.375})]);

			music = [["rest", {value: 16}], ["rest", {value: 8}], ["rest"]];
			expect(scored.createEvents(music)).to.eql([scored.rest({value: 16, time: 0}),
				scored.rest({value: 8, time: 1/16}),
				scored.rest({time: 3/16})]);
		});
		it("should set the voice", () => {
			let voice = ["voice", {value: 2}, ["note"]];
			expect(scored.createEvents(voice)).to.eql([scored.note({time: 0, voice: 2})]);
		});

	});

});
