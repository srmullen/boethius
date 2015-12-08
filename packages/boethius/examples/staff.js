function run () {
    var staff = scored.staff({});
    var line1 = scored.line({}, [scored.clef({value: "treble", measure: 0}),
                                 scored.key({value: "C", measure: 0}),
                                 scored.timeSig({value: "4/4", measure: 0})]);
    var line2 = scored.line({}, [scored.clef({value: "bass", measure: 0}),
                                 scored.key({value: "C", measure: 0}),
                                 scored.timeSig({value: "4/4", measure: 0})]);
                                 
    scored.render(staff, [line1, line2]).translate(25, 50);
}
