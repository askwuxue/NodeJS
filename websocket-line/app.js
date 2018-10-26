const http = require('http');
const url = require('url');
const io = require('socket.io');
const db = require('./mysql.js');

let httpServer = http.createServer((request, response) => {

})

let wsServer = io.listen(httpServer);

wsServer.on('connection', socket => {
    // 登录
    socket.on('login', (userInfo) => {
        // console.log(userInfo);
        let username = userInfo[0];
        let password = userInfo[1];
        if (username == '' || password == '') {
            // 1. 验证信息
            socket.emit('log_ret', {
                "status": 0,
                "msg": "用户名或密码不能为空"
            })
            // 逻辑结束
            return;
        }
        // 2. 查询数据库查看是否存在用户
        let user_Info = db.query(`SELECT * FROM user_table WHERE username = 'askwuxue'`, (error, data) => {
            if (error) {
                socket.emit('log_ret', {
                    "status": 0,
                    "msg": "数据库错误了"
                })
            } else {
                // 用户不存在
                if (!data.length) {
                    socket.emit('log_ret', {
                        "status": 0,
                        "msg": "用户不存在"
                    })
                    // 验证密码是否正确
                } else {
                    if (password !== data[0].password) {
                        socket.emit('log_ret', {
                            "status": 0,
                            "msg": "用户名或者密码不正确"
                        })
                    } else {
                        socket.emit('log_ret', {
                            "status": 1,
                            "msg": "登录成功"
                        })
                    }
                }
            }
        });





        // console.log(user_Info);
        if (user_Info) {

        }
        
    })
})

httpServer.listen(3000, () => {
    console.log('server is running port 3000....');
})



// db.query('SELECT * from user_table', (err, data) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(data);
//     }
// });
