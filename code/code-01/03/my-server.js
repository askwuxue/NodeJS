const express = require('express');

const myExpressParse = require('./my-express-parser');

let server = express();

server.listen(3000);

server.use(myExpressParse);

server.use('/', function (req, res) {
    // 为什么访问不了自己的中间件
    console.log(req.body);
})