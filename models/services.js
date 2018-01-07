var mongoose = require("mongoose");

//POST TO user

var serviceSchema = new mongoose.Schema({
    serviceName : String,
    info : String
});

module.exports = mongoose.model("Services", serviceSchema);

