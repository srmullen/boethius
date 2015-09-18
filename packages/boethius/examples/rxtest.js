Rx.config.longStackSupport = true;

var mirrorConfig = {
        mode: 'application/json',
        theme: 'neo',
        lineNumbers: true,
        styleActiveLine: true,
        matchbrackets:true
    },
    layoutmirror = CodeMirror(document.querySelector('.codemirror-layout'), mirrorConfig),
    musicmirror = CodeMirror(document.querySelector('.codemirror-music'), mirrorConfig);
    scoremirror = CodeMirror(document.querySelector(".layout-structure"), {
        mode: 'application/json',
        theme: 'neo',
        lineNumbers: true,
        styleActiveLine: true,
        readOnly: true
    }),
    notesmirror = CodeMirror(document.querySelector(".music-structure"), {
        mode: 'application/json',
        theme: 'neo',
        lineNumbers: true,
        styleActiveLine: true,
        readOnly: true
    });

var scored = new Scored();

function isValidJSON (json) {
    try {
        JSON.parse(json);
    } catch (e) {
        return false;
    }
    return true;
}

var layoutChangeStream = Rx.Observable.fromEvent(layoutmirror, "change").map(function (event) {
        return event.getValue();
    }).filter(isValidJSON).map(function (json) {
        return JSON.parse(json);
    }).startWith([]),
    musicChangeStream = Rx.Observable.fromEvent(musicmirror, "change").map(function (event) {
        return event.getValue();
    }).filter(isValidJSON).map(function (json) {
        return JSON.parse(json);
    }).startWith([]);

var scoreStream = Rx.Observable.combineLatest(layoutChangeStream, musicChangeStream, function (layout, music) {
    try {
        var score = scored.layout(layout);
        return score;
    } catch (e) {
        console.log(e);
    }
});

var musicStream = musicChangeStream.map(function (music) {
    return scored.createEvents(music);
});

scoreStream.subscribe(function (score) {
    scoremirror.setValue(JSON.stringify(score, null, 2));
});

musicStream.subscribe(function (music) {
    notesmirror.setValue(JSON.stringify(music, null, 2));
});
