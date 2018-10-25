const mysql = require('mysql');

// let db = mysql.createConnection({
//     host: 'localhost',
//     port: 3306,
//     user: 'root',
//     password: '1314995'
// })

// 连接池，默认是十个连接
let db = mysql.createPool({
    host: 'localhost',
    // 默认是3306端口
    port: 3306,
    user: 'root',
    password: '1314995',
    database: 'websocket'
})

db.query('SELECT * from user_table', (err, data) => {
    if (err) {
        console.log(err);
    } else {
        console.log(data);
    }
});
