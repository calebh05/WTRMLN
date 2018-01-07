var express = require("express"),
    app                 = express(),
    bodyParser          = require("body-parser"),
    request             = require("request"),
    methodOverride      = require("method-override"),
    expressSanitizer    = require("express-sanitizer"),
    mongo               = require("mongodb"),
    mongoose            = require("mongoose"),
    Services            = require("./models/services"),
    User                = require("./models/user"),
    passport            = require("passport"),
    LocalStrategy       = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    seedDb              = require("./seeds");
    server              = app.listen(8080);
    if(server) {
        console.log("Server Started, buckle yo britches, bitches.");
    }

seedDb();
mongoose.connect("mongodb://localhost/wtrmln");


app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

app.use(require("express-session")({
    secret: "Secret message iz here!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

var date = new Date();
var n = date.toDateString();
var time = date.toLocaleTimeString();

app.get("/secret", isLoggedIn, function(req, res){
    res.render("secret");
});

app.get("/", function(req, res) {
    res.render("home");
});

app.get("/posts", function(req, res) {
    var posts = [
        {title: "Welcome", author: "admin"},
        {title: "About", author: "admin"}
    ];

	res.render("posts", {posts: posts})
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    req.body.username
    req.body.password
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("users");
        });
    });
});

app.get("/login", function(req, res){
   res.render("login");
});
//Login Logic
app.post("/login", passport.authenticate("local", {
    successRedirect: "/users",
    failureRedirect: "/login"
    }) ,function(req, res) {

});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
    console.log("Logging you out, bitch");
})

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
app.post("/users", isLoggedIn, function(req, res) {
    // get data from form and add to users array
    var name = req.body.name;
    var email = req.body.email;
    var description = req.body.description;
    var newUser = {name: name, email: email, description: description};
    req.body.user = req.sanitize(req.body.user);
    console.log("===========================");
    console.log(req.body);
    User.create(newUser, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            console.log(newlyCreated);
            res.redirect("/users");
        }
    });
});
    // Find all users
app.get("/users", isLoggedIn, function(req, res) {
    User.find({}, function(err, allUsers){
        if(err){
            console.log(err);
        } else {
            res.render("users", {users: allUsers, currentUser: req.user});
        }
    });
});

    // Add new user form
app.get("/users/new", isLoggedIn, function(req, res) {
    res.render("new")
});

    // Find user by ID
    // show template on show page
app.get("/users/:id",isLoggedIn, function(req, res) {
    // res.send("Show temp");
    User.findById(req.params.id).populate("description").exec(function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            console.log("Found User: " + foundUser);
            res.render("show", {user: foundUser});
        }
    });
});

// EDIT ROUTE
app.get("/users/:id/edit",isLoggedIn, function(req, res) {
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            res.redirect("/users");
        } else {
            res.render("edit", {user: foundUser});
        }
    });
    /*res.render("edit");*/
});

// UPDATE ROUTE
app.put("/users/:id",isLoggedIn, function(req, res) {
    User.findByIdAndUpdate(req.params.id, req.body.user, function(err, updatedUser){
        if(err){
            res.redirect("/users");
        } else {
            console.log("Updated user: " + req.params.id);
            res.redirect("/users/" + req.params.id);
        }
    });
});

    //DELETE USER
app.delete("/users/:id",isLoggedIn, function(req, res){
    User.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/users");
        } else {
            console.log("User: " + req.params.id + "has been deleted.");
            res.redirect("/users");
        }
    })
});

// app.get("/results", function(req, res) {
//     request("http://omdbapi.com/?s=california", function (error, response, body) {
//         if (!error && response.StatusCode == 200) {
//             var data = JSON.parse(body);
//             res.render("results", {data: data})
//         }
//     });
// });


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
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