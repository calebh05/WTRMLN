var express = require("express"),
    router  = express.Router({mergeParams: true}),
    User    = require("../models/user"),
    Description    = require("../models/description"),
    middleware = require("../middleware"),
    logger  = require("../lib/logs.js");

router.get("/descriptions", middleware.isLoggedIn, function(req, res) {
    res.render("descriptions");
});

router.post("/descriptions,", middleware.isLoggedIn, function(req, res){
    User.findById(req.params.id, function(err, user){
        if(err){
            logger.error(err);
            res.redirect("/users");
        } else {
            Description.create(user, function(err, desc){
                if(err){
                    logger.error(err);
                } else {
                    logger.info("Commentors username: " + req.user.username);
                    desc.description.push(desc);
                    desc.save();
                    res.redirect("/users/" + user._id);
                }
            });
        }
    });
});

module.exports = router;