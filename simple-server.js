/**
 * Created by chaihao on 2017/5/11.
 */
var express = require('express');
var compression = require('compression'); // gzip，内网联调可以打开。 mod by clj. on 2018.11.14
var path = require('path');
var fs = require('fs');
var app = express();
// var api = require('../routes/api');
// var history = require('connect-history-api-fallback'); // -- Author by clj. on 2017.2.10
var bodyParser = require('body-parser'); // -- Author by clj. on 2017.2.10
var portfinder = require('portfinder');

var static_path = path.join(__dirname, "dist");

var PROJECT_NAME = process.env["PROJECT_NAME"] || 'comb';

//设置允许跨域访问该服务.
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});

// app.all("*", function(req,res,next) { //设置允许跨域的域名，*代表允许任意域名跨域
//     res.header("Access-Control-Allow-Origin","*"); //允许的header类型
//     res.header("Access-Control-Allow-Headers","content-type"); //跨域允许的请求方式
//     res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
//     if (req.method.toLowerCase() == 'options') res.send(200); //让options尝试请求快速结束
//     else next();
// });

app.use(compression()); // gzip，内网联调可以打开。 mod by clj. on 2018.11.14

app.use(function (req, res, next) {
    console.log('%s %s %s', req.method, req.url, req.path);
    next();
});

// handle fallback for HTML5 history API
// app.use(require('connect-history-api-fallback')())

console.log("static_path %s %s", static_path, fs.existsSync(static_path));

app.use(express.static(static_path, {
    "index": "index.html",
    maxAge: 360000
}));

app.use(bodyParser.json()); // -- Author by clj. on 2017.2.10
app.use(bodyParser.urlencoded({extended: false})); // -- Author by clj. on 2017.2.10
// // serve pure static assets
// var staticPath = path.posix.join('./', 'static')
// app.use(staticPath, express.static('./static'))

// app.use('/api', api);
// app.use(history({
//     index: 'index.html'
// })); // -- Author by clj. on 2017.2.10

app.use("/" + PROJECT_NAME, function (req, res) {
    res.sendFile(path.join(static_path, "/" + PROJECT_NAME + "/index.html"));
});

app.use(function (req, res) {
    res.redirect("/" + PROJECT_NAME);
});

portfinder.basePort = 3001;
portfinder.highestPort = 3999;
portfinder.getPortPromise().then(port => {
    var server = app.listen(port, function () {
        var host = server.address().address;
        var port = server.address().port;

        console.log('Example app listening at http://%s:%s', host, port);
    });
}).catch(e => {
    console.log(e);
});

// var server = app.listen(3001, function () {
//     var host = server.address().address;
//     var port = server.address().port;
//
//     console.log('Example app listening at http://%s:%s', host, port);
// });
