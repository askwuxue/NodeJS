const http = require('http');
const fs = require('fs');

let server = http.createServer((req, res) => {
    let file_path_name = './fs' + req.url;
    fs.writeFile(file_path_name, 'writeFile', (err) => {
        if (err) {
            res.end('write files failed');
        }
    });
    fs.readFile(file_path_name, (err, data) => {
        if (err) {
            res.end('read fils failed');
        } else {
            res.end(data);
        }
    })
});

server.listen(3000);