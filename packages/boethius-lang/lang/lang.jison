/* description: Parses end executes boethius expressions. */
%{
    // types
    var NOTE = "note";
    var REST = "rest";
    var CHORD = "chord";
    var CHORDSYMBOL = "chordSymbol";

    var applyProperty = function (item, prop, val) {
        if (item.props[prop] !== undefined) {
            return item;
        } else {
            item.props[prop] = val;
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

\s+                      /* skip whitespace */
\;.*                     /* ignore comments */
\|                       /* ignore barlines */
\(                       return 'LPAREN'
\)                       return 'RPAREN'
\[                       return 'LBRKT'
\]                       return 'RBRKT'
\<                       return 'OPENBRKT'
\>                       return 'CLOSEBRKT'
\/                       return 'FWDSLASH'
\=                       return 'EQUALS'
[a-gA-G][b|#]{0,2}[\d]+  return 'PITCH'
r                        return 'REST'
\.+                      return 'DOTS'
true|false               return 'BOOL'
[0-9]+                   return 'INTEGER'
/*voice                    return 'VOICE'*/
csym                     return 'CSYM'
[a-zA-Z][a-zA-Z0-9]*     return 'IDENTIFIER'
<<EOF>>                  return 'EOF'
.                        return 'INVALID'

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
        {return {voices: yy.voices, chordSymbols: yy.chordSymbols};}
    | statements EOF
        {return $1;}
    ;

float:
    INTEGER DOTS INTEGER
        {$$ = parseFloat($1 + "." + $3)}
    ;

duration:
    FWDSLASH INTEGER
        {$$ = {value: Number($2), dots: 0}}
    | FWDSLASH INTEGER DOTS
        {$$ = {value: Number($2), dots: $3.length}}
    ;

note:
    PITCH
        {
            var props = yy.noteInfo($1);
            // default values
            $$ = {type: NOTE, props: props};
        }
    | PITCH duration
        {
            var props = yy.noteInfo($1);
            props.value = $2.value;
            props.dots = $2.dots;
            $$ = {type: NOTE, props: props}
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
        {$$ = {type: REST, props: {}}}
    | REST duration
        {$$ = {type: REST, props: {value: $2.value, dots: $2.dots}}}
    ;

chord:
    OPENBRKT notelist CLOSEBRKT
        {$$ = {type: CHORD, props: {}, children: $2}}
    | OPENBRKT notelist CLOSEBRKT duration
        {
            $$ = {type: CHORD, children: $2, props: {value: $4.value, dots: $4.dots}};
        }
    ;

chordSymbol:
    LPAREN CSYM IDENTIFIER INTEGER RPAREN
        {
            var chordSymbol = {type: CHORDSYMBOL, props: {value: $3, measure: Number($4), beat: 0}};
            yy.chordSymbols.push(chordSymbol);
            $$ = chordSymbol;
        }
    | LPAREN CSYM IDENTIFIER INTEGER INTEGER RPAREN
        {
            var chordSymbol = {type: CHORDSYMBOL, props: {value: $3, measure: Number($4), beat: Number($5)}}
            yy.chordSymbols.push(chordSymbol);
            $$ = chordSymbol;
        }
    | LPAREN CSYM IDENTIFIER INTEGER float RPAREN
        {
            var chordSymbol = {type: CHORDSYMBOL, props: {value: $3, measure: Number($4), beat: Number($5)}}
            yy.chordSymbols.push(chordSymbol);
            $$ = chordSymbol;
        }
    ;

item:
    note
        {$$ = $1}
    | rest
        {$$ = $1}
    | chord
        {$$ = $1}
    | chordSymbol
        {$$ = $1}
    ;

ratio:
    INTEGER FWDSLASH INTEGER
        {$$ = "" + $1 + $2 + $3}
    ;

voice:
    LBRKT IDENTIFIER list RBRKT
        {
            if (!yy.voices[$2]) {
                // create array for voice items
                yy.voices[$2] = $3;
            } else {
                yy.voices[$2] = yy.voices[$2].concat($3);
            }

            $$ = $3;
        }
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
    | IDENTIFIER EQUALS float
        {$$ = {key: $1, value: $3}}
    ;

propertylist:
    propertydef
        {
            var props = {};
            props[$1.key] = $1.value;
            $$ = props;
        }
    | propertylist propertydef
        {
            var props = {};
            props[$2.key] = $2.value;
            $$ = Object.assign({}, $1, props);
        }
    ;

propscope:
    LPAREN IDENTIFIER list RPAREN
        {$$ = $3.map(function (item) {
            return applyProperty(item, $2, true);
        });}
    | LPAREN propertylist list RPAREN
        {$$ = $3.map(function (item) {
            // items properties overwrite the proplist's properties
            var props = Object.assign({}, $2, item.props);
            // resulting props are placed on the item.
            return Object.assign({}, item, {props: props});
        });}
    | LPAREN list RPAREN
        {
            $$ = $2;
        }
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

assignment:
    IDENTIFIER EQUALS propscope
        {
            yy.vars[$1] = $3;
            $$ = $3;
        }
    ;

statement:
    assignment
        {$$ = $1}
    | item
        {$$ = $1}
    | propscope
        {$$ = $1}
    | voice
        {$$ = $1}
    ;

statements:
    statement
        {$$ = [$1]}
    | statements statement
        {$$ = $1.concat($2)}
    ;
