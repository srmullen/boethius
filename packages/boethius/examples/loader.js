var scored;

function start (cb) {
    var fontLoader = WebFont.load({
        custom: {
            families: ["gonville", "gonvillealpha"]
        },
        active: cb
    });
}

function drawCircle (point, radius, color) {
    radius = radius || 10;
    var circ = new paper.Path.Circle(point, radius);
    circ.fillColor = color || "red";
    return circ;
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
    paper.view.update();
});
