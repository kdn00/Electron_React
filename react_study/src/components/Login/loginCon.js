var mysql = require('mysql');
var info = require('./sr')
var db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'!xmrtn7061',
    database:'study'
});
db.connect();