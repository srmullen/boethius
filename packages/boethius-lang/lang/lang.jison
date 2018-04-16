/* description: Parses end executes boethius expressions. */
%{
    var toBoolean = function (string) {
        if (string === "false") {
            return false;
        } else {
            return Boolean(string);
        }
    }

    function ScopeNode (props, list) {
        this.props = props;
        this.list = list;
    }

    ScopeNode.prototype.set = function () {

    };

    function set (el, props) {
        if (el instanceof Array) {
            return el.map(function (item) {
                return set(item, props);
            });
        } else {
            return el.set(props);
        }
    }

    var errors = {
        unitializedVar: function (variable, self) {
            return (
                "Uninitialized variable: " + variable +
                ". Line: " + self._$.first_line + "-" + self._$.last_line +
                ", Column: " + self._$.first_column + "-" + self._$.last_column + "."
            );
        }
    };
%}

/* lexical grammar */

%lex
%%

\s+                                        /* skip whitespace */
\;.*                                       /* ignore comments */
\|                                         /* ignore barlines */
\(                                         return 'LPAREN'
\)                                         return 'RPAREN'
\[                                         return 'LBRKT'
\]                                         return 'RBRKT'
\<                                         return 'OPENBRKT'
\>                                         return 'CLOSEBRKT'
\/                                         return 'FWDSLASH'
\=                                         return 'EQUALS'
\:                                         return 'COLON'
r                                          return 'REST'
\.+                                        return 'DOTS'
true|false                                 return 'BOOL'
[0-9]+                                     return 'INTEGER'
(csym|timesig|system|line|clef|key)\s      return 'BUILTIN'
[a-gA-G][b|#]{0,2}(?![a-zA-Z])([0-9]+)?    return 'PITCHCLASS'
/*[a-gA-G][b|#]{0,2}([0-9]+)?     return 'PITCHCLASS'*/
\~[a-zA-Z][a-zA-Z0-9]*                     return 'VAR'
[a-zA-Z][a-zA-Z0-9]*                       return 'IDENTIFIER'
<<EOF>>                                    return 'EOF'
.                                          return 'INVALID'

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
        {
            return {voices: yy.voices, chordSymbols: yy.chordSymbols, layout: yy.layout};
        }
    | statements EOF
        {return $1;}
    ;

float:
    INTEGER DOTS INTEGER
        {$$ = parseFloat($1 + "." + $3)}
    ;

number:
    INTEGER
        {$$ = new yy.NumberNode($1)}
    | float
        {$$ = new yy.NumberNode($1)}
    ;

duration:
    FWDSLASH INTEGER
        {$$ = {value: Number($2), dots: 0}}
    | FWDSLASH INTEGER DOTS
        {$$ = {value: Number($2), dots: $3.length}}
    ;

pitch:
    PITCHCLASS
        {$$ = yy.parsePitch($1);}
    ;

keyword:
    COLON IDENTIFIER
        {$$ = new yy.Keyword($2)}
    | COLON PITCHCLASS
        {$$ = new yy.Keyword($2)}
    ;

note:
    pitch
        {
            // default values
            $$ = new yy.NoteNode($1);
        }
    | pitch duration
        {
            $$ = new yy.NoteNode(Object.assign({}, $1, $2));
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
        {$$ = new yy.RestNode({});}
    | REST duration
        {$$ = new yy.RestNode({value: $2.value, dots: $2.dots});}
    ;

chord:
    OPENBRKT notelist CLOSEBRKT
        {$$ = new yy.ChordNode({}, $2);}
    | OPENBRKT notelist CLOSEBRKT duration
        {
            /*$$ = {type: CHORD, children: $2, props: {value: $4.value, dots: $4.dots}};*/
            $$ = new yy.ChordNode({value: $4.value, dots: $4.dots}, $2);
        }
    ;

builtin:
    LPAREN BUILTIN list RPAREN
        {
            $$ = yy.BUILTINS[$2.trim()](yy, $3);
        }
    ;

item:
    number
        {$$ = $1}
    | keyword
        {$$ = $1}
    | note
        {$$ = $1}
    | rest
        {$$ = $1}
    | chord
        {$$ = $1}
    | builtin
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
            var props = {};
            props[$2] = true;
            return set(item, props);
        });}
    | LPAREN propertylist list RPAREN
        {$$ = $3.map(function (item) {
            // items properties overwrite the proplist's properties
            var props = Object.assign({}, $2, item.props);
            // resulting props are placed on the item.
            return item.set(props);
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
    | VAR
        {
            var element = yy.vars[$1];
            if (!element) throw new Error(errors.unitializedVar($1, this));
            $$ = [].concat(element.reduce(function (acc, el) {
                return acc.concat(set(el));
            }, []));
        }
    | list VAR
        {
            var element = yy.vars[$2];
            if (!element) throw new Error(errors.unitializedVar($2, this));
            $$ = $1.concat(element.reduce(function (acc, el) {
                return acc.concat(set(el));
            }, []));
        }
    | propscope
        {$$ = $1}
    | list propscope
        {$$ = $1.concat($2)}
    ;

assignment:
    VAR EQUALS propscope
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
