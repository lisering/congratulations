var mysql = require('mysql');

//local
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'state'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('数据库链接成功！');
});

module.exports = db;
