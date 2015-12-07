var scored;

function start (cb) {
    var fontLoader = new FontLoader(['gonville', "gonvillealpha"], {
        fontsLoaded: cb
    });
    fontLoader.loadFonts();
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
    console.log("Fonts Loaded")
    var $canvas = createCanvas($(".music"));
    scored = new Scored();
    scored.setup($canvas[0]);
    run();
    paper.view.update();
});
