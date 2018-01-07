var mongoose = require("mongoose");

var serviceSchema = new mongoose.Schema({
    serviceName : String,
    dateStart   : Date,
    dateEnd     : Date,
    ipAddress   : String,
    description : String,
});

module.exports = mongoose.model("Services", serviceSchema);

