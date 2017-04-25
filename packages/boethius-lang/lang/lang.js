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
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,19],$V1=[1,20],$V2=[1,17],$V3=[1,18],$V4=[1,14],$V5=[1,15],$V6=[1,9],$V7=[4,7,12,16,18,21,28,36],$V8=[4,7,12,16,18,21,24,28,30,36],$V9=[1,24],$Va=[1,30],$Vb=[4,7,12,16,18,19,21,24,28,30,36],$Vc=[1,34],$Vd=[4,7,10,12,16,18,19,21,24,28,30,36],$Ve=[1,41],$Vf=[1,47],$Vg=[7,12,16,18,21,23,36],$Vh=[7,12,16,18,21,24,30,36],$Vi=[7,12,19],$Vj=[1,66];
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"expressions":3,"EOF":4,"statements":5,"float":6,"INTEGER":7,"DOTS":8,"duration":9,"FWDSLASH":10,"pitch":11,"PITCHCLASS":12,"note":13,"notelist":14,"rest":15,"REST":16,"chord":17,"OPENBRKT":18,"CLOSEBRKT":19,"chordSymbol":20,"LPAREN":21,"CSYM":22,"IDENTIFIER":23,"RPAREN":24,"item":25,"ratio":26,"voice":27,"LBRKT":28,"list":29,"RBRKT":30,"propertydef":31,"EQUALS":32,"BOOL":33,"propertylist":34,"propscope":35,"VAR":36,"assignment":37,"statement":38,"$accept":0,"$end":1},
terminals_: {2:"error",4:"EOF",7:"INTEGER",8:"DOTS",10:"FWDSLASH",12:"PITCHCLASS",16:"REST",18:"OPENBRKT",19:"CLOSEBRKT",21:"LPAREN",22:"CSYM",23:"IDENTIFIER",24:"RPAREN",28:"LBRKT",30:"RBRKT",32:"EQUALS",33:"BOOL",36:"VAR"},
productions_: [0,[3,1],[3,2],[6,3],[9,2],[9,3],[11,1],[11,1],[13,1],[13,2],[14,1],[14,2],[15,1],[15,2],[17,3],[17,4],[20,5],[20,6],[20,6],[25,1],[25,1],[25,1],[25,1],[26,3],[27,4],[31,3],[31,3],[31,3],[31,3],[31,3],[34,1],[34,2],[35,4],[35,4],[35,3],[29,1],[29,2],[29,1],[29,2],[29,1],[29,2],[37,3],[38,1],[38,1],[38,1],[38,1],[5,1],[5,2]],
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
this.$ = {midi: Number($$[$0])};
break;
case 7:
this.$ = yy.parsePitch($$[$0]);
break;
case 8:

            // default values
            this.$ = new yy.NoteNode($$[$0]);
        
break;
case 9:

            this.$ = new yy.NoteNode(Object.assign({}, $$[$0-1], $$[$0]));
        
break;
case 10: case 35: case 46:
this.$ = [$$[$0]]
break;
case 11: case 36: case 40: case 47:
this.$ = $$[$0-1].concat($$[$0])
break;
case 12:
this.$ = new yy.RestNode({});
break;
case 13:
this.$ = new yy.RestNode({value: $$[$0].value, dots: $$[$0].dots});
break;
case 14:
this.$ = new yy.ChordNode({}, $$[$0-1]);
break;
case 15:

            /*this.$ = {type: CHORD, children: $$[$0-2], props: {value: $$[$0].value, dots: $$[$0].dots}};*/
            this.$ = new yy.ChordNode({value: $$[$0].value, dots: $$[$0].dots}, $$[$0-2]);
        
break;
case 16:

            var chordSymbol = {type: CHORDSYMBOL, props: {value: $$[$0-2], measure: Number($$[$0-1]), beat: 0}};
            yy.chordSymbols.push(chordSymbol);
            this.$ = chordSymbol;
        
break;
case 17: case 18:

            var chordSymbol = {type: CHORDSYMBOL, props: {value: $$[$0-3], measure: Number($$[$0-2]), beat: Number($$[$0-1])}}
            yy.chordSymbols.push(chordSymbol);
            this.$ = chordSymbol;
        
