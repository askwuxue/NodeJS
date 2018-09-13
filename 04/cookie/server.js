const express = require('express');
const cookieParser = require('cookie-parser');

const server = express();

server.listen(3000);

server.use(cookieParser('sdhjfksdhfshflaf'));
server.use('/aaa/a.html', function (req, res) {
    res.cookie('wuxue', '1314995', {path: '/aaa', maxAge: 30 * 24 * 60 * 60 * 60, signed: true});
    res.send('ok');
    console.log(req.signedCookies);
})