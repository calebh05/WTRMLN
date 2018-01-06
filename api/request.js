var request = require('request');

console.log("Sunset in Hawaii is at ...");
request('http://omdbapi.com/?s=ohio', function(error, response, body) {
    if (error){
    console.log("Something went wrong");
    console.log(error);
} else {
    if(response.statusCode == 200) {
        //Things worked!
        var parsedData = JSON.parse(body);
        console.log(parsedData["query"]["results"]["channel"]["astronomy"]["sunset"]);
        }
    }
});