const fs = require('fs');
// readFile writeFile
// 回调
// 异步操作 多个操作同时进行 
// 同步进行 同时只是进行一个操作
// 读文件读取到的是二进制 toString 可以转成转换
fs.readFile('./fs/a.text', function (err, data) {
    if (err) {
        console.log('error');
    } else {
        console.log(data.toString());
    }
})