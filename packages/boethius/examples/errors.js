var examples = {
    testSystemLength () {
        var n = scored.note;
        var c = scored.chord;
        var r = scored.rest;

        var l1 = scored.line({voices: ["v1"]}, [
            scored.clef({value: "treble", measure: 0}), scored.key({value: "C", measure: 0}), scored.timeSig({value: "4/4", measure: 0}),
        ]);
        var v1 = scored.voice({name: "v1"}, [
            r({value: 2}), n({value: 1}),
            r({value: 4}), n({value: 1})
        ]);

        var l2 = scored.line({voices: ["v2"]}, [
            scored.clef({value: "treble", measure: 0}), scored.key({value: "C", measure: 0}), scored.timeSig({value: "4/4", measure: 0}),
        ]);
        var v2 = scored.voice({name: "v2"}, [
            r({value: 2}), r({value: 4}), n({value: 2}),
            r({value: 4}), r({value: 8}), n({value: 2})
        ]);

        var page0 = scored.page();
        var fourfour = scored.timeSig({value: "4/4", measure: 0});
        var system1 = scored.system({measures: 4, length: 500});
        var system2 = scored.system({measures: 4, length: 750});
        var system3 = scored.system({measures: 4}); // gets length of score.

        var score = scored.score({length: 1000}, [fourfour, page0, system1, system2, system3, l1, l2]);

        // render it all as a score.
        return scored.render(score, {
            voices: [v1, v2],
            pages: [0]
        });
    }
};

function createSelect () {
    var select = document.createElement("select");

    for (k in examples) {
        var option = document.createElement("option");
        option.innerHTML = k;
        option.value = k;
        select.appendChild(option);
    }

    document.getElementById("exampleList").appendChild(select);

    return select;
}

function run () {
    var select = createSelect();
    var example = window.location.hash.slice(1) ? window.location.hash.slice(1) : Object.keys(examples)[0];
    var score = examples[example]().translate(25, 50);

    select.onchange = function (e) {
        var example = e.target.value;
        window.location.hash = example;
        if (score) score.remove();
        score = examples[example]().translate(25, 50);
    };
}
