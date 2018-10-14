const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
    let body = url.parse(req.url, true);
    // console.log(body.query);
    // res.write(body.query.user);
    res.write('\n');
    res.end(body.query.pass);

}).listen(3000);
