let http = require('http');
let fs = require('fs');
let url = require('url');
let querystring = require('querystring');

let server = http.createServer(function (req, res) {
    // get
    let parse = url.parse(req.url, true);

    let pathName = parse.pathname;

    // get请求提交的数据
    const get_query = parse.query;

    // post
    let str = '';
    
    // post提交的数据量大的时候是 分次提交的的
    let i = 0;
    req.on('data', function (data) {
        str += data;
        console.log(`第${i++}次post`);
    });
    req.on('end', function () {
        const post_body = querystring.parse(str);
    });

    // 文件的读取
    let filesPath = './www' + pathName;
    fs.readFile(filesPath, function (err, data) {
        if (err) {
            res.end('404');
        } else {
            res.end(data.toString());
        }
    })
    // console.log(querystring.parse())
    // console.log(parse);
    // console.log(get_query);
});

server.listen(3000);