const mysql = require('mysql');

// 1 连接 
// 那台服务器，用户名，密码，库
let db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'text'
});

// 2 查询
db.query("", (err, data) => {
    if (err) {
        console.log(err);
    }
    console.log(data);
});

db.query()


