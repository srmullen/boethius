var constants = require("./constants"),
	F = require("fraction.js");

// Inputs should change depending on the midi file.
// These values are just for Bach invention 1.
var quantize = createQuantization(240, 4, 64);

function Channel () {
	this.currentTime = 0;
	this.noteOn = {};
}

function MidiEventHandler () {
	this.channels = _.map(new Array(16), () => new Channel());
}

MidiEventHandler.prototype.parseHeader = function (header) {
	this.formatType = header.formatType;
	this.ticksPerBeat = header.ticksPerBeat;
	this.trackCount = header.trackCount;
}

MidiEventHandler.prototype.noteOn = function (event, score) {
	var channel = this.channels[event.channel],
		types, type, dots, tuplet;

	// if noteOn has a deltaTime that means there was a rest before it
	if (event.deltaTime) {

		// if (event.deltaTime === 10 || event.deltaTime === 530) {
		// 	debugger;
		// }
		// [type, dots, tuplet] = deltaToType(event.deltaTime, this.ticksPerBeat, this.denominator);
		types = deltaToType(quantize(event.deltaTime), this.ticksPerBeat, this.denominator);
		for (var i = 0; i < types.length; i++) {
			[type, dots, tuplet] = types[i];
			score[event.channel][2].push(["rest", {type: type, dots: dots, tuplet: tuplet}]);
		}
	}

	// update the time
	channel.currentTime += event.deltaTime;

	// store the noteOn event in the channel by its note number
	this.channels[event.channel].noteOn[event.noteNumber] = [channel.currentTime, event];


};

function addEventsToScore (score, channel, events) {
	score[event.channel][2].push(["rest", {type: type, dots: dots, tuplet: tuplet}]);
}

MidiEventHandler.prototype.noteOff = function (event, score, layout) {
	var channel = this.channels[event.channel],
		[onTime, onEvent] = channel.noteOn[event.noteNumber],
		note,
		pitch,
		types,
		type,
		dots,
		tuplet;

	// update the time
	channel.currentTime += event.deltaTime;

	if (!onEvent) { // for debugging, I think there should always be an onEvent
		console.log("no onEvent");
		return;
	}

	note = teoria.note.fromMIDI(event.noteNumber);
	pitch = note.name() + note.accidental() + note.octave();
	// [type, dots, tuplet] = deltaToType(channel.currentTime - onTime, this.ticksPerBeat, this.denominator);
	// score[event.channel][2].push(["note", {pitch: pitch, type: type, dots: dots}]);

	// if (event.deltaTime === 10 || event.deltaTime === 530) {
	// 	debugger;
	// }

	types = deltaToType(quantize(event.deltaTime), this.ticksPerBeat, this.denominator);
	for (var i = 0; i < types.length; i++) {
		[type, dots, tuplet] = types[i];
		score[event.channel][2].push(["note", {pitch: pitch, type: type, dots: dots, tuplet: tuplet}]);
	}
};

MidiEventHandler.prototype.noteAfterTouch = function (event) {};
MidiEventHandler.prototype.controller = function (event) {};
MidiEventHandler.prototype.programChange = function (event) {};
MidiEventHandler.prototype.channelAfterTouch = function (event) {};
MidiEventHandler.prototype.pitchBend = function (event) {};

MidiEventHandler.prototype.sequenceNumber = function (event) {};
MidiEventHandler.prototype.text = function (event) {};
MidiEventHandler.prototype.copyrightNotice = function (event) {};
MidiEventHandler.prototype.trackName = function (event) {};
MidiEventHandler.prototype.instrumentName = function (event) {};
MidiEventHandler.prototype.lyrics = function (event) {};
MidiEventHandler.prototype.marker = function (event) {};
MidiEventHandler.prototype.cuePoint = function (event) {};
MidiEventHandler.prototype.midiChannelPrefix = function (event) {};
MidiEventHandler.prototype.endOfTrack = function (event) {};
MidiEventHandler.prototype.setTempo = function (event) {};
MidiEventHandler.prototype.smpteOffset = function (event) {};

MidiEventHandler.prototype.timeSignature = function (event) {
	this.numerator = event.numerator;
	this.denominator = event.denominator;
	// also needs to add a timeSig event to the layout
};

MidiEventHandler.prototype.keySignature = function (event) {};
MidiEventHandler.prototype.sequencerSpecific = function (event) {};
MidiEventHandler.prototype.unknown = function (event) {};

