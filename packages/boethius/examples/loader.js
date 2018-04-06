import Scored from "../src/Scored";
import loadFonts from '../src/utils/fonts';

function createCanvas (el) {
    el.innerHTML = '<canvas class="scored-canvas parnassus"><canvas>';

    return document.getElementsByClassName("scored-canvas");
}


export function start (cb) {
    var canvas = createCanvas(document.getElementById("music"));
    var scored = new Scored();
    scored.setup(canvas[0]);
    loadFonts().then(() => {
        cb(scored)
    }).catch((err) => {
        console.error(err);
    });
    scored.project.view.update();
}
