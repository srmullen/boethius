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
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,21],$V1=[1,27],$V2=[1,23],$V3=[1,10],$V4=[1,25],$V5=[1,26],$V6=[1,19],$V7=[1,13],$V8=[1,20],$V9=[1,11],$Va=[4,7,13,15,16,20,22,25,30,33,43],$Vb=[1,30],$Vc=[4,7,13,15,16,20,22,25,28,30,33,34,43],$Vd=[1,32],$Ve=[1,37],$Vf=[1,39],$Vg=[2,4],$Vh=[1,42],$Vi=[4,7,13,15,16,20,22,25,28,30,33,34,42,43],$Vj=[4,7,13,15,16,20,22,23,25,28,30,33,34,43],$Vk=[1,46],$Vl=[1,58],$Vm=[1,65],$Vn=[7,13,15,20,22,25,28,30,34,43],$Vo=[13,23],$Vp=[4,7,13,15,16,20,22,25,30,33,42,43],$Vq=[16,42];
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"expressions":3,"EOF":4,"statements":5,"float":6,"INTEGER":7,"DOTS":8,"number":9,"duration":10,"FWDSLASH":11,"pitch":12,"PITCHCLASS":13,"keyword":14,"COLON":15,"IDENTIFIER":16,"note":17,"notelist":18,"rest":19,"REST":20,"chord":21,"OPENBRKT":22,"CLOSEBRKT":23,"builtin":24,"LPAREN":25,"BUILTIN":26,"list":27,"RPAREN":28,"item":29,"STRING":30,"ratio":31,"voice":32,"LBRKT":33,"RBRKT":34,"assignment":35,"EQUALS":36,"BOOL":37,"scope":38,"properties":39,"propertylist":40,"LCURL":41,"RCURL":42,"VAR":43,"tassignment":44,"statement":45,"$accept":0,"$end":1},
terminals_: {2:"error",4:"EOF",7:"INTEGER",8:"DOTS",11:"FWDSLASH",13:"PITCHCLASS",15:"COLON",16:"IDENTIFIER",20:"REST",22:"OPENBRKT",23:"CLOSEBRKT",25:"LPAREN",26:"BUILTIN",28:"RPAREN",30:"STRING",33:"LBRKT",34:"RBRKT",36:"EQUALS",37:"BOOL",41:"LCURL",42:"RCURL",43:"VAR"},
productions_: [0,[3,1],[3,2],[6,3],[9,1],[9,1],[10,2],[10,3],[12,1],[14,2],[14,2],[17,1],[17,2],[18,1],[18,2],[19,1],[19,2],[21,3],[21,4],[24,4],[29,1],[29,1],[29,1],[29,1],[29,1],[29,1],[29,1],[31,3],[32,4],[35,3],[35,3],[35,3],[35,3],[35,3],[35,3],[35,3],[40,1],[40,1],[40,2],[40,2],[39,3],[38,4],[38,4],[38,4],[38,3],[27,1],[27,2],[27,1],[27,2],[27,1],[27,2],[44,3],[45,1],[45,1],[45,1],[45,1],[45,1],[5,1],[5,2]],
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
this.$ = yy.parsePitch($$[$0]);
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
case 13: case 45: case 57:
this.$ = [$$[$0]]
break;
case 14: case 46: case 50: case 58:
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

            /*this.$ = {type: CHORD, children: $$[$0-2], props: {value: $$[$0].value, dots: $$[$0].dots}};*/
            this.$ = new yy.ChordNode({value: $$[$0].value, dots: $$[$0].dots}, $$[$0-2]);
        
break;
case 19:

            this.$ = yy.BUILTINS[$$[$0-2].trim()](yy, $$[$0-1]);
        
break;
case 20: case 21: case 22: case 23: case 24: case 25: case 26: case 49: case 52: case 53: case 54: case 55: case 56:
this.$ = $$[$0]
break;
case 27:
this.$ = "" + $$[$0-2] + $$[$0-1] + $$[$0]
break;
case 28:

            if (!yy.voices[$$[$0-2]]) {
                // create array for voice items
                yy.voices[$$[$0-2]] = $$[$0-1];
            } else {
                yy.voices[$$[$0-2]] = yy.voices[$$[$0-2]].concat($$[$0-1]);
            }

            this.$ = $$[$0-1];
        
break;
case 29: case 31: case 32: case 34: case 35:
this.$ = {key: $$[$0-2], value: $$[$0]}
break;
case 30:
this.$ = {key: $$[$0-2], value: toBoolean($$[$0])}
break;
case 33:
this.$ = {key: $$[$0-2], value: $$[$0].value}
break;
case 36:

            var props = {};
            props[$$[$0]] = true;
            this.$ = props;
        
break;
case 37:

            var props = {};
            props[$$[$0].key] = $$[$0].value;
            this.$ = props;
        
break;
case 38:

            var props = {};
            props[$$[$0]] = true;
            this.$ = Object.assign({}, $$[$0-1], props);
        
