var mongoose = require("mongoose");
    User     = require("./models/user");
    Description = require("./models/description");

    var data = [
        {
            username: "User1",
            email: "User1@test.com",
            description: [
                {
                    serviceName: "Testing",
                    info:       "testing"
                }
            ]
        },
        {
            username: "User2",
            email: "User2@test.com",
            description: [
                {
                    serviceName: "Testing",
                    info:       "testing"
                }
            ]
        },
        {
            username: "User3",
            email: "User3@test.com",
            description: [
                {
                    serviceName: "Testing",
                    info:       "testing"
                }
            ]
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
                User.create(seed, function(err, activeUser){
                        if(err){
                            console.log(err);
                         } else {
                             console.log("Added " + activeUser.description + " ===> " + activeUser.username);
                                //Add a service
                            Description.create(
                                {
                                    serviceName: "Cheato 1",
                                    info        : "Some Text"
                                }, function(err, activeService){
                                    if(err){
                                        console.log(err);
                                    } else {
                                        activeUser.description.push(activeService);
                                        activeUser.save();
                                        console.log("Added new service");
                                    }
                                });
                        }

                    });
                });
            });
        }

    module.exports = seedDb;