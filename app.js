var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var mongodb = require('mongodb');

mongoose.connect("mongodb+srv://User:cianandcameron@cluster0.gw2st.mongodb.net/bug?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
    if (err)
     console.error(err);
  else
     console.log("Connected to the mongodb"); 
});


var routes = require('./routes/index');
var devs = require('./routes/devs');
var login = require('./routes/login');

var bugSchema = new mongoose.Schema({
    name: String,
    description: String,
    priority: String
});

var devSchema = new mongoose.Schema({
    firstname: String,
    secondname: String
});

var Bug = mongoose.model("Bug", bugSchema);

var Dev = mongoose.model("Dev", devSchema);

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

app.get('/devs', function (req, res) {
    Dev.find({}, function(err, element) {
        if(err)
            console.log("hello");
        else {
            res.render('devs', {element, element});
        }
    })
});

app.get('/login', function (req, res) {
    Bug.find({}, function(err, element) {
        if(err)
            console.log("hello");
        else {
            res.render('login', {element, element});
        }
    })
});

app.use("/", routes);
app.use("/devs", devs);

app.post("/deleteBug", function(req, res) {
    console.log("Delete Sent!");

    Bug.deleteOne({_id: new mongodb.ObjectID(req.body.id)}, function(err, results) {
        if (err){
            console.log("failed");
            throw err;
          }
          console.log("success");
       });

    res.redirect("/bugs");
});

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

app.post("/newDev", function(req, res) {
    console.log("Dev Request Sent!");
    var newDev = new Dev({
        firstname: req.body.firstname,
        secondname: req.body.secondname
    });

    Dev.create(newDev, function(err, Dev) {
        if(err)
            console.log(err);
        else
            console.log("Inserted Dev " + newDev);
    })

    res.redirect("/devs");
});

app.post("/deleteDev", function(req, res) {
    console.log("Delete Sent!");

    Dev.deleteOne({_id: new mongodb.ObjectID(req.body.id)}, function(err, results) {
        if (err){
            console.log("failed");
            throw err;
          }
          console.log("success");
       });

    res.redirect("/devs");
});

app.post("/newLogin", function(req, res) {
    console.log("Attempting Login");
    var newLogin = new Login({
        username: req.body.user,
        password: req.body.pass,
    });

    if(newLogin != admin) {
        console.log("Incorrect username/password, please try again");
    }
    else {
        console.log("Login successful!");
    }

    res.redirect("/login");
});


app.listen(3000, function() {
    console.log("Server started from port 3000");
});