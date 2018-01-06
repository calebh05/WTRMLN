var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    request = require("request"),
    mongo = require("mongodb"),
    mongoose = require("mongoose")

mongoose.connect("mongodb://localhost/wtrmln");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set("view engine", "ejs");

// schema setup
var userSchema = new mongoose.Schema({
    name: String,
    email: String,
});

var user = mongoose.model("User", userSchema);

user.create(
    {
        name: "Turds",
        email: "Big ones"
    }, function(err, user){
        if(err){
            console.log(err);
        } else {
            console.log("Newly created user");
            console.log(user);
        }
    });

var users = [
    {name: "One", email: "x@mail.com", dateStart: "dd/mm/yy", dateEnd: "dd/mm/yy"},
    {name: "Two", email: "x@mail.com", dateStart: "dd/mm/yy", dateEnd: "dd/mm/yy"},
    {name: "Three", email: "x@mail.com", dateStart: "dd/mm/yy", dateEnd: "dd/mm/yy"}
]

app.get("/", function(req, res) {
    var person = req.params.person;
	res.render("home", {personVar: "Caleb"})
});

app.get("/posts", function(req, res) {
    var posts = [
        {title: "Welcome", author: "admin"},
        {title: "About", author: "admin"}
    ];

	res.render("posts", {posts: posts})
});

app.get("/services", function(req, res) {
    res.render("services");
});

app.post("/addUser", function(req, res) {
    var newUser = req.body.newuser;
    users.push(newUser);
    console.log("User Added Successfully: " + newUser);
    res.redirect("/users");
});

app.post("/users", function(req, res) {
    // get data from form and add to users array
    var name = req.body.name;
    var mail = req.body.email;
    var newUser = {name: name, mail: mail};
    users.push(newUser);
    res.redirect("/users");
});

app.get("/users", function(req, res) {
    res.render("users", {users:users});
});

app.get("/users/new", function(req, res) {
    res.render("new")
});

app.get("/results", function(req, res) {
    request("http://omdbapi.com/?s=california", function (error, response, body) {
        if (!error && response.StatusCode == 200) {
            var data = JSON.parse(body);
            res.render("results", {data: data})
        }
    });
});

var gracefulShutdown = function() {
    console.log("Received kill signal, shutting down gracefully.");
    server.close(function() {
        console.log("Closed out remaining connections.");
        process.exit()
    });

    // if after
    setTimeout(function() {
        console.error("Could not close connections in time, forcefully shutting down");
        process.exit()
    }, 10*1000);
}

// listen for TERM signal .e.g. kill
process.on ('SIGTERM', gracefulShutdown);

// listen for INT signal e.g. Ctrl-C
process.on ('SIGINT', gracefulShutdown);