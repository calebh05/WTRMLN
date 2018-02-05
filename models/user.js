var mongoose = require("mongoose");
    passportLocalMongoose = require("passport-local-mongoose");

var descSchema = new mongoose.Schema({
    serviceName : String,
    info        : String
}, { versionKey: false, _id : false });

var Desc = mongoose.model("Desc", descSchema);

var userSchema = new mongoose.Schema({
    email   : String,
    vitals  : {
        username: String,
        password: String,
        description: {
            serviceName: String,
            info    :   String
        }
    },
    access: {
        power: Boolean,
        dateCreated: { type: Date, default: Date.now() },
        dateUpdated: { type: Date }
    }
}, { versionKey: false });

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);