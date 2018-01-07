var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    request = require("request"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    mongo = require("mongodb"),
    mongoose = require("mongoose"),
    server = app.listen(8080);
    if(server) {
        console.log("Server Started, buckle yo britches, bitches.");
    }

mongoose.connect("mongodb://localhost/wtrmln");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());


// schema setup
var userSchema = new mongoose.Schema({
    name: String,
    email: String,
    description: String
});

var user = mongoose.model("User", userSchema);

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

    //Create & add user to db
app.post("/users", function(req, res) {
    // get data from form and add to users array
    var name = req.body.name;
    var email = req.body.email;
    var newUser = {name: name, email: email};
    req.body.user = req.sanitize(req.body.user);
    console.log("===========");
    console.log(req.body);
    user.create(newUser, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            console.log(newlyCreated);
            res.redirect("/users");
        }
    });
});
    // Find all users
app.get("/users", function(req, res) {
    user.find({}, function(err, allUsers){
        if(err){
            console.log(err);
        } else {
            res.render("users", {users: allUsers});
        }
    });
});
    // Add new user form
app.get("/users/new", function(req, res) {
    res.render("new")
});
    // Find user by ID
    // show template on show page
app.get("/users/:id", function(req, res) {
    // res.send("Show temp");
    user.findById(req.params.id, function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            res.render("show", {user: foundUser});
        }
    });
});

// EDIT ROUTE
app.get("/users/:id/edit", function(req, res) {
    user.findById(req.params.id, function(err, foundUser){
        if(err){
            res.redirect("/users");
        } else {
            res.render("edit", {user: foundUser});
        }
    });
    /*res.render("edit");*/
});

// UPDATE ROUTE
app.put("/users/:id", function(req, res) {
    user.findByIdAndUpdate(req.params.id, req.body.user, function(err, updatedUser){
        if(err){
            res.redirect("/users");
        } else {
            console.log("Updated user: " + req.params.id);
            res.redirect("/users/" + req.params.id);
        }
    });
});

    //DELETE USER
app.delete("/users/:id", function(req, res){
    user.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/users");
        } else {
            console.log("User: " + req.params.id + "has been deleted.");
            res.redirect("/users");
        }
    })
});

app.get("/results", function(req, res) {
    request("http://omdbapi.com/?s=california", function (error, response, body) {
        if (!error && response.StatusCode == 200) {
            var data = JSON.parse(body);
            res.render("results", {data: data})
        }
    });
});

    // Kill it with fire
var gracefulShutdown = function() {
    console.log("The arsonist has arrived.");
    server.close(function() {
        console.log("Burned the remains.");
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