var express = require("express"),
    router = express.Router(),
    User    = require("../models/user"),
    middleware = require("../middleware"),
    methodOverride      = require("method-override"),
    Description    = require("../models/description"),

    // Create & add user to db
router.post("/users", middleware.isLoggedIn, function(req, res) {
    // get data from form and add to users array
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var newUser = {email: email, username: username, password: password};
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
router.put("/users/:id", middleware.isLoggedIn, function(req, res) {
    var inf = req.body.description.info;
        id = req.params.id;
        username = req.body.username;
        serviceName = req.body.serviceName;

    // user = new User;

    User.findByIdAndUpdate(id, inf, {new: true}, function (err, foundUser) {

        if (err) {
            console.log("Error: " + err);
            console.log("User update failed! User: " + foundUser.username);
            res.redirect("/users/:id");
        } else {
            console.log("User info updated: " + foundUser.username);
            foundUser.vitals.description.info = inf;
            foundUser.save(function(err, foundUser){
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