break;
case 19: case 20: case 21: case 22: case 39: case 42: case 43: case 44: case 45:
this.$ = $$[$0]
break;
case 23:
this.$ = "" + $$[$0-2] + $$[$0-1] + $$[$0]
break;
case 24:

            /*var expantion = $$[$0-1].map(function (item) {
                return item.expand();
            });*/

            if (!yy.voices[$$[$0-2]]) {
                // create array for voice items
                yy.voices[$$[$0-2]] = $$[$0-1];
            } else {
                yy.voices[$$[$0-2]] = yy.voices[$$[$0-2]].concat($$[$0-1]);
            }

            this.$ = $$[$0-1];
        
break;
case 25:
this.$ = {key: $$[$0-2], value: toBoolean($$[$0])}
break;
case 26:
this.$ = {key: $$[$0-2], value: Number($$[$0])}
break;
case 27: case 28: case 29:
this.$ = {key: $$[$0-2], value: $$[$0]}
break;
case 30:

            var props = {};
            props[$$[$0].key] = $$[$0].value;
            this.$ = props;
        
break;
case 31:

            var props = {};
            props[$$[$0].key] = $$[$0].value;
            this.$ = Object.assign({}, $$[$0-1], props);
        
break;
case 32:
this.$ = $$[$0-1].map(function (item) {
            var props = {};
            props[$$[$0-2]] = true;
            return clone(item, props);
        });
break;
case 33:
this.$ = $$[$0-1].map(function (item) {
            // items properties overwrite the proplist's properties
            var props = Object.assign({}, $$[$0-2], item.props);
            // resulting props are placed on the item.
            return item.clone(props);
        });
break;
case 34:

            this.$ = $$[$0-1];
        
break;
case 37:

            var element = yy.vars[$$[$0]];
            if (!element) throw new Error(errors.unitializedVar($$[$0], this));
            this.$ = [].concat(element.reduce(function (acc, el) {
                return acc.concat(clone(el));
            }, []));
        
break;
case 38:

            var element = yy.vars[$$[$0]];
            if (!element) throw new Error(errors.unitializedVar($$[$0], this));
            this.$ = $$[$0-1].concat(element.reduce(function (acc, el) {
                return acc.concat(clone(el));
            }, []));
        
break;
case 41:

            yy.vars[$$[$0-2]] = $$[$0];
            this.$ = $$[$0];
        
