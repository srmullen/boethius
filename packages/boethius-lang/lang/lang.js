/* parser generated by jison 0.4.17 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var lang = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,16],$V1=[1,17],$V2=[1,18],$V3=[1,14],$V4=[1,15],$V5=[1,9],$V6=[4,12,15,17,20,27,35],$V7=[4,12,15,17,20,23,27,29,35],$V8=[1,22],$V9=[1,28],$Va=[4,12,15,17,18,20,23,27,29,35],$Vb=[1,32],$Vc=[1,39],$Vd=[1,45],$Ve=[12,15,17,20,22,35],$Vf=[12,15,17,20,23,29,35],$Vg=[12,18],$Vh=[1,64];
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"expressions":3,"EOF":4,"statements":5,"float":6,"INTEGER":7,"DOTS":8,"duration":9,"FWDSLASH":10,"note":11,"PITCH":12,"notelist":13,"rest":14,"REST":15,"chord":16,"OPENBRKT":17,"CLOSEBRKT":18,"chordSymbol":19,"LPAREN":20,"CSYM":21,"IDENTIFIER":22,"RPAREN":23,"item":24,"ratio":25,"voice":26,"LBRKT":27,"list":28,"RBRKT":29,"propertydef":30,"EQUALS":31,"BOOL":32,"propertylist":33,"propscope":34,"VAR":35,"assignment":36,"statement":37,"$accept":0,"$end":1},
terminals_: {2:"error",4:"EOF",7:"INTEGER",8:"DOTS",10:"FWDSLASH",12:"PITCH",15:"REST",17:"OPENBRKT",18:"CLOSEBRKT",20:"LPAREN",21:"CSYM",22:"IDENTIFIER",23:"RPAREN",27:"LBRKT",29:"RBRKT",31:"EQUALS",32:"BOOL",35:"VAR"},
productions_: [0,[3,1],[3,2],[6,3],[9,2],[9,3],[11,1],[11,2],[13,1],[13,2],[14,1],[14,2],[16,3],[16,4],[19,5],[19,6],[19,6],[24,1],[24,1],[24,1],[24,1],[25,3],[26,4],[30,3],[30,3],[30,3],[30,3],[30,3],[33,1],[33,2],[34,4],[34,4],[34,3],[28,1],[28,2],[28,1],[28,2],[28,1],[28,2],[36,3],[37,1],[37,1],[37,1],[37,1],[5,1],[5,2]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
return {voices: yy.voices, chordSymbols: yy.chordSymbols};
break;
case 2:
return $$[$0-1];
break;
case 3:
this.$ = parseFloat($$[$0-2] + "." + $$[$0])
break;
case 4:
this.$ = {value: Number($$[$0]), dots: 0}
break;
case 5:
this.$ = {value: Number($$[$0-1]), dots: $$[$0].length}
break;
case 6:

            var props = yy.noteInfo($$[$0]);
            // default values
            this.$ = {type: NOTE, props: props};
        
break;
case 7:

            var props = yy.noteInfo($$[$0-1]);
            props.value = $$[$0].value;
            props.dots = $$[$0].dots;
            this.$ = {type: NOTE, props: props}
        
break;
case 8: case 33: case 44:
this.$ = [$$[$0]]
break;
case 9: case 34: case 38: case 45:
this.$ = $$[$0-1].concat($$[$0])
break;
case 10:
this.$ = {type: REST, props: {}}
break;
case 11:
this.$ = {type: REST, props: {value: $$[$0].value, dots: $$[$0].dots}}
break;
case 12:
this.$ = {type: CHORD, props: {}, children: $$[$0-1]}
break;
case 13:

            this.$ = {type: CHORD, children: $$[$0-2], props: {value: $$[$0].value, dots: $$[$0].dots}};
        
break;
case 14:

            var chordSymbol = {type: CHORDSYMBOL, props: {value: $$[$0-2], measure: Number($$[$0-1]), beat: 0}};
            yy.chordSymbols.push(chordSymbol);
            this.$ = chordSymbol;
        
break;
case 15: case 16:

            var chordSymbol = {type: CHORDSYMBOL, props: {value: $$[$0-3], measure: Number($$[$0-2]), beat: Number($$[$0-1])}}
            yy.chordSymbols.push(chordSymbol);
            this.$ = chordSymbol;
        
break;
case 17: case 18: case 19: case 20: case 37: case 40: case 41: case 42: case 43:
this.$ = $$[$0]
break;
case 21:
this.$ = "" + $$[$0-2] + $$[$0-1] + $$[$0]
break;
case 22:

            if (!yy.voices[$$[$0-2]]) {
                // create array for voice items
                yy.voices[$$[$0-2]] = $$[$0-1];
            } else {
                yy.voices[$$[$0-2]] = yy.voices[$$[$0-2]].concat($$[$0-1]);
            }

            this.$ = $$[$0-1];
        
break;
case 23:
this.$ = {key: $$[$0-2], value: toBoolean($$[$0])}
break;
case 24:
this.$ = {key: $$[$0-2], value: Number($$[$0])}
break;
case 25: case 26: case 27:
this.$ = {key: $$[$0-2], value: $$[$0]}
break;
case 28:

            var props = {};
            props[$$[$0].key] = $$[$0].value;
            this.$ = props;
        
break;
case 29:

            var props = {};
            props[$$[$0].key] = $$[$0].value;
            this.$ = Object.assign({}, $$[$0-1], props);
        
break;
case 30:
this.$ = $$[$0-1].map(function (item) {
            return applyProperty(item, $$[$0-2], true);
        });
break;
case 31:
this.$ = $$[$0-1].map(function (item) {
            // items properties overwrite the proplist's properties
            var props = Object.assign({}, $$[$0-2], item.props);
            // resulting props are placed on the item.
            return Object.assign({}, item, {props: props});
        });
break;
case 32:

            this.$ = $$[$0-1];
        
break;
case 35:

            var element = yy.vars[$$[$0]];
            if (!element) this.throw("Unknown variable: " + $$[$0]);
            this.$ = [].concat(element);
        
break;
case 36:

            var element = yy.vars[$$[$0]];
            if (!element) this.throw("Unknown variable: " + $$[$0]);
            this.$ = $$[$0-1].concat(element);
        
break;
case 39:

            yy.vars[$$[$0-2]] = $$[$0];
            this.$ = $$[$0];
        
break;
}
},
table: [{3:1,4:[1,2],5:3,11:10,12:$V0,14:11,15:$V1,16:12,17:$V2,19:13,20:$V3,24:6,26:8,27:$V4,34:7,35:$V5,36:5,37:4},{1:[3]},{1:[2,1]},{4:[1,19],11:10,12:$V0,14:11,15:$V1,16:12,17:$V2,19:13,20:$V3,24:6,26:8,27:$V4,34:7,35:$V5,36:5,37:20},o($V6,[2,44]),o($V6,[2,40]),o($V6,[2,41]),o($V6,[2,42]),o($V6,[2,43]),{31:[1,21]},o($V7,[2,17]),o($V7,[2,18]),o($V7,[2,19]),o($V7,[2,20]),{11:10,12:$V0,14:11,15:$V1,16:12,17:$V2,19:13,20:$V3,21:[1,25],22:$V8,24:27,28:24,30:26,33:23,34:29,35:$V9},{22:[1,30]},o($Va,[2,6],{9:31,10:$Vb}),o($V7,[2,10],{9:33,10:$Vb}),{11:35,12:$V0,13:34},{1:[2,2]},o($V6,[2,45]),{20:[1,37],34:36},{11:10,12:$V0,14:11,15:$V1,16:12,17:$V2,19:13,20:$V3,24:27,28:38,31:$Vc,34:29,35:$V9},{11:10,12:$V0,14:11,15:$V1,16:12,17:$V2,19:13,20:$V3,22:[1,42],24:27,28:40,30:41,34:29,35:$V9},{11:10,12:$V0,14:11,15:$V1,16:12,17:$V2,19:13,20:$V3,23:[1,43],24:44,34:46,35:$Vd},{22:[1,47]},o($Ve,[2,28]),o($Vf,[2,33]),o($Vf,[2,35]),o($Vf,[2,37]),{11:10,12:$V0,14:11,15:$V1,16:12,17:$V2,19:13,20:$V3,24:27,28:48,34:29,35:$V9},o($Va,[2,7]),{7:[1,49]},o($V7,[2,11]),{11:51,12:$V0,18:[1,50]},o($Vg,[2,8]),o($V6,[2,39]),{11:10,12:$V0,14:11,15:$V1,16:12,17:$V2,19:13,20:$V3,22:$V8,24:27,28:24,30:26,33:23,34:29,35:$V9},{11:10,12:$V0,14:11,15:$V1,16:12,17:$V2,19:13,20:$V3,23:[1,52],24:44,34:46,35:$Vd},{6:57,7:[1,54],22:[1,55],25:56,32:[1,53]},{11:10,12:$V0,14:11,15:$V1,16:12,17:$V2,19:13,20:$V3,23:[1,58],24:44,34:46,35:$Vd},o($Ve,[2,29]),{31:$Vc},o($V7,[2,32]),o($Vf,[2,34]),o($Vf,[2,36]),o($Vf,[2,38]),{7:[1,59]},{11:10,12:$V0,14:11,15:$V1,16:12,17:$V2,19:13,20:$V3,24:44,29:[1,60],34:46,35:$Vd},o($Va,[2,4],{8:[1,61]}),o($V7,[2,12],{9:62,10:$Vb}),o($Vg,[2,9]),o($V7,[2,30]),o($Ve,[2,23]),o($Ve,[2,24],{8:$Vh,10:[1,63]}),o($Ve,[2,25]),o($Ve,[2,26]),o($Ve,[2,27]),o($V7,[2,31]),{6:67,7:[1,66],23:[1,65]},o($V6,[2,22]),o($Va,[2,5]),o($V7,[2,13]),{7:[1,68]},{7:[1,69]},o($V7,[2,14]),{8:$Vh,23:[1,70]},{23:[1,71]},o($Ve,[2,21]),o([12,15,17,20,22,23,35],[2,3]),o($V7,[2,15]),o($V7,[2,16])],
defaultActions: {2:[2,1],19:[2,2]},
parseError: function parseError(str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        function _parseError (msg, hash) {
            this.message = msg;
            this.hash = hash;
        }
        _parseError.prototype = Error;

        throw new _parseError(str, hash);
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
        }
    }
    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);
    var ranges = lexer.options && lexer.options.ranges;
    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    _token_stack:
        var lex = function () {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        };
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};

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
/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function (match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex() {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState() {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules() {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState(n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState(condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:/* skip whitespace */
break;
case 1:/* ignore comments */
break;
case 2:/* ignore barlines */
break;
case 3:return 20
break;
case 4:return 23
break;
case 5:return 27
break;
case 6:return 29
break;
case 7:return 17
break;
case 8:return 18
break;
case 9:return 10
break;
case 10:return 31
break;
case 11:return 12
break;
case 12:return 15
break;
case 13:return 8
break;
case 14:return 32
break;
case 15:return 7
break;
case 16:return 21
break;
case 17:return 35
break;
case 18:return 22
break;
case 19:return 4
break;
case 20:return 'INVALID'
break;
}
},
rules: [/^(?:\s+)/,/^(?:;.*)/,/^(?:\|)/,/^(?:\()/,/^(?:\))/,/^(?:\[)/,/^(?:\])/,/^(?:<)/,/^(?:>)/,/^(?:\/)/,/^(?:=)/,/^(?:[a-gA-G][b|#]{0,2}[\d]+)/,/^(?:r\b)/,/^(?:\.+)/,/^(?:true|false\b)/,/^(?:[0-9]+)/,/^(?:csym\b)/,/^(?:~[a-zA-Z][a-zA-Z0-9]*)/,/^(?:[a-zA-Z][a-zA-Z0-9]*)/,/^(?:$)/,/^(?:.)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = lang;
exports.Parser = lang.Parser;
exports.parse = function () { return lang.parse.apply(lang, arguments); };
exports.main = function commonjsMain(args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}