var scored;

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
    scored = new Scored();
    scored.setup(canvas[0]);
    run();
    scored.project.view.update();
});
