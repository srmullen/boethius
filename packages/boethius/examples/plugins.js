import "styles/index.css";
import Scored from "../src/Scored";
import {start} from "./loader";

const plugins = {
    'render-note-plugin': {
        render: function () {

        }
    },
    'render-beamings-plugin': {
        onCreateNode: function () {

        },
        render: function () {

        }
    },
    // 'render-slurs-plugin': {}
};

const config = {
    plugins: [
        'render-note-plugin',
        'render-beamings-plugin',
        'render-slurs-plugin'
    ]
};

start((scored) => {
    config.plugins.map(plugin => {
        console.log(plugin);
    });
});
