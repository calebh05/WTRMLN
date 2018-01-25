var mongodb = require('mongodb');
var mongoose = require('mongoose');
var http = require('http');
var server = http.createServer(function (request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.end("Hello World\n");
});
server.listen(8080);
console.log("Server running at http://159.89.86.209:8080/");


var options = {
  user: 'wtrmlnTx',
  pass: 'test',
  auth: {
	authDb: 'wtrmln'
    }
};

var db = 'mongodb://159.89.86.209:27017/test';
mongoose.connect(db);
