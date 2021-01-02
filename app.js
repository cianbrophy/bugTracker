var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/bug");

var routes = require('./routes/index');
var devs = require('./routes/devs');

var bugSchema = new mongoose.Schema({
    name: String,
    description: String,
    priority: String
});

var Bug = mongoose.model("Bug", bugSchema);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.use('/public', express.static('public'));

app.get('/bugs', function (req, res) {
    Bug.find({}, function(err, element) {
        if(err)
            console.log("hello");
        else {
            res.render('bugs', {element, element});
        }
    })
});

app.use("/", routes);
app.use("/devs", devs);

app.post("/newBug", function(req, res) {
    console.log("Request Sent!");
    var name = req.body.title;
    var description = req.body.description;
    var priority = req.body.priorityInput;
    element.push(name);
    element.push(description);
    element.push(priority);
    console.log(element);
    res.redirect("/bugs");
})

app.listen(3000, function() {
    console.log("Server started from port 3000");
});