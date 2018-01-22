var mongoose    = require("mongoose");
    // passportLocalMongoose = require("passport-local-mongoose");

//POST TO user

var descSchema = new mongoose.Schema({
    serviceName : String,
    info        : String
}, { versionKey: false });

// descSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Description", descSchema);

