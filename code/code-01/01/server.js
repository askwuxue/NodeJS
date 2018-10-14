const http = require('http');

// 请求 响应
let server = http.createServer(function (req, res) {
    // console.log(req);
    // res.write(req.url);
    // 可以end返回同时停止
    res.end();  
});

// 监听
server.listen(3000);


