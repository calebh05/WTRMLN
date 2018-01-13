var express = require("express"),
    router = express.Router(),
    User    = require("../models/user"),
    Nu      = require("../models/nuSchema"),
    middleware = require("../middleware"),
    methodOverride      = require("method-override")

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
    //CREATE NU USER & ADD TO DB
// router.post("/users", middleware.isLoggedIn, function(req, res) {
//     var username = req.body.username;
//         email = req.body.email;
//         password = req.body.password;
//         description = { serviceName: serviceName, info: info };
//         User = { email: email, username: username, password: password, description: description };
//         req.body.user = req.sanitize(req.body.user);
//         console.log("================================");
//         console.log(req.body);
//         Nu.create(User, function(err, nuUser){
//             if(err){
//                 console.log(err);
//             } else {
//                 console.log(nuUser);
//                 res.redirect("/users");
//             }
//         });
// });

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
    User.findById(req.params.id).populate("description").exec(function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            // console.log("Found User: " + foundUser);
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
    User.findByIdAndUpdate(req.params.id, req.body.username, function(err, updatedUser){
        if(err){
            res.redirect("/users");
        } else {
            console.log(updatedUser);
            console.log("Updated user: " + req.body.username);
            console.log();
            res.redirect("/users/");
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