var mongoose = require("mongoose");

//POST TO user

var serviceSchema = new mongoose.Schema({
    serviceName : String,
    info : {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        created: Date,
        updated: Date
    }
});

serviceSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model("Services", serviceSchema);

