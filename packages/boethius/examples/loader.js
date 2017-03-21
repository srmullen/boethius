import "../styles/index.css";
import WebFont from "webfontloader";
import Scored from "../src/Scored";
import {run} from "./score";

function start (cb) {
    var fontLoader = WebFont.load({
        custom: {
            families: ["gonville", "gonvillealpha"]
        },
        active: cb
    });
}

function createCanvas (el) {
    el.innerHTML = '<canvas class="scored-canvas parnassus"><canvas>';

    return document.getElementsByClassName("scored-canvas");
}

start(function () {
    var canvas = createCanvas(document.getElementById("music"));
    var scored = new Scored();
    scored.setup(canvas[0]);
    run(scored);
    scored.project.view.update();
});
