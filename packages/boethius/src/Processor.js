let timeUtils = require("./utils/timeUtils");

var run = renderAll;
// var run = renderOnClick;

function renderOnClick (layout, events) {
	var musicTimes = timeUtils.splitByTime(events);

	var i = 0;
	$(".scored-canvas").on("click", function () {
		let music = musicTimes[i]
		if (music) {
			layout.processEvents(music);
			paper.view.update();
			i++;
		}
	});
}

function renderAll (layout, events) {
	var musicTimes = timeUtils.splitByTime(events);
	for (var i = 0; i < musicTimes.length; i++) {
		layout.processEvents(musicTimes[i]);
	}
	return layout;
}

/*
 * @return - [nextEventsToProcess, [restLayoutEvents, restMusicEvents]]
 */
function nextTime (time, [nextLayoutTime, ...restLayoutTimes], [nextMusicTime, ...restMusicTimes]) {
	// for some reason default arguments aren't working on these.
	nextLayoutTime = nextLayoutTime || [];
	nextMusicTime = nextMusicTime || [];

	if (nextLayoutTime.length) {
		let [e, ctx] = nextLayoutTime[0];
		if (timeUtils.compareByPosition(ctx, time)) {
			return [nextLayoutTime, [restLayoutTimes, Array.prototype.slice.call(arguments, 0)[2]]]
		}
	}

	if (nextMusicTime.length) {
		return [nextMusicTime, [Array.prototype.slice.call(arguments, 0)[1], restMusicTimes]];
	}

	// no events left
	return [[], []];
}

/*
 * @return - [nextEventsToProcess, [restLayoutEvents, restMusicEvents]]
 */
function nextEvents ([nextLayoutTime=[], ...restLayoutTimes], [nextMusicTime=[], ...restMusicTimes]) {
	if (nextLayoutTime.length && nextMusicTime.length) {
		if (nextLayoutTime[0][1].time <= nextMusicTime[0][1].time){
			return [nextLayoutTime, [restLayoutTimes, Array.prototype.slice.call(arguments, 0)[1]]];
		} else {
			return [nextMusicTime, [Array.prototype.slice.call(arguments, 0)[0], restMusicTimes]];
		}
	} else if (nextLayoutTime.length && !nextMusicTime.length) {
		return [nextLayoutTime, [restLayoutTimes, []]];
	} else if (!nextLayoutTime.length && nextMusicTime.length) {
		return [nextMusicTime, [[], restMusicTimes]];
	}
}

function sortByKey (obj) {
	var times = _.keys(obj);

	var sortedTimes = _.sortBy(times, function (t) {
		return parseFloat(t);
	});

	return _.map(sortedTimes, function (time) {
		return obj[time];
	});
}

module.exports = {run: run};
