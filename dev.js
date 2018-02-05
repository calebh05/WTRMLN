var express = require("express"),
    app                 = express(),
    bodyParser          = require("body-parser"),
    methodOverride      = require("method-override"),
    expressSanitizer    = require("express-sanitizer"),
    mongoose            = require("mongoose"),
    User                = require("./models/user"),
    passport            = require("passport"),
    LocalStrategy       = require("passport-local"),
    ejs                 = require("ejs"),
    flash               = require("connect-flash"),
    middlewareObj       = require("./middleware"),
    config              = require('./config/config.dev.json');


var userRoutes = require("./routes/users");
serviceRoutes = require("./routes/descriptions");
authRoutes = require("./routes/index");

server              = app.listen(8080);
if(server) {
    /*console.log(server);*/
    console.log("Server Starting...");
}

// seedDb();
var db = {
    uri : "mongodb://",
    host: config.wtrmln.dev.host,
    port: config.wtrmln.dev.port,
    name: config.wtrmln.dev.db
};

mongoose.connect(db.uri + db.host + db.port + db.name);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.use(flash());
app.enable('trust proxy');

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
    res.locals.message = req.flash("error");
    res.locals.title   = "WTRMLN";
    next();
});

app.use(authRoutes);
app.use(userRoutes);
app.use(serviceRoutes);


app.get("/secret", middlewareObj.isLoggedIn, function(req, res){
    res.render("secret");
});

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
    }, 5*1000);
};

// listen for TERM signal .e.g. kill
process.on ('SIGTERM', gracefulShutdown);

// listen for INT signal e.g. Ctrl-C
process.on ('SIGINT', gracefulShutdown);