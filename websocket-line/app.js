const http = require('http');
const io = require('socket.io');
const db = require('./mysql.js');

// 创建服务器
let httpServer = http.createServer()
// websocket 监听
let wsServer = io.listen(httpServer);

// 存所有的用户的sock对象
let socketList = [];
// 存用户的id
let user_id = '';
// 监听连接
wsServer.on('connection', socket => {
    // 每个用户的socket
    socketList.push(socket);
    // 用户的唯一身份标识符
    let current_user_server = Math.random().toString();
    // 登录
    socket.on('login', (userInfo) => {
        let username = userInfo[0];
        let password = userInfo[1];
        // 1. 后端验证
        if (username == '' || password == '') {
            socket.emit('log_ret', {
                "status": 0,
                "msg": "用户名或密码不能为空"
            })
            // 逻辑结束
            return;
        }
        // 2. 查询数据库 是否存在用户
        db.query(`SELECT * FROM user_table WHERE username = '${username}'`, (error, data) => {
            if (error) {
                socket.emit('log_ret', {
                    "status": 0,
                    "msg": "服务器繁忙,请稍后再试"
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
                        // 更新用户为在在线状态
                        db.query(`UPDATE user_table SET online = 1 WHERE username = '${username}'`, (error, data) => {
                            if (error) {
                                console.log('更新用户在线状态失败');
                                consolelog(error)
                            } else {
                                console.log('用户在线状态更新成功.....');
                            }
                        })
                        // 保存user_id
                        user_id = data[0].id;
                        // 更新成功
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
        // 2. 数据库查询后验证
        db.query(`SELECT username FROM user_table WHERE username = '${username}'`, (error, data) => {
            if (error) {
                socket.emit('reg_ret', {
                    "status": 0,
                    "msg": "服务器繁忙,请稍后再试..."
                })
            } else {
                // 已存在用户
                if (data.length) {
                    socket.emit('reg_ret', {
                        "status": 0,
                        "msg": "用户名已存在"
                    })
                    // 注册成功
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

    // 发表留言
    socket.on('speak', (speak) => {
        let current_user_client = speak[0];
        // 用户未登陆
        if (current_user_client !== current_user_server) {
            socket.emit('speak_ret', {
                "status": 0,
                "msg": "登陆后才能发表留言哦..."
            })
            return;
        }
        // 留言空
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
                item.emit('receive_msg', {
                    "status": 1,
                    "msg": text,
                    "current_user": current_user_server
                })
        })  
    })

    // 用户离线
    socket.on('disconnect', () => {
        // 更新用户状态为离线状态
        db.query(`UPDATE user_table SET online = 0 WHERE id = '${user_id}'`, (error, data) => {
            if (error) {
                console.log('用户离线--数据库错误');
            } else {
                // console.log(data);
            }
        })
        // 过滤离线用户
        socketList = socketList.filter(item => item != socket);
    })
})

httpServer.listen(3000, () => {
    console.log('server is running port 3000....');
})