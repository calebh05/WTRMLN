var mongoose = require("mongoose");
var db = 'mongodb://localhost:27017/test';
mongoose.connect(db);

var descSchema = new mongoose.Schema({
    serviceName : String,
    info        : String
}, { versionKey: false });

var Desc = mongoose.model("Desc", descSchema);

var testSchema = new mongoose.Schema({
    email   : String,
    username: String,
    password: String,
    description: [descSchema]
}, { versionKey: false });

var Test = mongoose.model("Test", testSchema);

// var newTest = new Test({
//     email: "test2@round.com",
//     name: "Test User 2",
//     password: "test",
//     description: [{
//         serviceName: "",
//         info       : ""
//     }]
// });

// newTest.description.push({
//     serviceName: "Test Push",
//     info: "Oh yea baby"
// });

// newTest.save(function(err, user){
//     if(err){
//         console.log(err);
//     } else {
//         console.log(user);
//     }
// });
//
Test.findOne({email: "test2@round.com"}, function(err, test){
    if(err || test.description.info !== "") {
        console.log(err);
    } else {
        test.remove();
//     } else {
//         test.description.push({
//             serviceName: "fresh",
//             info: "fresh"
//         });
//         test.save(function(err, test){
//             if(err){
//                 console.log(err);
//             } else {
//                 console.log(test);
//             }
//         });
    }
});
//
// Test.findOne({email: "test2@round.com"}, function(err, test){
//     if(err) {
//         // console.log(err);
//     } else {
//         test.description.push({
//             serviceName: "fresh",
//             info: "fresh"
//         });
//         test.save(function(err, test){
//             if(err){
//                 console.log(err);
//             } else {
//                 console.log(test);
//             }
//         });
//     }
// });
//
// var newDesc = new Desc({
//     serviceName: "Test Desc",
//     info    : "Test info"
// });
//
// newDesc.save(function(err, desc){
//     if(err){
//         console.log(err);
//     } else {
//         console.log(desc);
//     }
// });