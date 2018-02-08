var express = require("express"),
    app                 = express(),
    bodyParser          = require("body-parser"),
    methodOverride      = require("method-override"),
    expressSanitizer    = require("express-sanitizer"),
    mongoose            = require("mongoose"),
    winston             = require("winston"),
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

// Log and filesystem constants
const fs = require('fs');
const logDir = 'logs';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

 // set logger constants & log files
const tsFormat = new Date().toLocaleTimeString();
const logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            name: "Console",
            timestamp: tsFormat,
            colorize: true,
            level: "info"
        }),
        new (require('winston-daily-rotate-file'))({
            name: "info logs",
            filename: "./logs/-info.logs",
            timestamp: tsFormat,
            datePattern: "yyyy-MM-dd",
            prepend: true,
            level: "info"
        }),
        new (require('winston-daily-rotate-file'))({
            name: "error logs",
            filename: "./logs/-error.logs",
            timestamp: tsFormat,
            datePattern: "yyyy-MM-dd",
            prepend: true,
            level: "error"
        })
    ]
});
// logger types
// logger.debug('DEBUG');
// logger.verbose('VERBOSE');
// logger.info('INFO');
// logger.warn('WARNING');
// logger.error('ERROR');

// seedDb();
var db = {
    uri : "mongodb://",
    host: config.wtrmln.dev.host,
    port: config.wtrmln.dev.port,
    name: config.wtrmln.dev.db
};

mongoose.connect(db.uri + db.host + db.port + db.name);
if(mongoose.connection){
    logger.info("MongoDB connected successfully at: " + db.host + db.port);
}

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
    logger.warn("Dracarys....");
    server.close(function() {
        logger.info("It is done, my lord.");
        // These are currently throwing an exception due to transport not being associated to this instance
        // logger.remove("Error Logs");
        // logger.remove("Info Logs");
        process.exit()
    });

    // if after
    setTimeout(function() {
        logger.error("Could not close connections in time, forcefully shutting down");
        process.exit()
    }, 5*1000);
};

// listen for TERM signal .e.g. kill
process.on ('SIGTERM', gracefulShutdown);

// listen for INT signal e.g. Ctrl-C
process.on ('SIGINT', gracefulShutdown);