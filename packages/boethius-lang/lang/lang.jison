/* description: Parses end executes boethius expressions. */
%{
    // types
    var NOTE = "note";
    var REST = "rest";
    var CHORD = "chord";

    var NOTES = {
        "C":  0,  "c":  0,  "b#":  0,   "B#":  0,  "Dbb": 0,   "DBB": 0, "dbb": 0, "dBB": 0,
        "C#": 1,  "c#": 1,  "Db":  1,   "db":  1,  "DB":  1,   "dB":  1,
        "D":  2,  "d":  2,  "c##": 2,   "C##": 2,  "ebb": 2,   "Ebb": 2, "eBB": 2, "EBB": 2,
        "D#": 3,  "d#": 3,  "Eb":  3,   "eb":  3,  "EB":  3,   "eB":  3,
        "E":  4,  "e":  4,  "d##": 4,   "D##": 4,  "fb":  4,   "Fb":  4, "Fb":  4, "FB":  4,
        "E#": 5,  "e#": 5,  "F":   5,   "f":   5,  "gbb": 5,   "Gbb": 5, "gBB": 5, "GBB": 5,
        "F#": 6,  "f#": 6,  "Gb":  6,   "gb":  6,  "GB":  6,   "gB":  6,
        "G":  7,  "g":  7,  "f##": 7,   "F##": 7,  "abb": 7,   "Abb": 7, "aBB": 7, "ABB": 7,
        "G#": 8,  "g#": 8,  "Ab":  8,   "ab":  8,  "AB":  8,   "aB":  8,
        "A":  9,  "a":  9,  "g##": 9,   "G##": 9,  "bbb": 9,   "Bbb": 9, "Bbb": 9, "BBB": 9,
        "A#": 10, "a#": 10, "Bb":  10,  "bb":  10, "BB":  10,  "bB":  10,
        "B":  11, "b":  11, "a##" :11,  "A##": 11, "Cb":  11,  "cb":  11, "CB": 11, "cB": 11
    };

    var NOTE_RE = /([a-gA-g][#bB]*?)([0-9]+)/;

    /*
     * @param noteString - string representing a note.
     * @return [noteString, pitchClass, octave]
     */
    function validateNoteString (noteString) {
        return noteString.match(NOTE_RE);
    }

    /*
     * @param octave - number
     * @param interval - number
     * @return midi number
     */
    function octaveNoteToMidi (octave, interval) {
        return (octave * 12) + interval + 12;
    }

    function noteInfo (noteString) {
        var validated = validateNoteString(noteString);
        var pitchClass = validated[1];
        var octave = validated[2];
        var interval = NOTES[pitchClass];
        var midi = octaveNoteToMidi(octave, interval);
        return {
            pitch: validated[0],
            pitchClass: pitchClass,
            octave: Number(octave),
            interval: interval,
            midi: midi,
            frequency: midiToHz(midi)
        }
    }

    function noteToMidi (note) {
        return noteInfo(note).midi;
    }

    function midiToHz (midi) {
        return Math.pow(2, (midi - 69) / 12) * 440;
    }

    function noteToHz (note) {
        return midiToHz(noteInfo(note).midi);
    }


    var applyProperty = function (item, prop, val) {
        if (item[prop] !== undefined) {
            return item;
        } else {
            item[prop] = val;
            return item;
        }
    }

    var toBoolean = function (string) {
        if (string === "false") {
            return false;
        } else {
            return Boolean(string);
        }
    }
%}

/* lexical grammar */
%lex
%%

\s+                   /* skip whitespace */
\(                    return 'LPAREN'
\)                    return 'RPAREN'
\<                    return 'OPENBRKT'
\>                    return 'CLOSEBRKT'
\/                    return 'FWDSLASH'
\=                    return 'EQUALS'
[a-g][b|#]{0,2}[\d]+  return 'PITCH'
r                     return 'REST'
\.+                   return 'DOTS'
true|false            return 'BOOL'
[0-9]+                return 'INTEGER'
[a-zA-Z][a-zA-Z0-9]*  return 'IDENTIFIER'
<<EOF>>               return 'EOF'
.                     return 'INVALID'

/lex

/* operator associations and precedence */

%left '+' '-'
%left '*' '/'
%left '^'
%left UMINUS

%start expressions

%% /* language grammar */

expressions:
    EOF
        {return [];}
    | list EOF
        {return $1;}
    ;

duration:
    INTEGER
        {$$ = {value: Number($1)}}
    | INTEGER DOTS
        {$$ = {value: Number($1), dots: $2.length}}
    ;

note:
    PITCH
        {
            var info = noteInfo($1);
            // default values
            info.type = NOTE;

            $$ = info;
        }
    | PITCH FWDSLASH duration
        {
            var info = noteInfo($1);
            info.type = NOTE;
            info.value = $3.value;
            info.dots = $3.dots;
            $$ = info;
        }
    ;

notelist:
    note
        {$$ = [$1]}
    | notelist note
        {$$ = $1.concat($2)}
    ;

rest:
    REST
        {$$ = {type: REST}}
    | REST FWDSLASH duration
        {$$ = {type: REST, value: $3.value, dots: $3.dots}}
    ;

chord:
    OPENBRKT notelist CLOSEBRKT
        {$$ = {type: CHORD, children: $2}}
    | OPENBRKT notelist CLOSEBRKT FWDSLASH duration
        {
            $$ = {type: CHORD, children: $2, value: $5.value, dots: $5.dots};
        }
    ;

item:
    note
        {$$ = $1}
    | rest
        {$$ = $1}
    | chord
        {$$ = $1}
    ;

ratio:
    INTEGER FWDSLASH INTEGER
        {$$ = "" + $1 + $2 + $3}
    ;

propertydef:
    IDENTIFIER EQUALS BOOL
        {$$ = {key: $1, value: toBoolean($3)}}
    | IDENTIFIER EQUALS INTEGER
        {$$ = {key: $1, value: Number($3)}}
    | IDENTIFIER EQUALS IDENTIFIER
        {$$ = {key: $1, value: $3}}
    | IDENTIFIER EQUALS ratio
        {$$ = {key: $1, value: $3}}
    ;

propscope:
    LPAREN IDENTIFIER list RPAREN
        {$$ = $3.map(function (item) {
            return applyProperty(item, $2, true);
        });}
    | LPAREN propertydef list RPAREN
        {$$ = $3.map(function (item) {return applyProperty(item, $2.key, $2.value)})}
    ;

list:
    item
        {$$ = [$1]}
    | list item
        {$$ = $1.concat($2)}
    | propscope
        {$$ = $1}
    | list propscope
        {$$ = $1.concat($2)}
    ;