break;
}
},
table: [{3:1,4:[1,2],5:3,7:$V0,11:16,12:$V1,13:10,15:11,16:$V2,17:12,18:$V3,20:13,21:$V4,25:6,27:8,28:$V5,35:7,36:$V6,37:5,38:4},{1:[3]},{1:[2,1]},{4:[1,21],7:$V0,11:16,12:$V1,13:10,15:11,16:$V2,17:12,18:$V3,20:13,21:$V4,25:6,27:8,28:$V5,35:7,36:$V6,37:5,38:22},o($V7,[2,46]),o($V7,[2,42]),o($V7,[2,43]),o($V7,[2,44]),o($V7,[2,45]),{32:[1,23]},o($V8,[2,19]),o($V8,[2,20]),o($V8,[2,21]),o($V8,[2,22]),{7:$V0,11:16,12:$V1,13:10,15:11,16:$V2,17:12,18:$V3,20:13,21:$V4,22:[1,27],23:$V9,25:29,29:26,31:28,34:25,35:31,36:$Va},{23:[1,32]},o($Vb,[2,8],{9:33,10:$Vc}),o($V8,[2,12],{9:35,10:$Vc}),{7:$V0,11:16,12:$V1,13:37,14:36},o($Vd,[2,6]),o($Vd,[2,7]),{1:[2,2]},o($V7,[2,47]),{21:[1,39],35:38},{7:$V0,11:16,12:$V1,13:10,15:11,16:$V2,17:12,18:$V3,20:13,21:$V4,25:29,29:40,32:$Ve,35:31,36:$Va},{7:$V0,11:16,12:$V1,13:10,15:11,16:$V2,17:12,18:$V3,20:13,21:$V4,23:[1,44],25:29,29:42,31:43,35:31,36:$Va},{7:$V0,11:16,12:$V1,13:10,15:11,16:$V2,17:12,18:$V3,20:13,21:$V4,24:[1,45],25:46,35:48,36:$Vf},{23:[1,49]},o($Vg,[2,30]),o($Vh,[2,35]),o($Vh,[2,37]),o($Vh,[2,39]),{7:$V0,11:16,12:$V1,13:10,15:11,16:$V2,17:12,18:$V3,20:13,21:$V4,25:29,29:50,35:31,36:$Va},o($Vb,[2,9]),{7:[1,51]},o($V8,[2,13]),{7:$V0,11:16,12:$V1,13:53,19:[1,52]},o($Vi,[2,10]),o($V7,[2,41]),{7:$V0,11:16,12:$V1,13:10,15:11,16:$V2,17:12,18:$V3,20:13,21:$V4,23:$V9,25:29,29:26,31:28,34:25,35:31,36:$Va},{7:$V0,11:16,12:$V1,13:10,15:11,16:$V2,17:12,18:$V3,20:13,21:$V4,24:[1,54],25:46,35:48,36:$Vf},{6:59,7:[1,56],23:[1,57],26:58,33:[1,55]},{7:$V0,11:16,12:$V1,13:10,15:11,16:$V2,17:12,18:$V3,20:13,21:$V4,24:[1,60],25:46,35:48,36:$Vf},o($Vg,[2,31]),{32:$Ve},o($V8,[2,34]),o($Vh,[2,36]),o($Vh,[2,38]),o($Vh,[2,40]),{7:[1,61]},{7:$V0,11:16,12:$V1,13:10,15:11,16:$V2,17:12,18:$V3,20:13,21:$V4,25:46,30:[1,62],35:48,36:$Vf},o($Vb,[2,4],{8:[1,63]}),o($V8,[2,14],{9:64,10:$Vc}),o($Vi,[2,11]),o($V8,[2,32]),o($Vg,[2,25]),o($Vg,[2,26],{8:$Vj,10:[1,65]}),o($Vg,[2,27]),o($Vg,[2,28]),o($Vg,[2,29]),o($V8,[2,33]),{6:69,7:[1,68],24:[1,67]},o($V7,[2,24]),o($Vb,[2,5]),o($V8,[2,15]),{7:[1,70]},{7:[1,71]},o($V8,[2,16]),{8:$Vj,24:[1,72]},{24:[1,73]},o($Vg,[2,23]),o([7,12,16,18,21,23,24,36],[2,3]),o($V8,[2,17]),o($V8,[2,18])],
defaultActions: {2:[2,1],21:[2,2]},
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

    var CHORDSYMBOL = "chordSymbol";

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

    ScopeNode.prototype.clone = function () {

    };

    function clone (el, props) {
        if (el instanceof Array) {
            return el.map(function (item) {
                return clone(item, props);
            });
        } else {
            return el.clone(props);
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
case 3:return 21
break;
case 4:return 24
break;
case 5:return 28
break;
case 6:return 30
break;
case 7:return 18
break;
case 8:return 19
break;
case 9:return 10
break;
case 10:return 32
break;
case 11:return 16
break;
case 12:return 8
break;
case 13:return 33
break;
case 14:return 7
break;
case 15:return 22
break;
case 16:return 12
break;
case 17:return 36
break;
case 18:return 23
break;
case 19:return 4
break;
case 20:return 'INVALID'
break;
}
},
rules: [/^(?:\s+)/,/^(?:;.*)/,/^(?:\|)/,/^(?:\()/,/^(?:\))/,/^(?:\[)/,/^(?:\])/,/^(?:<)/,/^(?:>)/,/^(?:\/)/,/^(?:=)/,/^(?:r\b)/,/^(?:\.+)/,/^(?:true|false\b)/,/^(?:[0-9]+)/,/^(?:csym\b)/,/^(?:[a-gA-G][b|#]{0,2}(?![a-zA-Z])([0-9]+)?)/,/^(?:~[a-zA-Z][a-zA-Z0-9]*)/,/^(?:[a-zA-Z][a-zA-Z0-9]*)/,/^(?:$)/,/^(?:.)/],
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