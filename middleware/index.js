var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("Error", "Please Login First!");
    res.redirect("/login");
};

middlewareObj.isAdmin = function(req, res, next){
    if(req.user.access.power === true){
        return next();
    }
    req.flash("Error", "Insufficient Access!");
    res.redirect("/");
};

module.exports = middlewareObj;