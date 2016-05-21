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
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,10],$V1=[1,11],$V2=[1,12],$V3=[1,9],$V4=[4,10,14,16,20,22],$V5=[4,10,14,16,17,20,22],$V6=[1,24],$V7=[10,17];
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"expressions":3,"EOF":4,"list":5,"duration":6,"INTEGER":7,"DOTS":8,"note":9,"PITCH":10,"FWDSLASH":11,"notelist":12,"rest":13,"REST":14,"chord":15,"OPENBRKT":16,"CLOSEBRKT":17,"item":18,"propscope":19,"LPAREN":20,"IDENTIFIER":21,"RPAREN":22,"EQUALS":23,"BOOL":24,"$accept":0,"$end":1},
terminals_: {2:"error",4:"EOF",7:"INTEGER",8:"DOTS",10:"PITCH",11:"FWDSLASH",14:"REST",16:"OPENBRKT",17:"CLOSEBRKT",20:"LPAREN",21:"IDENTIFIER",22:"RPAREN",23:"EQUALS",24:"BOOL"},
productions_: [0,[3,1],[3,2],[6,1],[6,2],[9,1],[9,3],[12,1],[12,2],[13,1],[13,3],[15,3],[15,5],[18,1],[18,1],[18,1],[19,4],[19,6],[19,6],[19,6],[5,1],[5,2],[5,1],[5,2]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
return [];
break;
case 2:
return $$[$0-1];
break;
case 3:
this.$ = {value: Number($$[$0])}
break;
case 4:
this.$ = {value: Number($$[$0-1]), dots: $$[$0].length}
break;
case 5:

            var info = noteInfo($$[$0]);
            // default values
            info.type = "note";

            this.$ = info;
        
break;
case 6:

            var info = noteInfo($$[$0-2]);
            info.type = "note";
            info.value = $$[$0].value;
            info.dots = $$[$0].dots;
            this.$ = info;
        
break;
case 7: case 20:
this.$ = [$$[$0]]
break;
case 8: case 21: case 23:
this.$ = $$[$0-1].concat($$[$0])
break;
case 9:
this.$ = {type: "rest"}
break;
case 10:
this.$ = {type: "rest", value: $$[$0].value, dots: $$[$0].dots}
break;
case 11:
this.$ = {type: "chord", children: $$[$0-1]}
break;
case 12:

            this.$ = {type: "chord", children: $$[$0-3], value: $$[$0].value, dots: $$[$0].dots};
        
break;
case 13: case 14: case 15: case 22:
this.$ = $$[$0]
break;
case 16:
this.$ = $$[$0-1].map(function (item) {
            return applyProperty(item, $$[$0-2], true);
        });
break;
case 17:
this.$ = $$[$0-1].map(function (item) {return applyProperty(item, $$[$0-4], toBoolean($$[$0-2]))})
break;
case 18:
this.$ = $$[$0-1].map(function (item) {return applyProperty(item, $$[$0-4], Number($$[$0-2]))})
break;
case 19:
this.$ = $$[$0-1].map(function (item) {return applyProperty(item, $$[$0-4], $$[$0-2])});
break;
}
},
table: [{3:1,4:[1,2],5:3,9:6,10:$V0,13:7,14:$V1,15:8,16:$V2,18:4,19:5,20:$V3},{1:[3]},{1:[2,1]},{4:[1,13],9:6,10:$V0,13:7,14:$V1,15:8,16:$V2,18:14,19:15,20:$V3},o($V4,[2,20]),o($V4,[2,22]),o($V4,[2,13]),o($V4,[2,14]),o($V4,[2,15]),{21:[1,16]},o($V5,[2,5],{11:[1,17]}),o($V4,[2,9],{11:[1,18]}),{9:20,10:$V0,12:19},{1:[2,2]},o($V4,[2,21]),o($V4,[2,23]),{5:21,9:6,10:$V0,13:7,14:$V1,15:8,16:$V2,18:4,19:5,20:$V3,23:[1,22]},{6:23,7:$V6},{6:25,7:$V6},{9:27,10:$V0,17:[1,26]},o($V7,[2,7]),{9:6,10:$V0,13:7,14:$V1,15:8,16:$V2,18:14,19:15,20:$V3,22:[1,28]},{7:[1,30],21:[1,31],24:[1,29]},o($V5,[2,6]),o($V5,[2,3],{8:[1,32]}),o($V4,[2,10]),o($V4,[2,11],{11:[1,33]}),o($V7,[2,8]),o($V4,[2,16]),{5:34,9:6,10:$V0,13:7,14:$V1,15:8,16:$V2,18:4,19:5,20:$V3},{5:35,9:6,10:$V0,13:7,14:$V1,15:8,16:$V2,18:4,19:5,20:$V3},{5:36,9:6,10:$V0,13:7,14:$V1,15:8,16:$V2,18:4,19:5,20:$V3},o($V5,[2,4]),{6:37,7:$V6},{9:6,10:$V0,13:7,14:$V1,15:8,16:$V2,18:14,19:15,20:$V3,22:[1,38]},{9:6,10:$V0,13:7,14:$V1,15:8,16:$V2,18:14,19:15,20:$V3,22:[1,39]},{9:6,10:$V0,13:7,14:$V1,15:8,16:$V2,18:14,19:15,20:$V3,22:[1,40]},o($V4,[2,12]),o($V4,[2,17]),o($V4,[2,18]),o($V4,[2,19])],
defaultActions: {2:[2,1],13:[2,2]},
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
case 1:return 20
break;
case 2:return 22
break;
case 3:return 16
break;
case 4:return 17
break;
case 5:return 11
break;
case 6:return 23
break;
case 7:return 10
break;
case 8:return 14
break;
case 9:return 8
break;
case 10:return 24
break;
case 11:return 7
break;
case 12:return 21
break;
case 13:return 4
break;
case 14:return 'INVALID'
break;
}
},
rules: [/^(?:\s+)/,/^(?:\()/,/^(?:\))/,/^(?:<)/,/^(?:>)/,/^(?:\/)/,/^(?:=)/,/^(?:[a-g][b|#]{0,2}[\d]+)/,/^(?:r\b)/,/^(?:\.+)/,/^(?:true|false\b)/,/^(?:[0-9]+)/,/^(?:[a-zA-Z][a-zA-Z0-9]*)/,/^(?:$)/,/^(?:.)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14],"inclusive":true}}
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