break;
case 39:

            var props = {};
            props[$$[$0].key] = $$[$0].value;
            this.$ = Object.assign({}, $$[$0-1], props);
        
break;
case 40:
this.$ = $$[$0-1]
break;
case 41:
this.$ = $$[$0-1].map(function (item) {
            var props = {};
            props[$$[$0-2]] = true;
            return set(item, props);
        });
break;
case 42:
this.$ = $$[$0-1].map(function (item) {
            var assignProps = {};
            assignProps[$$[$0-2].key] = $$[$0-2].value;
            var props = Object.assign({}, assignProps, item.props);
            return item.set(props);
        });
break;
case 43:
this.$ = $$[$0-1].map(function (item) {
            // items properties overwrite the proplist's properties
            var props = Object.assign({}, $$[$0-2], item.props);
            // resulting props are placed on the item.
            return item.set(props);
        });
break;
case 44:

            this.$ = $$[$0-1];
        
break;
case 47:

            var element = yy.vars[$$[$0]];
            if (!element) throw new Error(errors.unitializedVar($$[$0], this));
            this.$ = [].concat(element.reduce(function (acc, el) {
                return acc.concat(set(el));
            }, []));
        
break;
case 48:

            var element = yy.vars[$$[$0]];
            if (!element) throw new Error(errors.unitializedVar($$[$0], this));
            this.$ = $$[$0-1].concat(element.reduce(function (acc, el) {
                return acc.concat(set(el));
            }, []));
        
break;
case 51:

            yy.vars[$$[$0-2]] = $$[$0];
            this.$ = $$[$0];
        
