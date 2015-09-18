var mirrorConfig = {
        mode: 'application/json',
        theme: 'neo',
        lineNumbers: true,
        styleActiveLine: true,
        matchbrackets:true
    },
    layoutMirror = CodeMirror(document.querySelector('.codemirror-layout'), mirrorConfig),
    musicMirror = CodeMirror(document.querySelector('.codemirror-music'), mirrorConfig),
    compositionMirror = CodeMirror(document.querySelector('.codemirror-composition'), mirrorConfig),
    // layoutChangeStream = Rx.Observable.fromEvent(layoutMirror, "change"),
    // musicChangeStream = Rx.Observable.fromEvent(musicMirror, "change"),
    scored = new Scored();

function isValidJSON (json) {
    try {
        JSON.parse(json);
    } catch (e) {
        return false;
    }
    return true;
}

function isRenderable (item) {
    return !!item.render;
}

var layoutChangeStream = Rx.Observable.fromEvent(layoutMirror, "change").map(function (event) {
        return event.getValue();
    }).filter(isValidJSON).map(function (json) {
        return JSON.parse(json);
    }).map(function (layout) {
        return scored.layout(layout);
    }).startWith([]),

    musicChangeStream = Rx.Observable.fromEvent(musicMirror, "change").map(function (event) {
        return event.getValue();
    }).filter(isValidJSON).map(function (json) {
        return JSON.parse(json);
    }).map(function (music) {
        return scored.createEvents(music);
    }).startWith([]);

scored.setup(document.querySelector("canvas"));

paper.view.center = paper.view.center.subtract([50, 50]);

var compositionStream = Rx.Observable.combineLatest(layoutChangeStream, musicChangeStream, function (layout, music) {
    try {
        var composition = scored.compose(layout, music);
        return composition;
    } catch (e) {
        console.log(e);
    }
});

compositionStream.subscribe(function (composition) {
    compositionMirror.setValue(JSON.stringify(composition, null, 2));
    if (composition.render) {
        try {
            var group = scored.render(composition);
        } catch (e) {
            console.log(e);
        }
        console.log(group);
    }
});

// musicChangeStream.map(function (event) {
//     return event.getValue();
// }).filter(isValidJSON).map(function (val) {
//     try {
//         return scored.layout(JSON.parse(val));
//     } catch (e) {
//         console.log(e);
//         scored.destroy();
//     }
// }).filter(isRenderable).subscribe(function (layout) {
//     try {
//         var view = scored.render(layout);
//         console.log(view);
//     } catch (e) {
//         console.log(e);
//         scored.destroy();
//     }
// });
