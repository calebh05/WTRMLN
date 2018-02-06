var express = require("express"),
    router  = express.Router(),
    User    = require("../models/user"),
    passport = require("passport"),
    flash   = require("connect-flash");

router.get("/", function(req, res) {
    res.render("home");
});

    //Register Form
router.get("/register", function(req, res){
    res.render("register");
});

    //Register Signup POST
router.post("/register", function(req, res){
    var email       = req.body.email;
        userName    = req.body.username;
        descrip     = req.body.description;
        // Create new Users
    User.register(new User({ email: email, username: userName, description: descrip }), req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("Error", "Username already taken.");
            res.render("register", { message: req.flash("Error") });
        }
        passport.authenticate("local")(req, res, function(){
            user.save(user.access.dateCreated = Date.now(), user.access.power = false);
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