break;
}
},
table: [{3:1,4:[1,2],5:3,6:22,7:$V0,9:12,12:24,13:$V1,14:14,15:$V2,16:$V3,17:15,19:16,20:$V4,21:17,22:$V5,24:18,25:$V6,29:7,30:$V7,32:9,33:$V8,35:5,38:8,43:$V9,44:6,45:4},{1:[3]},{1:[2,1]},{4:[1,28],6:22,7:$V0,9:12,12:24,13:$V1,14:14,15:$V2,16:$V3,17:15,19:16,20:$V4,21:17,22:$V5,24:18,25:$V6,29:7,30:$V7,32:9,33:$V8,35:5,38:8,43:$V9,44:6,45:29},o($Va,[2,57]),o($Va,[2,52]),o($Va,[2,53]),o($Va,[2,54]),o($Va,[2,55]),o($Va,[2,56]),{36:$Vb},{36:[1,31]},o($Vc,[2,20]),o($Vc,[2,21]),o($Vc,[2,22]),o($Vc,[2,23]),o($Vc,[2,24]),o($Vc,[2,25]),o($Vc,[2,26]),{6:22,7:$V0,9:12,12:24,13:$V1,14:14,15:$V2,16:$Vd,17:15,19:16,20:$V4,21:17,22:$V5,24:18,25:$V6,26:[1,36],27:35,29:38,30:$V7,35:33,38:40,39:34,41:$Ve,43:$Vf},{16:[1,41]},o($Vc,$Vg,{8:$Vh}),o($Vi,[2,5]),{13:[1,44],16:[1,43]},o($Vj,[2,11],{10:45,11:$Vk}),o($Vc,[2,15],{10:47,11:$Vk}),{12:24,13:$V1,17:49,18:48},o([4,7,11,13,15,16,20,22,23,25,28,30,33,34,43],[2,8]),{1:[2,2]},o($Va,[2,58]),{6:22,7:[1,57],9:54,16:[1,52],25:$Vl,30:[1,50],31:53,37:[1,51],38:55,39:56,41:$Ve},{25:$Vl,38:59},{6:22,7:$V0,9:12,12:24,13:$V1,14:14,15:$V2,17:15,19:16,20:$V4,21:17,22:$V5,24:18,25:$V6,27:60,29:38,30:$V7,36:$Vb,38:40,43:$Vf},{6:22,7:$V0,9:12,12:24,13:$V1,14:14,15:$V2,17:15,19:16,20:$V4,21:17,22:$V5,24:18,25:$V6,27:61,29:38,30:$V7,38:40,43:$Vf},{6:22,7:$V0,9:12,12:24,13:$V1,14:14,15:$V2,17:15,19:16,20:$V4,21:17,22:$V5,24:18,25:$V6,27:62,29:38,30:$V7,38:40,43:$Vf},{6:22,7:$V0,9:12,12:24,13:$V1,14:14,15:$V2,17:15,19:16,20:$V4,21:17,22:$V5,24:18,25:$V6,28:[1,63],29:64,30:$V7,38:66,43:$Vm},{6:22,7:$V0,9:12,12:24,13:$V1,14:14,15:$V2,17:15,19:16,20:$V4,21:17,22:$V5,24:18,25:$V6,27:67,29:38,30:$V7,38:40,43:$Vf},{16:[1,69],35:70,40:68},o($Vn,[2,45]),o($Vn,[2,47]),o($Vn,[2,49]),{6:22,7:$V0,9:12,12:24,13:$V1,14:14,15:$V2,17:15,19:16,20:$V4,21:17,22:$V5,24:18,25:$V6,27:71,29:38,30:$V7,38:40,43:$Vf},{7:[1,72]},o($Vc,[2,9]),o($Vc,[2,10]),o($Vj,[2,12]),{7:[1,73]},o($Vc,[2,16]),{12:24,13:$V1,17:75,23:[1,74]},o($Vo,[2,13]),o($Vp,[2,29]),o($Vp,[2,30]),o($Vp,[2,31]),o($Vp,[2,32]),o($Vp,[2,33]),o($Vp,[2,34]),o($Vp,[2,35]),o($Vp,$Vg,{8:$Vh,11:[1,76]}),{6:22,7:$V0,9:12,12:24,13:$V1,14:14,15:$V2,16:$Vd,17:15,19:16,20:$V4,21:17,22:$V5,24:18,25:$V6,27:35,29:38,30:$V7,35:33,38:40,39:34,41:$Ve,43:$Vf},o($Va,[2,51]),{6:22,7:$V0,9:12,12:24,13:$V1,14:14,15:$V2,17:15,19:16,20:$V4,21:17,22:$V5,24:18,25:$V6,28:[1,77],29:64,30:$V7,38:66,43:$Vm},{6:22,7:$V0,9:12,12:24,13:$V1,14:14,15:$V2,17:15,19:16,20:$V4,21:17,22:$V5,24:18,25:$V6,28:[1,78],29:64,30:$V7,38:66,43:$Vm},{6:22,7:$V0,9:12,12:24,13:$V1,14:14,15:$V2,17:15,19:16,20:$V4,21:17,22:$V5,24:18,25:$V6,28:[1,79],29:64,30:$V7,38:66,43:$Vm},o($Vi,[2,44]),o($Vn,[2,46]),o($Vn,[2,48]),o($Vn,[2,50]),{6:22,7:$V0,9:12,12:24,13:$V1,14:14,15:$V2,17:15,19:16,20:$V4,21:17,22:$V5,24:18,25:$V6,28:[1,80],29:64,30:$V7,38:66,43:$Vm},{16:[1,82],35:83,42:[1,81]},o($Vq,[2,36],{36:$Vb}),o($Vq,[2,37]),{6:22,7:$V0,9:12,12:24,13:$V1,14:14,15:$V2,17:15,19:16,20:$V4,21:17,22:$V5,24:18,25:$V6,29:64,30:$V7,34:[1,84],38:66,43:$Vm},o($Vi,[2,3]),o($Vj,[2,6],{8:[1,85]}),o($Vc,[2,17],{10:86,11:$Vk}),o($Vo,[2,14]),{7:[1,87]},o($Vi,[2,41]),o($Vi,[2,42]),o($Vi,[2,43]),o($Vc,[2,19]),o($Vp,[2,40]),o($Vq,[2,38],{36:$Vb}),o($Vq,[2,39]),o($Va,[2,28]),o($Vj,[2,7]),o($Vc,[2,18]),o($Vp,[2,27])],
defaultActions: {2:[2,1],28:[2,2]},
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
case 3:return 25
break;
case 4:return 28
break;
case 5:return 33
break;
case 6:return 34
break;
case 7:return 41
break;
case 8:return 42
break;
case 9:return 22
break;
case 10:return 23
break;
case 11:return 11
break;
case 12:return 36
break;
case 13:return 15
break;
case 14:return 20
break;
case 15:return 8
break;
case 16:yy_.yytext = yy_.yytext.substr(1,yy_.yyleng-2); return 30
break;
case 17:return 37
break;
case 18:return 7
break;
case 19:return 26
break;
case 20:return 13
break;
case 21:return 43
break;
case 22:return 16
break;
case 23:return 4
break;
case 24:return 'INVALID'
break;
}
},
rules: [/^(?:\s+)/,/^(?:;.*)/,/^(?:\|)/,/^(?:\()/,/^(?:\))/,/^(?:\[)/,/^(?:\])/,/^(?:\{)/,/^(?:\})/,/^(?:<)/,/^(?:>)/,/^(?:\/)/,/^(?:=)/,/^(?::)/,/^(?:r\b)/,/^(?:\.+)/,/^(?:"(.*?)")/,/^(?:true|false\b)/,/^(?:[0-9]+)/,/^(?:(csym|layout|timesig|page|system|line|clef|key)\s)/,/^(?:[a-gA-G][b|#]{0,2}(?![a-zA-Z])([0-9]+)?)/,/^(?:~[a-zA-Z][a-zA-Z0-9\-]*)/,/^(?:[a-zA-Z][a-zA-Z0-9]*)/,/^(?:$)/,/^(?:.)/],
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