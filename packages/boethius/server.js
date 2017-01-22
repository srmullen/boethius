const koa = require("koa");
const serve = require("koa-static");
const app = koa();

const port = 3000;

app.use(serve("."));

app.listen(port);
console.log("App listening on port " + port);
