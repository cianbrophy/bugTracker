var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/bug", {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
    if (err)
     console.error(err);
  else
     console.log("Connected to the mongodb"); 
});

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
    var newBug = new Bug({
        name: req.body.title,
        description: req.body.description,
        priority: req.body.priorityInput
    });

    Bug.create(newBug, function(err, Bug) {
        if(err)
            console.log(err);
        else
            console.log("Inserted Bug " + newBug);
    })

    res.redirect("/bugs");
});

app.listen(3000, function() {
    console.log("Server started from port 3000");
});