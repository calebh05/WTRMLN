var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var request = require("request");
var sql = require("mysql");


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set("view engine", "ejs");

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


app.listen(8080, function() {
	console.log("Buckle up..")
});
