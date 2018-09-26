let http = require('http');
let fs = require('http');
let querystring = require('querystring');
let urlLib = require('url');

const users = {"askwuxue": "131495"}; // {"name": "pass"}

let server = http.createServer(function (req, res) {
    res.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
    // 解析数据
    let str = '';
    req.on('data', function (data) {
        str += data;
    });
    req.on('end', function () {
        let parse = urlLib.parse(req.url, true);
        const url = parse.pathname;
        const GET = parse.query;
        // console.log(GET);
        // console.log(url);
        const POST = querystring.parse(str);
        // 处理用户的登录注册 反之处理post提交数据的逻辑
        if (url == '/user/') {
            switch (GET.act) {
                case 'reg':
                    // console.log('reg');
                    if (users[GET.user]) {
                        res.end(JSON.stringify({"ok": false, "msg": "此用户已存在"}));
                    } else {
                        res.end(JSON.stringify({"ok": true, "msg": "注册成功"}));
                        // console.log('success');
                        // console.log(JSON.stringify({"ok": true, "msg": "注册成功"}));
                    }
                    break;
                case 'log':
                    if (users[GET.user] == null) {
                        res.end(JSON.stringify({"ok": false, "msg": "用户不存在"}));
                    } else {
                        if (users[GET.pass] == users[pass]) {
                            res.end(JSON.stringify({"ok": true, "msg": "登录成功"}));
                        } else {
                            res.end(JSON.stringify({"ok": false, "msg": "密码错误"}));
                        }
                    }
                    break;
                default:
                    res.end(JSON.stringify({"ok": false, "msg": "未知的act"}));
                    break;
            }
        }
    })
});

server.listen(3000);