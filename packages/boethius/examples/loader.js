import WebFont from "webfontloader";
import Scored from "../src/Scored";

function createCanvas (el) {
    el.innerHTML = '<canvas class="scored-canvas parnassus"><canvas>';

    return document.getElementsByClassName("scored-canvas");
}


export function start (cb) {
    var canvas = createCanvas(document.getElementById("music"));
    var scored = new Scored();
    scored.setup(canvas[0]);
    var fontLoader = WebFont.load({
        custom: {
            families: ["gonville", "gonvillealpha"]
        },
        active: () => {cb(scored);}
    });
    scored.project.view.update();
}
