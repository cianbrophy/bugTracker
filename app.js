var express = require("express");

var routes = require('./routes/index');
var bugs = require('./routes/bugs');

var app = express();

app.set("view engine", "ejs");

app.use('/public', express.static('public'));

app.use("/", routes);
app.use("/bugs", bugs);
app.use("/devs", bugs);

app.get("/", function(req, res) {
    res.render("index.ejs");
});

app.listen(3000, function() {
    console.log("Server started from port 3000");
});