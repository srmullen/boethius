/* description: Parses end executes boethius expressions. */
%{
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
        {$$ = {type: "note", pitch: $1}}
    | PITCH FWDSLASH duration
        {$$ = {type: "note", pitch: $1, value: $3.value, dots: $3.dots}}
    ;

notelist:
    note
        {$$ = [$1]}
    | notelist note
        {$$ = $1.concat($2)}
    ;

rest:
    REST
        {$$ = {type: "rest"}}
    | REST FWDSLASH duration
        {$$ = {type: "rest", value: $3.value, dots: $3.dots}}
    ;

chord:
    OPENBRKT notelist CLOSEBRKT
        {$$ = {type: "chord", children: $2}}
    | OPENBRKT notelist CLOSEBRKT FWDSLASH duration
        {$$ = {type: "chord", children: $2, value: $5.value, dots: $5.dots}}
    ;

item:
    note
        {$$ = $1}
    | rest
        {$$ = $1}
    | chord
        {$$ = $1}
    ;

propscope:
    LPAREN IDENTIFIER list RPAREN
        {$$ = $3.map(function (item) {
            return applyProperty(item, $2, true);
        });}
    | LPAREN IDENTIFIER EQUALS BOOL list RPAREN
        {$$ = $5.map(function (item) {return applyProperty(item, $2, toBoolean($4))})}
    | LPAREN IDENTIFIER EQUALS INTEGER list RPAREN
        {$$ = $5.map(function (item) {return applyProperty(item, $2, Number($4))})}
    | LPAREN IDENTIFIER EQUALS IDENTIFIER list RPAREN
        {$$ = $5.map(function (item) {return applyProperty(item, $2, $4)});}
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
