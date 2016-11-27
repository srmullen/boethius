const Parser = require("jison").Parser;
const fs = require("fs");
const main = require("./src/main");

const grammer = fs.readFileSync("./lang/lang.jison", "utf-8");

const parser = new Parser(grammer);

fs.writeFileSync("./index.js", parser.parse.toString(), "utf-8");

console.log("done");
