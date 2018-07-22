import "styles/index.css";
import Scored from "../src/Scored";
import {start} from "./loader";
import {legato, staccato, createLayout, createNote} from './helpers';

const plugins = {
    'tie-plugin': {
        beforeRender: function () {

        }
    },
    'beamings-plugin': {
        onCreateNode: function () {

        },
        render: function () {

        }
    },
};

const config = {
    plugins: [
        'render-note-plugin',
        'beamings-plugin',
        'tie-plugin'
    ]
};

start((scored) => {
    config.plugins.map(plugin => {
        console.log(plugin);
    });

    const layout = createLayout();
    const music = {
        voices: {
            mel: [['a4'], ['b4', 4, {color: 'green'}], ['c5']].map(note => createNote.apply(null, note))
        }
    };
    const score = scored.pluginRender(layout, music, config);
    if (score) score.translate(25, 50);
});
