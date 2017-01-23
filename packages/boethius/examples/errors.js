const roots = [
    "Ab" ,"A", "A#", "Bb", "B", "B#", "Cb", "C", "C#", "Db", "D",
    "D#", "Eb", "E", "E#", "Fb", "F", "F#", "Gb", "G", "G#"
];

const modes = ["major", "minor"];

const keys = roots.reduce((acc, root) => {
    acc[root] = modes.reduce((modeAcc, mode) => {
        modeAcc[mode] = (mode === "minor") ? root.toLowerCase() : root;
        return modeAcc;
    }, {});
    return acc;
}, {});

var files = ["error1", "error2"];

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

function getJSON (file) {
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

function run () {
    var select = createSelect();
    var filename = window.location.hash.slice(1) ? window.location.hash.slice(1) : files[0];
    select.value = filename;
    var score;

    getJSON(filename).then(rendered => {
        score = rendered;
    }).catch(err => {
        console.error(err);
    });

    select.onchange = function (e) {
        var file = e.target.value;
        window.location.hash = file;
        if (score) score.remove();
        getJSON(file).then(rendered => {
            score = rendered;
        }).catch(err => {
            console.error(err);
        });
    };
}

function renderScore (scored, layout, voices, chordSymbols) {
    const timeSigs = layout.timeSignatures.map(timeSig => {
        return scored.timeSig({value: convertTimeSig(timeSig.value), measure: timeSig.measure});
    });

    const lines = layout.lines.map(makeLine.bind(null, scored, timeSigs));

    const pages = makePages(scored, layout.pages);

    const systems = makeSystems(scored, layout.pages, layout.systems);

    const score = scored.score({}, [...timeSigs, ...pages, ...systems, ...lines]);

    return scored.render(score, {
        voices: voices.map(Scored.parse),
        pages: [layout.currentPage],
        chordSymbols: chordSymbols.map(Scored.parse)
    });
}

/*
 * @param scored - {Scored}
 * @param pages - {List}
 * @param systems - {List}
 */
function makeSystems (scored, pages, systems) {
    let page = 0;
    let count = 1;
    return systems.map((s) => {
        const system = scored.system(Object.assign({}, s, {lineHeights: s.lineSpacing, page}));
        if (!pages[page]) {
            page++;
        } else if (count === pages[page].systems) {
            page++;
            count = 1;
        } else {
            count++;
        }
        return system;
    });
}

function makePages (scored, pages) {
    return pages.map(scored.page);
}

/*
 * @param root - the tonic of the scale.
 * @param mode - the mode of the scale.
 * @return - String representation of the key.
 */
function convertKey ({root, mode}) {
    return keys[root][mode];
}

function makeLine (scored, timeSigs, line) {
    // const key = scored.key({value: convertKey(line.keys[0]), measure: 0});

    return scored.line({voices: line.voices}, [
        ...line.clefs.map(scored.clef),
        ...line.keys.map(key => scored.key(Object.assign({}, key, {value: convertKey(key)}))),
        ...timeSigs.map(scored.clone)
    ]);
};

/*
 * @param numerator - the top time signature number.
 * @param denominator - the bottom time signature number.
 * @return String representation of the time signature.
 */
function convertTimeSig ([numerator, denominator]) {
    return `${numerator}/${denominator}`;
}
