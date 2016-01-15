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

/*
 * @param $el {jQuery} - element to append the canvas to.
 */
function createCanvas ($el) {
    $el.append('<canvas class="scored-canvas parnassus"><canvas>');

    return $(".scored-canvas");
}

start(function () {
    var $canvas = createCanvas($(".music"));
    scored = new Scored();
    scored.setup($canvas[0]);
    run();
    paper.view.update();
});
