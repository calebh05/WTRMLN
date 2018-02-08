var express = require("express"),
    router = express.Router(),
    User    = require("../models/user"),
    passport = require("passport"),
    middleware = require("../middleware");

    // Create & add user to db
router.post("/users", middleware.isLoggedIn, function(req, res) {
    // get data from form and add to users array
    var username = req.body.username;
        email = req.body.email;
        password = req.body.password;
        newUser = {email: email, username: username, password: password};
    req.body.username = req.sanitize(req.body.username);
    console.log("===========================");
    console.log(newUser);
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
router.get("/users", middleware.isLoggedIn, function(req, res) {
    User.find({}, function(err, allUsers){
        if(err){
            console.log(err);
        } else {
            res.render("users", {users: allUsers, currentUser: req.user});
        }
    });
});

// Add new user form
router.get("/users/new", middleware.isLoggedIn, function(req, res) {
    res.render("new")
});

// Find user by ID
// show template on show page
router.get("/users/:id", middleware.isLoggedIn, function(req, res) {
    // res.send("Show temp");
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            console.log("Error: " + err);
            console.log(foundUser);
            res.redirect("/users/");
        } else {
            console.log("Found User: " + foundUser);
            res.render("show", {user: foundUser});
        }
    });
});

// EDIT USER ROUTE
router.get("/users/:id/edit", middleware.isLoggedIn, function(req, res) {
    var admin = req.user.access.power;
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            res.redirect("/users");
            console.log(err);
        } else {
            res.render("edit", {user: foundUser});
        }
    });
});

// UPDATE USER ROUTE
router.put("/users/:id", middleware.isLoggedIn, /*middleware.isAdmin,*/ function(req, res) {
    var inf = req.body.description.info;
        id = req.params.id;
        username = req.body.username;
        serviceName = req.body.serviceName;
        admin       = req.user.access.power;
    // user = new User;
    User.findByIdAndUpdate(id, inf, {new: true}, function (err, foundUser) {
        if (err) {
            res.redirect("/users/:id");
        } else {
            foundUser.vitals.description.info = inf;
            foundUser.save(foundUser.access.dateUpdated = Date.now(), function(err, foundUser){
                if(err) {
                    console.log(err);
                    res.redirect("/users/:id");
                } else {
                    console.log("User saved: " + foundUser.username);
                    res.redirect("/users/");
                }
            });
        }
    });
});

//DELETE USER
router.delete("/users/:id", middleware.isLoggedIn, function(req, res){
    User.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/users");
        } else {
            console.log("User: " + req.params.id + "has been deleted.");
            res.redirect("/users");
        }
    });
});

module.exports = router;