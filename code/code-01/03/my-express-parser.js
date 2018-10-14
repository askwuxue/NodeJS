const querystring = require('querystring');

module.exports = function (req, res, next) {
    let str = '';
    req.on('data', function (data) {
        str += data;
    });
    req.on('end', function () {
        req.body = querystring.parse(str);
        // 注意 next 方法的位置 只能是在 这里
        next();
    });
}