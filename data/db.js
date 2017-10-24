var mysql = require('mysql');

//local
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'state'
});

//online
// var db = mysql.createConnection({
//     host: 'rm-2zef8o5q81788s731.mysql.rds.aliyuncs.com',
//     user: 'state',
//     password: '6c2c4fb96e7c580J',
//     database: 'state'
// });

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('数据库链接成功！');
});

module.exports = db;