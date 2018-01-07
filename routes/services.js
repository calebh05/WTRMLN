var express = require("express");
    router  = express.Router({mergeParams: true});
    User    = require("../models/user");
    Service    = require("../models/services");
    middleware = require("../middleware");

router.get("/services",middleware.isLoggedIn, function(req, res) {
    res.render("services");
});

module.exports = router;