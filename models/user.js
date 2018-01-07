var mongoose = require("mongoose");


var userSchema = new mongoose.Schema({
    name: String,
    email: String,
    description: [
        {
            type: mongoose.Schema.Types.Array,
            ref : "ServiceName"
        }
     ]
});

module.exports = mongoose.model("User", userSchema);