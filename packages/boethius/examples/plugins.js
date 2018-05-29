import "styles/index.css";
import Scored from "../src/Scored";
import loadFonts from '../src/utils/fonts';

function createCanvas (el) {
    el.innerHTML = '<canvas class="scored-canvas parnassus"><canvas>';

    return document.getElementsByClassName("scored-canvas");
}


loadFonts().then(() => {
    const canvas = createCanvas(document.getElementById("music"));
    
}).catch(error => {
    console.error(error);
})
