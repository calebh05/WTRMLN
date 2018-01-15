var mongoose = require("mongoose");
    passportLocalMongoose = require("passport-local-mongoose");
    descSchema = require("./description");

var userSchema = new mongoose.Schema({
    email   : String,
    username: String,
    password: String,
    description: [descSchema]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);