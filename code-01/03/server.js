const express = require('express');
const expressStatic = require('express-static');

// 用户数据
const users = {"askwuxue": "1314995"};

let server = express();

server.listen(3000);

// 登录
server.get('/login', function (req, res) {
    // 注意 此时不能使用req.query[user] 方式  因为此时用户没有发起请求 会导致user 是未定义的状态 访问不到  会是未定义的状态 导致报错
    let user = req.query.user;
    let pass = req.query.pass;
    if (users[user] == null) {
        res.send({"ok": false, "msg": "用户不存在"});
    } else {
        if (users[user] == pass) {
            res.send({"ok": true, "msg": "登录成功"});
        } else {
            res.send({"ok": false, "msg": "用户名或者密码错误"});
        }
    }
})

server.use(expressStatic('./www'));