function deltaToType (delta, ticksPerBeat, beatType) {
	// ex. beatType = 4, ticksPerBeat = 240, delta = 120
	// 120 ticks is half a beat, so end up with 8, eight note
	// var type = (ticksPerBeat / delta) * beatType,
	var beats = (delta / ticksPerBeat),
		type = beatType / beats,
		dots,
		tuplet;

	if (_.contains(constants.noteTypes, type)) {
		return [[type]];
	}

	console.log(type);

	var remaining = beats,
		reciprocalType = _.map(constants.noteTypes, n => 1/n),
		outTypes = [];

	for (var i = 0; i < reciprocalType.length; i++) {
		var rtype = reciprocalType[i];
		while (rtype <= remaining) {
			outTypes.push(rtype);
			remaining = remaining - rtype;
		}
	}

	if (remaining !== 0) console.error(`DeltaToType Error:
		beats - ${beats},
		delta - ${delta},
		ticksPerBeat - ${ticksPerBeat},
		beatType - ${beatType}`);

	return _.map(outTypes, beats => [beatType / beats]);
}

/*
 * @param delta {number} - ticks since the last event
 * @param ticksPerBeat {number} - number of ticks in a beat
 * @param beatType {number} - number from constants.noteTypes
 */
// function deltaToType (delta, ticksPerBeat, beatType) {
// 	// ex. beatType = 4, ticksPerBeat = 240, delta = 120
// 	// 120 ticks is half a beat, so end up with 8, eight note
// 	// var type = (ticksPerBeat / delta) * beatType,
// 	var beats = (delta / ticksPerBeat),
// 		splitTypes = _.partition(constants.noteTypes, x => x < beatType / beats),
// 		type = _.first(splitTypes[1]),
// 		// beats = new F(delta, ticksPerBeat),
// 		// type = new F(beatType, beats),
// 		dots,
// 		tuplet;

// 	// console.log(beats, type);

// 	// need to also figure out dots, tuplets, etc.
// 	// if (_.contains(constants.noteTypes, type)) {
// 	// 	return [type];
// 	// }

// 	// console.log(beats, type);
// 	// [type, dots] = getDots(beats);

// 	// possibly do quantization here

// 	return [type, dots, tuplet];
// }

function getDots (beats) {
	var realType, dots;

	return [realType, dots];
}

function getTuplet (type) {

}

function parseMidi (midi) {
	midi = midi || "";
	var ff = [];
	var mx = midi.length;
	var scc= String.fromCharCode;
	for (var z = 0; z < mx; z++) {
		ff[z] = scc(midi.charCodeAt(z) & 255);
	}
	var file = MidiFile(ff.join(""));
	// console.log(file);
	var [score, layout] = midiToScore(file);
	// console.log(score);
	return _.filter(score, function (voice) {
		return voice[2] && voice[2].length;
	});
}

function midiToScore (parsedMidi) {
	var midiEventHandler = new MidiEventHandler(),
		score = _.map(_.range(16), createVoice), // 16 channels
		layout = [],
		event,
		handler;

	midiEventHandler.parseHeader(parsedMidi.header);

	for (var i = 0; i < parsedMidi.tracks.length; i++) {
		for (var j = 0; j < parsedMidi.tracks[i].length; j++) {
			event = parsedMidi.tracks[i][j];
			midiEventHandler[event.subtype](event, score, layout);
		}
	}

	return [score, layout];
}

function createVoice (value) {
	return ["voice", {value: value}, []];
}

function createQuantization (ticksPerBeat, denominator, beatType) {
	// calculate number of ticks for the beatType
	// if the beatType is the same as the denominator then ticksPerBeat is the minimumTicks
	var minimumTicks = ticksPerBeat * (denominator / beatType),
		half = minimumTicks / 2;

	if (!Number.isInteger(minimumTicks)) {
		throw new Error("Midi file doesn't support this level of quantization.");
	}

	return function (deltaTime) {
		var rem = deltaTime % minimumTicks;
		if (rem) {
			deltaTime = (rem >= half) ? (deltaTime + minimumTicks - rem) : (deltaTime - rem);
		}
		return deltaTime;
	}
}

// for testing in the console
// window.createQuantization = createQuantization;
// window.deltaToType = deltaToType;

module.exports = {
	parseMidi: parseMidi
}
