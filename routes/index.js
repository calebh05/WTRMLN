var express = require("express"),
    router  = express.Router(),
    User    = require("../models/user"),
    passport = require("passport"),
    middleware = require("../middleware"),
    Nu     = require("../models/nuSchema"),
    flash = require("connect-flash")

router.get("/", function(req, res) {
    res.render("home");
});

    //Register Form
router.get("/register", function(req, res){
    res.render("register");
});

    //Register Signup POST
router.post("/register", function(req, res){
    var username = req.body.username;
        password = req.body.password;
        email = req.body.email;
        description = req.body.description;
    User.register(new User({email: req.body.email, username: req.body.username, description: req.body.description }), req.body.password, function(err, user){
        if(err){
            console.log(err);
            res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            console.log(user);
            console.log("Created new User: " + req.body.username + "( " + req.body.email + " ) " + req.body.description );
            res.redirect("users");
        });
    });
});


    //Login Page
router.get("/login", function(req, res){
    res.render("login", {message: req.flash("Error")});
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
    req.flash("error", "Logged you out");
    res.redirect("/");
    console.log("Logged user out");
});


module.exports = router;