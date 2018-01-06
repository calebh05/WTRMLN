var mysql      = require("mysql");
var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'wtrmln',
    port     : 8892
});


db.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
});

db.
db.query('describe users;', function (error, results, fields) {
    if (error) throw error;
        console.log('The solution is: ', results);
});

db.end();