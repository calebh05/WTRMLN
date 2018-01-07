var mongoose = require("mongoose");
    User     = require("./models/user");
    Services = require("./models/services");

    var data = [
        {
            name: "User1",
            email: "User1@test.com",
            description: "User Uno"
        },
        {
            name: "User2",
            email: "User2@test.com",
            description: "User Dos"
        },
        {
            name: "User3",
            email: "User3@test.com",
            description: "User Tres"
        },
    ]


    function seedDb(){
        /// Remove all users
        User.remove({}, function(err){
            if(err){
                console.log(err);
            } else {
                console.log("Removed users!");
            }
            // Add users
            data.forEach(function(seed){
                User.create(seed, function(err, data){
                        if(err){
                            console.log(err);
                        } else {
                            console.log("Added user: " + data);
                            // Add a service
                            Services.create(
                                {
                                    serviceName : "Cheeto 1",
                                    dateStart   : Date.now(),
                                    dateEnd     : Date.now(30),
                                    IP          : "127.0.0.1",
                                    description : "Testing"
                                }, function(err, service){
                                    if(err){
                                        console.log(err);
                                    } else {
                                        data.description.push(service);
                                        data.save();
                                        console.log("Added " + service + " to " + data.name);
                                    }
                                });
                        }
                    });
                });
            });
        }

    module.exports = seedDb;