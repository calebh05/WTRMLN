var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var nuSchema = new mongoose.Schema({
    email   : String,
    username: { type: String, required: true, unique: true},
    password: String,
    description: {
        serviceName: String,
        info: {
            created_at: Date,
            updated_at: Date
        },
    }
});


nuSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Nu", nuSchema);