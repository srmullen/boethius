import { isString, first, last } from 'lodash';
import Score from "./views/Score";
import TimeContext from './views/TimeContext';
import { parseLayout, parseMusic } from "./utils/parser";
import { createMeasures } from "./views/Measure";

const defaultConfig = [
	'parserPlugin',
	'loggingPlugin',
	'measures',
	'score',
	'tiePlugin',
	'loggingPlugin'
];

// The colorPlugin is being used to help develop how plugins will be executed.
// Its goal is to allow object to be rendered in any color.
const pluginCollection = {
	measures: {
		name: 'measures',
		beforeRender: function ({measures, score, music}) {
			const repeats = music.repeats || [];
			return { measures: expandMeasures(measures, score, repeats) };
		}
	},
	score: {
		name: 'score',
		beforeRender: Score.beforeRender,
		render: Score.render,
		renderTimes: renderTimes,
		afterRenderTimes: afterRenderTimes,
		afterRender: afterRender
	},
  timeContextPlugin: {
    name: 'timeContextPlugin',
    beforeRender: function ({ score, music, systemsToRender, startTimes }) {
      const {voices=[], chordSymbols=[], repeats=[]} = music;
      const timeFrame = [startTimes[first(systemsToRender).index], startTimes[last(systemsToRender).index + 1]];
      const timeContexts = TimeContext.createTimeContexts(score.timeSigs, score.lines, voices, chordSymbols);
      return { timeContexts };
    }
  },
	parserPlugin: {
		name: 'parserPlugin',
		beforeRender: function (acc) {
			if (acc.options.parse) {
				const { score, measures } = parseLayout(acc.score);
				return {
					score,
					measures,
					music: parseMusic(acc.music)
				};
			}
		}
	},
	colorPlugin: {
		name: 'colorPlugin',
		collect: function (acc, item) {
			if (item.color) {
				console.log(`Item of color ${item.color}!`);
				return acc.concat([item]);
			}
			return acc;
		},

		apply: function (item) {
			console.log(`Rendering Item: ${item}`);
		}
	},
	tiePlugin: {
		name: 'tiePlugin',
		beforeRender: function ({voiceTimeFrames, startTimes}) {
			const groupings = Score.createGroups({voiceTimeFrames, startTimes});
			return { groupings };
		}
	},
	loggingPlugin: {
		name: 'loggingPlugin',
		beforeRender: function (acc) {
			console.log(acc);
		}
	}
};

/*
 * Acc should by default have...
 * 1. All TimeContexts.
 * 2. Rendering time frame.
 * 3. All Measures.
 * 4. All Systems.
 * 5. Functions for navigating through time contexts.
 */
function renderTimes (acc) {
	return new Promise((resolve, reject) => {
		Score.renderTimeContexts({
      score: acc.score,
      systemsToRender: acc.systemsToRender,
      measures: acc.measures,
      startMeasures: acc.startMeasures,
      systemTimeContexts: acc.systemTimeContexts,
      voices: acc.voices
    });
		resolve(acc);
	});
}

function afterRenderTimes (acc) {
	return new Promise((resolve, reject) => {
		acc.score.group.addChildren(Score.renderDecorations({
			groupings: acc.groupings,
		}));
		resolve(acc);
	});
}

function afterRender (acc) {
	return new Promise((resolve, rejet) => {
		acc.score.group.translate(25, 50);
		resolve(acc);
	});
}

/**
 * Merge plugins to override default behavior.
 */
export function mergePlugins (pluginConfig = []) {
  if (!pluginConfig.length) {
    return defaultConfig;
  }

  const plugins = []
  for (let i = 0; i < pluginConfig.length; i++) {
    if (isString(pluginConfig[i])) {
      plugins.push(pluginConfig[i]);
    } else {
      const plugin = pluginCollection[pluginConfig[i].name] || {};
      plugins.push(Object.assign({}, plugin, pluginConfig[i]));
    }
  }
  return plugins;
}

/**
 * Creates a chain of promises that runs the given function name of each plugin.
 *
 * @param {[{}]} plugins - Array of plugin objects.
 * @param {String} functionName - The name of the function to be executed from each plugin.
 * @return {Promise}
 */
export function runPlugins(plugins, functionName) {
	return function (aggregate) {
		return plugins.reduce((promise, plugin) => {
			if (isString(plugin)) {
				plugin = pluginCollection[plugin] || {};
			}

			if (plugin[functionName]) {
				return promise.then((agg) => {
					const val = plugin[functionName](agg, agg.options);
					if (val instanceof Promise) {
						return val;
					} else {
						return new Promise((resolve, reject) => {
							resolve(Object.assign({}, agg, val));
						});
					}
				});
			} else {
				return promise;
			}
		}, Promise.resolve(aggregate));
	}
}

/**
 * Given a sparse array of Measures, returns a full Measure array.
 */
function expandMeasures (sparse=[], score, repeats) {
	if (score.measureCount) {
		return createMeasures(score.measureCount, [...sparse, ...score.timeSigs, ...repeats]);
	} else {
		const numMeasures = _.sumBy(score.systems, system => system.props.duration.measure);
	  return createMeasures(numMeasures, [...sparse, ...score.timeSigs, ...repeats]);
	}
}
