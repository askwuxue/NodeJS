const http = require('http');
const fs = require('fs');

let server = http.createServer((request, response) => {
    console.log(request);
    if (request.url == '/') {
        fs.readFile('./www/index.html', (err, data) => {
            if (err) {
                response.writeHead(404);
                fs.readFile('./www/error/404.html', (err, data) => {
                    if (err) {
                        response.end('404 is not find........');
                    } else {
                        response.end(data);
                    }
                })
            } else {
                response.end(data);
            }
        })
    } else if (request.url == '/register') {

    } else if (request.url == '/login') {

    } else if (request.url == '/logout') {

    } else {

    }
})

server.listen(3000, () => {
    console.log('server is runing ..... port: 3000')
})