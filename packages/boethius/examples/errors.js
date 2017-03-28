
var files = ["error1", "error2", "error3", "tuplet_rest"];

var jsons = {};

function createSelect () {
    var select = document.createElement("select");

    for (var i = 0; i < files.length; i++) {
        var option = document.createElement("option");
        option.innerHTML = files[i];
        option.value = files[i];
        select.appendChild(option);
    }

    document.getElementById("exampleList").appendChild(select);

    return select;
}

function getJSON (file, scored) {
    return new Promise((resolve, reject) => {
        fetch("/json/" + file + ".json").then(res => {
            if (res.ok) {
                res.json().then(json => {
                    jsons[file] = json;
                    resolve(renderScore(scored, json.layout, json.voices, json.chordSymbols).translate(25, 50));
                });
            } else {
                console.error("something is wrong");
            }
        }).catch(err => {
            console.log("fail");
        });
    });
}

export function run (scored) {
    var select = createSelect();
    var filename = window.location.hash.slice(1) ? window.location.hash.slice(1) : files[0];
    select.value = filename;
    var score;

    getJSON(filename, scored).then(rendered => {
        score = rendered;
    }).catch(err => {
        console.error(err);
    });

    select.onchange = function (e) {
        var file = e.target.value;
        window.location.hash = file;
        if (score) score.remove();
        getJSON(file, scored).then(rendered => {
            score = rendered;
        }).catch(err => {
            console.error(err);
        });
    };
}

function renderScore (scored, layout, voices, chordSymbols) {
    return scored.render(layout, {
        voices: voices.map(Scored.parse),
        pages: [layout.currentPage],
        chordSymbols: chordSymbols.map(Scored.parse)
    });
}
