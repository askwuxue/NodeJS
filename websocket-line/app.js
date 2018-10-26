const http = require('http');
const url = require('url');
const io = require('socket.io');
const db = require('./mysql.js');

let httpServer = http.createServer((request, response) => {

})

let wsServer = io.listen(httpServer);

// 用来存所有的用户的sock
let socketList = [];
let user_id = '';
wsServer.on('connection', socket => {
    // 每个用户的socket进入数组
    socketList.push(socket);
    // 用户的唯一身份标识符
    let current_user_server = Math.random().toString();
    // console.log(current_user_server);
    // 登录
    socket.on('login', (userInfo) => {
        // console.log(userInfo);
        let username = userInfo[0];
        let password = userInfo[1];
        // console.log(username, password);
        // 用户在线状态
        let uset_log_status = 0;
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
        db.query(`SELECT * FROM user_table WHERE username = '${username}'`, (error, data) => {
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
                    // console.log('wuxue=============' + data[0].username, data[0].password)
                    if (password !== data[0].password) {
                        socket.emit('log_ret', {
                            "status": 0,
                            "msg": "用户名或者密码不正确"
                        })
                    } else {
                        // 更新用户的状态到数据库中
                        db.query(`UPDATE user_table SET online = 1 WHERE username = '${username}'`, (error, data) => {
                            if (error) {
                                console.log(error);
                            } else {
                                // console.log(data);
                            }
                        })
                        // 保存user——id
                        user_id = data[0].id;
                        // console.log(user_id);
                        socket.emit('log_ret', {
                            "status": 1,
                            "msg": "登录成功",
                            "random": current_user_server
                        })
                    }
                }
            }
        });
    })

    // 注册
    socket.on('reg', (user_Info) => {
        let username = user_Info[0];
        let password = user_Info[1];
        // 1. 验证   正则表达式
        if (username == '' || password == '') {
            socket.emit('reg_ret', {
                "status": 0,
                "msg": "用户名或者密码不合法"
            })
            return;
        }
        // 2. 数据库验证
        db.query(`SELECT username FROM user_table WHERE username = '${username}'`, (error, data) => {
            if (error) {
                socket.emit('reg_ret', {
                    "status": 0,
                    "msg": "服务器繁忙,请稍后再试..."
                })
            } else {
                // 判断是否存在用户
                if (data.length) {
                    socket.emit('reg_ret', {
                        "status": 0,
                        "msg": "用户名已存在"
                    })
                    // 写入数据库
                } else {
                    db.query(`INSERT INTO user_table (username, password) VALUES ('${username}', '${password}')`, (error, data) => {
                        if (error) {
                            socket.emit('reg_ret', {
                                "status": 0,
                                "msg": "服务器繁忙,请稍后再试...."
                            })
                        } else {
                            socket.emit('reg_ret', {
                                "status": 1,
                                "msg": "注册成功"
                            })
                        }
                    })
                }
            }
        });

    })

    // 发表
    socket.on('speak', (speak) => {
        // console.log(speak[0]);
        let current_user_client = speak[0];
        // 判断用户登陆状态
        if (current_user_client !== current_user_server) {
            socket.emit('speak_ret', {
                "status": 0,
                "msg": "登陆后才能发表留言哦..."
            })
            return;
        }
        // 验证是否为空
        let text = speak[1];
        if (text === '') {
            socket.emit('speak_ret', {
                "status": 0,
                "msg": "发表的内容不能为空哦...."
            })
            return;
        }
        // 发表成功
        socket.emit('speak_ret', {
            "status": 1,
            "msg": "发表成功"
        })

        // 推送留言
        socketList.forEach(item => {
            // console.log(item);
                console.log('tuisong ');
                item.emit('receive_msg', {
                    "status": 1,
                    "msg": text,
                    "current_user": current_user_server
                })
        })  
    })

    // 用户离线
    socket.on('disconnect', () => {
        // 将用用户的在线状态变为离线状态
        db.query(`UPDATE user_table SET online = 0 WHERE id = '${user_id}'`, (error, data) => {
            if (error) {
                console.log('用户离线--数据库错误');
            } else {
                // console.log(data);
            }
        })
        socketList = socketList.filter(item => item != socket);
    })
})

httpServer.listen(3000, () => {
    console.log('server is running port 3000....');
})