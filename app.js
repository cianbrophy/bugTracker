var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var mongodb = require('mongodb');
var signIn = false;
let alert = require('alert');

var conn1 = mongoose.createConnection('mongodb+srv://CianBrophy:w8IgEURgWVHq3t2H@cluster0.gw2st.mongodb.net/bug?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
var conn2 = mongoose.createConnection('mongodb+srv://CianBrophy:w8IgEURgWVHq3t2H@cluster0.gw2st.mongodb.net/dev?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
var conn3 = mongoose.createConnection('mongodb+srv://CianBrophy:w8IgEURgWVHq3t2H@cluster0.gw2st.mongodb.net/login?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

var Bug  = conn1.model('Bug', new mongoose.Schema({
  name: String,
  description: String,
  priority: String
}));

var Dev = conn2.model('Dev', new mongoose.Schema({
  firstname: String,
  secondname: String
}));

var Login = conn3.model('Login', new mongoose.Schema({
  username: String,
  password: String
}));

conn1.on('connected', () => {
  console.log('connected to mongodb');
});

conn1.on('disconnected', () => {
  console.log('connection disconnected');
});


var routes = require('./routes/index');
var devs = require('./routes/devs');
var login = require('./routes/login');


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
    if(signIn === false) {
        console.log("Only admin delete bugs!")
    } else {
    Bug.deleteOne({_id: new mongodb.ObjectID(req.body.id)}, function(err, results) {
        if (err){
            console.log("failed");
            throw err;
          }
          alert("Bug Removed");
          console.log("success");
       });

    res.redirect("/bugs");
}
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
            alert("Bug Added");
            console.log("Inserted Bug " + newBug);
    })

    res.redirect("/bugs");
});

app.post("/newDev", function(req, res) {
    console.log("Dev Request Sent!");
    if(signIn === false) {
        console.log("Only admin can update devs!")
    } else {
        var newDev = new Dev({
            firstname: req.body.firstname,
            secondname: req.body.secondname
        });

        Dev.create(newDev, function(err, Dev) {
            if(err)
                console.log(err);
            else
                alert("Dev Added");
                console.log("Inserted Dev " + newDev);
        })
    }

    res.redirect("/devs");
});

app.post("/deleteDev", function(req, res) {
    console.log("Delete Sent!");

    if(signIn === false) {
        console.log("Only admin can update devs!")
    } else {
        Dev.deleteOne({_id: new mongodb.ObjectID(req.body.id)}, function(err, results) {
            if (err){
                console.log("failed");
                throw err;
            }
            console.log("success");
            alert("Dev Removed");
        });
    }

    res.redirect("/devs");
});

app.post("/newLogin", function(req, res) {
    console.log("Attempting Login");
    var username = req.body.username;
    var password = req.body.password;

    if(username != "admin" && password != "admin") {
        console.log("Incorrect username/password, please try again");
        console.log(username);
        console.log(password);
        alert("Incorrect username/password, please try again");
    }
    else {
        console.log("Login successful!");
        alert("You are now signed in");
        signIn = true;
    }

    res.redirect("/login");
});


app.listen(3000, function() {
    console.log("Server started from port 3000");
});