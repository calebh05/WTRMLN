var winston = require("winston");
require('winston-daily-rotate-file');

var tsFormat = new Date().toLocaleTimeString();
logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            name: "UserConsole",
            timestamp: tsFormat,
            colorize: true,
            level: "info"
        }),
        new (winston.transports.DailyRotateFile)({
            name:   "error-log",
            filename: './logs/-error.log',
            timestamp: tsFormat,
            datePattern: "yyyy-MM-dd",
            prepend: true,
            level: "error"
        }),
        new (winston.transports.DailyRotateFile)({
            name: "user-log",
            filename: './logs/-user.log',
            timestamp: tsFormat,
            datePattern: "yyyy-MM-dd",
            prepend: true
        })
    ]
});


module.exports = logger;

