var mongoose    = require("mongoose");
    express     = require("express");
    router      = express.Router({mergeParams: true});
    User        = require("../models/user");
    Description     = require("./description");
    middleware  = require("../middleware");

//POST TO user

var descSchema = new mongoose.Schema({
    serviceName : String,
    info : {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    }
});

module.exports = mongoose.model("Description", descSchema);

