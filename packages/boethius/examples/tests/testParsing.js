import { createLayout, createVoice } from '../helpers';

export default function testParsing (scored) {
    // Scored should parse json if given a parse param.
    const layout = createLayout();
    const music = {
        voices: {
            mel: createVoice([['a4'], ['b4'], ['c5']])
        }
    };
    return scored.pluginRender(layout, music, {parse: true});
}
