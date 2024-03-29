/* parser generated by jison 0.4.18 */
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
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,20],$V1=[1,26],$V2=[1,22],$V3=[1,10],$V4=[1,24],$V5=[1,25],$V6=[1,13],$V7=[1,19],$V8=[1,18],$V9=[1,11],$Va=[4,7,13,15,16,20,22,25,28,39,41],$Vb=[1,29],$Vc=[4,7,13,15,16,20,22,25,28,30,39,40,41],$Vd=[1,35],$Ve=[1,37],$Vf=[2,4],$Vg=[1,40],$Vh=[4,7,13,15,16,20,22,25,28,30,38,39,40,41],$Vi=[4,7,13,15,16,20,22,23,25,28,30,39,40,41],$Vj=[1,44],$Vk=[1,62],$Vl=[7,13,15,20,22,25,30,39,40,41],$Vm=[13,23],$Vn=[4,7,13,15,16,20,22,25,28,38,39,41],$Vo=[16,38];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"expressions":3,"EOF":4,"statements":5,"float":6,"INTEGER":7,"DOTS":8,"number":9,"duration":10,"FWDSLASH":11,"pitch":12,"PITCHCLASS":13,"keyword":14,"COLON":15,"IDENTIFIER":16,"note":17,"notelist":18,"rest":19,"REST":20,"chord":21,"OPENBRKT":22,"CLOSEBRKT":23,"item":24,"STRING":25,"ratio":26,"voice":27,"LBRKT":28,"list":29,"RBRKT":30,"assignment":31,"EQUALS":32,"BOOL":33,"scope":34,"properties":35,"propertylist":36,"LCURL":37,"RCURL":38,"LPAREN":39,"RPAREN":40,"VAR":41,"tassignment":42,"statement":43,"$accept":0,"$end":1},
terminals_: {2:"error",4:"EOF",7:"INTEGER",8:"DOTS",11:"FWDSLASH",13:"PITCHCLASS",15:"COLON",16:"IDENTIFIER",20:"REST",22:"OPENBRKT",23:"CLOSEBRKT",25:"STRING",28:"LBRKT",30:"RBRKT",32:"EQUALS",33:"BOOL",37:"LCURL",38:"RCURL",39:"LPAREN",40:"RPAREN",41:"VAR"},
productions_: [0,[3,1],[3,2],[6,3],[9,1],[9,1],[10,2],[10,3],[12,1],[14,2],[14,2],[17,1],[17,2],[18,1],[18,2],[19,1],[19,2],[21,3],[21,4],[24,1],[24,1],[24,1],[24,1],[24,1],[24,1],[26,3],[27,4],[31,3],[31,3],[31,3],[31,3],[31,3],[31,3],[31,3],[36,1],[36,1],[36,2],[36,2],[35,3],[34,4],[34,4],[34,4],[34,3],[29,1],[29,2],[29,1],[29,2],[29,1],[29,2],[42,3],[43,1],[43,1],[43,1],[43,1],[43,1],[5,1],[5,2]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:

            return {voices: yy.voices, chordSymbols: yy.chordSymbols, layout: yy.layout};
        
break;
case 2:
return $$[$0-1];
break;
case 3:
this.$ = parseFloat($$[$0-2] + "." + $$[$0])
break;
case 4: case 5:
this.$ = new yy.NumberNode($$[$0])
break;
case 6:
this.$ = {value: Number($$[$0]), dots: 0}
break;
case 7:
this.$ = {value: Number($$[$0-1]), dots: $$[$0].length}
break;
case 8:
this.$ = yy.parsePitch($$[$0], yy.currentKey);
break;
case 9: case 10:
this.$ = new yy.Keyword($$[$0])
break;
case 11:

            // default values
            this.$ = new yy.NoteNode($$[$0]);
        
break;
case 12:

            this.$ = new yy.NoteNode(Object.assign({}, $$[$0-1], $$[$0]));
        
break;
case 13: case 43: case 47: case 55:
this.$ = [$$[$0]]
break;
case 14: case 44: case 48: case 56:
this.$ = $$[$0-1].concat($$[$0])
break;
case 15:
this.$ = new yy.RestNode({});
break;
case 16:
this.$ = new yy.RestNode({value: $$[$0].value, dots: $$[$0].dots});
break;
case 17:
this.$ = new yy.ChordNode({}, $$[$0-1]);
break;
case 18:

            this.$ = new yy.ChordNode({value: $$[$0].value, dots: $$[$0].dots}, $$[$0-2]);
        
break;
case 19: case 20: case 21: case 22: case 23: case 24: case 50: case 51: case 52:
this.$ = $$[$0]
break;
case 25:
this.$ = "" + $$[$0-2] + $$[$0-1] + $$[$0]
break;
case 26:

            this.$ = new yy.Voice({name: $$[$0-2]}, $$[$0-1]);
        
break;
case 27: case 29: case 30: case 32: case 33:
this.$ = {key: $$[$0-2], value: $$[$0]}
break;
case 28:
this.$ = {key: $$[$0-2], value: toBoolean($$[$0])}
break;
case 31:
this.$ = {key: $$[$0-2], value: $$[$0].value}
break;
case 34:

            var props = {};
            props[$$[$0]] = true;
            this.$ = props;
        
break;
case 35:

            var props = {};
            props[$$[$0].key] = $$[$0].value;
            this.$ = props;
        
break;
case 36:

            var props = {};
            props[$$[$0]] = true;
            this.$ = Object.assign({}, $$[$0-1], props);
        
break;
case 37:

            var props = {};
            props[$$[$0].key] = $$[$0].value;
            this.$ = Object.assign({}, $$[$0-1], props);
        
break;
case 38:
this.$ = $$[$0-1]
break;
case 39:

            if (yy.BUILTINS[$$[$0-2]]) {
                this.$ = yy.BUILTINS[$$[$0-2]](yy, $$[$0-1]);
            } else {
                var props = {};
                props[$$[$0-2]] = true;
                this.$ = new yy.ScopeNode(props, $$[$0-1]);
            }
        
break;
case 40:

            var props = {};
            props[$$[$0-2].key] = $$[$0-2].value;
            this.$ = new yy.ScopeNode(props, $$[$0-1]);
        
break;
case 41:

            var props = Object.assign({}, $$[$0-2]);
            this.$ = new yy.ScopeNode(props, $$[$0-1]);
        
break;
case 42:

            // this.$ = $$[$0-1];
            this.$ = new yy.ScopeNode({}, $$[$0-1]);
        
break;
case 45:

            // Variable expansion in lists.
            var element = yy.vars[$$[$0]];
            if (!element) throw new Error(errors.unitializedVar($$[$0], this));
            this.$ = [].concat(element.reduce(function (acc, el) {
                return acc.concat(set(el));
            }, []));
        
break;
case 46:

            // Variable expansion in lists.
            var element = yy.vars[$$[$0]];
            if (!element) throw new Error(errors.unitializedVar($$[$0], this));
            this.$ = $$[$0-1].concat(element.reduce(function (acc, el) {
                return acc.concat(set(el));
            }, []));
        
break;
case 49:

            yy.vars[$$[$0-2]] = [$$[$0]];
            this.$ = $$[$0];
        
break;
case 53: case 54:
this.$ = $$[$0].execute(yy)
break;
}
},
table: [{3:1,4:[1,2],5:3,6:21,7:$V0,9:12,12:23,13:$V1,14:14,15:$V2,16:$V3,17:15,19:16,20:$V4,21:17,22:$V5,24:7,25:$V6,27:9,28:$V7,31:5,34:8,39:$V8,41:$V9,42:6,43:4},{1:[3]},{1:[2,1]},{4:[1,27],6:21,7:$V0,9:12,12:23,13:$V1,14:14,15:$V2,16:$V3,17:15,19:16,20:$V4,21:17,22:$V5,24:7,25:$V6,27:9,28:$V7,31:5,34:8,39:$V8,41:$V9,42:6,43:28},o($Va,[2,55]),o($Va,[2,50]),o($Va,[2,51]),o($Va,[2,52]),o($Va,[2,53]),o($Va,[2,54]),{32:$Vb},{32:[1,30]},o($Vc,[2,19]),o($Vc,[2,20]),o($Vc,[2,21]),o($Vc,[2,22]),o($Vc,[2,23]),o($Vc,[2,24]),{6:21,7:$V0,9:12,12:23,13:$V1,14:14,15:$V2,16:[1,31],17:15,19:16,20:$V4,21:17,22:$V5,24:36,25:$V6,29:34,31:32,34:38,35:33,37:$Vd,39:$V8,41:$Ve},{16:[1,39]},o($Vc,$Vf,{8:$Vg}),o($Vh,[2,5]),{13:[1,42],16:[1,41]},o($Vi,[2,11],{10:43,11:$Vj}),o($Vc,[2,15],{10:45,11:$Vj}),{12:23,13:$V1,17:47,18:46},o([4,7,11,13,15,16,20,22,23,25,28,30,39,40,41],[2,8]),{1:[2,2]},o($Va,[2,56]),{6:21,7:[1,55],9:52,16:[1,50],25:[1,48],26:51,33:[1,49],34:53,35:54,37:$Vd,39:$V8},{34:56,39:$V8},{6:21,7:$V0,9:12,12:23,13:$V1,14:14,15:$V2,17:15,19:16,20:$V4,21:17,22:$V5,24:36,25:$V6,29:57,32:$Vb,34:38,39:$V8,41:$Ve},{6:21,7:$V0,9:12,12:23,13:$V1,14:14,15:$V2,17:15,19:16,20:$V4,21:17,22:$V5,24:36,25:$V6,29:58,34:38,39:$V8,41:$Ve},{6:21,7:$V0,9:12,12:23,13:$V1,14:14,15:$V2,17:15,19:16,20:$V4,21:17,22:$V5,24:36,25:$V6,29:59,34:38,39:$V8,41:$Ve},{6:21,7:$V0,9:12,12:23,13:$V1,14:14,15:$V2,17:15,19:16,20:$V4,21:17,22:$V5,24:61,25:$V6,34:63,39:$V8,40:[1,60],41:$Vk},{16:[1,65],31:66,36:64},o($Vl,[2,43]),o($Vl,[2,45]),o($Vl,[2,47]),{6:21,7:$V0,9:12,12:23,13:$V1,14:14,15:$V2,17:15,19:16,20:$V4,21:17,22:$V5,24:36,25:$V6,29:67,34:38,39:$V8,41:$Ve},{7:[1,68]},o($Vc,[2,9]),o($Vc,[2,10]),o($Vi,[2,12]),{7:[1,69]},o($Vc,[2,16]),{12:23,13:$V1,17:71,23:[1,70]},o($Vm,[2,13]),o($Vn,[2,27]),o($Vn,[2,28]),o($Vn,[2,29]),o($Vn,[2,30]),o($Vn,[2,31]),o($Vn,[2,32]),o($Vn,[2,33]),o($Vn,$Vf,{8:$Vg,11:[1,72]}),o($Va,[2,49]),{6:21,7:$V0,9:12,12:23,13:$V1,14:14,15:$V2,17:15,19:16,20:$V4,21:17,22:$V5,24:61,25:$V6,34:63,39:$V8,40:[1,73],41:$Vk},{6:21,7:$V0,9:12,12:23,13:$V1,14:14,15:$V2,17:15,19:16,20:$V4,21:17,22:$V5,24:61,25:$V6,34:63,39:$V8,40:[1,74],41:$Vk},{6:21,7:$V0,9:12,12:23,13:$V1,14:14,15:$V2,17:15,19:16,20:$V4,21:17,22:$V5,24:61,25:$V6,34:63,39:$V8,40:[1,75],41:$Vk},o($Vh,[2,42]),o($Vl,[2,44]),o($Vl,[2,46]),o($Vl,[2,48]),{16:[1,77],31:78,38:[1,76]},o($Vo,[2,34],{32:$Vb}),o($Vo,[2,35]),{6:21,7:$V0,9:12,12:23,13:$V1,14:14,15:$V2,17:15,19:16,20:$V4,21:17,22:$V5,24:61,25:$V6,30:[1,79],34:63,39:$V8,41:$Vk},o($Vh,[2,3]),o($Vi,[2,6],{8:[1,80]}),o($Vc,[2,17],{10:81,11:$Vj}),o($Vm,[2,14]),{7:[1,82]},o($Vh,[2,39]),o($Vh,[2,40]),o($Vh,[2,41]),o($Vn,[2,38]),o($Vo,[2,36],{32:$Vb}),o($Vo,[2,37]),o($Va,[2,26]),o($Vi,[2,7]),o($Vc,[2,18]),o($Vn,[2,25])],
defaultActions: {2:[2,1],27:[2,2]},
parseError: function parseError (str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        var error = new Error(str);
        error.hash = hash;
        throw error;
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
test_match:function(match, indexed_rule) {
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
lex:function lex () {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin (condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState () {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules () {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState (n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState (condition) {
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
case 3:/* ignore multi-line comment */
break;
case 4:return 39
break;
case 5:return 40
break;
case 6:return 28
break;
case 7:return 30
break;
case 8:return 37
break;
case 9:return 38
break;
case 10:return 22
break;
case 11:return 23
break;
case 12:return 11
break;
case 13:return 32
break;
case 14:return 15
break;
case 15:return 20
break;
case 16:return 8
break;
case 17:yy_.yytext = yy_.yytext.substr(1,yy_.yyleng-2); return 25
break;
case 18:return 33
break;
case 19:return 7
break;
case 20:return 13
break;
case 21:return 41
break;
case 22:return 16
break;
case 23:return 4
break;
case 24:return 'INVALID'
break;
}
},
rules: [/^(?:\s+)/,/^(?:;.*)/,/^(?:\|)/,/^(?:\/\*([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*\*+\/)/,/^(?:\()/,/^(?:\))/,/^(?:\[)/,/^(?:\])/,/^(?:\{)/,/^(?:\})/,/^(?:<)/,/^(?:>)/,/^(?:\/)/,/^(?:=)/,/^(?::)/,/^(?:r\b)/,/^(?:\.+)/,/^(?:"(.*?)")/,/^(?:true|false\b)/,/^(?:[0-9]+)/,/^(?:[a-gA-G][b|#|n]{0,2}(?![a-zA-Z])([0-9]+)?)/,/^(?:~[a-zA-Z][a-zA-Z0-9\-]*)/,/^(?:[a-zA-Z][a-zA-Z0-9\-\!]*)/,/^(?:$)/,/^(?:.)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],"inclusive":true}}
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
exports.main = function commonjsMain (args) {
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