/* description: Parses end executes boethius expressions. */
%{
    var toBoolean = function (string) {
        if (string === "false") {
            return false;
        } else {
            return Boolean(string);
        }
    }

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

\s+                                                 /* skip whitespace */
\;.*                                                /* ignore comments */
\|                                                  /* ignore barlines */
\(                                                  return 'LPAREN'
\)                                                  return 'RPAREN'
\[                                                  return 'LBRKT'
\]                                                  return 'RBRKT'
\{                                                  return 'LCURL'
\}                                                  return 'RCURL'
\<                                                  return 'OPENBRKT'
\>                                                  return 'CLOSEBRKT'
\/                                                  return 'FWDSLASH'
\=                                                  return 'EQUALS'
\:                                                  return 'COLON'
r                                                   return 'REST'
\.+                                                 return 'DOTS'
\"(.*?)\"                                           yytext = yytext.substr(1,yyleng-2); return 'STRING'
true|false                                          return 'BOOL'
[0-9]+                                              return 'INTEGER'
(csym|layout|timesig|page|system|line|clef|key)\s   return 'BUILTIN'
[a-gA-G][b|#]{0,2}(?![a-zA-Z])([0-9]+)?             return 'PITCHCLASS'
\~[a-zA-Z][a-zA-Z0-9\-]*                            return 'VAR'
[a-zA-Z][a-zA-Z0-9]*                                return 'IDENTIFIER'
<<EOF>>                                             return 'EOF'
.                                                   return 'INVALID'

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
    | STRING
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
            var list = $3.reduce((acc, item) => {
                var json = item.serialize();
                return acc.concat(json);
            }, []);
            if (!yy.voices[$2]) {
                // create array for voice items
                yy.voices[$2] = list;
            } else {
                yy.voices[$2] = yy.voices[$2].concat(list);
            }

            $$ = $3;
        }
    ;

assignment:
    IDENTIFIER EQUALS STRING
        {$$ = {key: $1, value: $3}}
    | IDENTIFIER EQUALS BOOL
        {$$ = {key: $1, value: toBoolean($3)}}
    | IDENTIFIER EQUALS IDENTIFIER
        {$$ = {key: $1, value: $3}}
    | IDENTIFIER EQUALS ratio
        {$$ = {key: $1, value: $3}}
    | IDENTIFIER EQUALS number
        {$$ = {key: $1, value: $3.value}}
    | IDENTIFIER EQUALS scope
        {$$ = {key: $1, value: $3}}
    | IDENTIFIER EQUALS properties
        {$$ = {key: $1, value: $3}}
    ;

propertylist:
    IDENTIFIER
        {
            var props = {};
            props[$1] = true;
            $$ = props;
        }
    | assignment
        {
            var props = {};
            props[$1.key] = $1.value;
            $$ = props;
        }
    | propertylist IDENTIFIER
        {
            var props = {};
            props[$2] = true;
            $$ = Object.assign({}, $1, props);
        }
    | propertylist assignment
        {
            var props = {};
            props[$2.key] = $2.value;
            $$ = Object.assign({}, $1, props);
        }
    ;

properties:
    LCURL propertylist RCURL
        {$$ = $2}
    ;

scope:
    LPAREN IDENTIFIER list RPAREN
        {
            var props = {};
            props[$2] = true;
            $$ = new yy.ScopeNode(props, $3);
        }
    | LPAREN assignment list RPAREN
        {
            var props = {};
            props[$2.key] = $2.value;
            $$ = new yy.ScopeNode(props, $3);
        }
    | LPAREN properties list RPAREN
        {
            var props = Object.assign({}, $2);
            $$ = new yy.ScopeNode(props, $3);
        }
    | LPAREN list RPAREN
        {
            // $$ = $2;
            $$ = new yy.ScopeNode({}, $2);
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
    | scope
        {$$ = [$1]}
    | list scope
        {$$ = $1.concat($2)}
    ;

tassignment:
    VAR EQUALS scope
        {
            yy.vars[$1] = [$3];
            $$ = $3;
        }
    ;

statement:
    assignment
        {$$ = $1}
    | tassignment
        {$$ = $1}
    | item
        {$$ = $1}
    | scope
        {$$ = $1.execute()}
    | voice
        {$$ = $1}
    ;

statements:
    statement
        {$$ = [$1]}
    | statements statement
        {$$ = $1.concat($2)}
    ;
