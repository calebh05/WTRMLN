var express = require("express");
    router  = express.Router(),
    User    = require("../models/user"),
    passport            = require("passport"),
    middleware = require("../middleware")

router.get("/", function(req, res) {
    res.render("home");
});

    //Register Form
router.get("/register", function(req, res){
    res.render("register");
});

    //Register Signup POST
router.post("/register", function(req, res){
    req.body.username
    req.body.password
    req.body.email
    User.register(new User({email: req.body.email, username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            console.log("Created new User: " + req.body.username + "( " + req.body.email + " )");
            res.redirect("users");
        });
    });
});

    //Login Page
router.get("/login", function(req, res){
    res.render("login");
});

    //Login Logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/users",
    failureRedirect: "/login"
}) ,function(req, res) {

});

    //Logout
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
    console.log("Logging you out, bitch");
});


module.exports = router;