var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var multer=require("multer");
var cookiesession=require("cookie-session");
var cors=require("cors");


var app = express();




// 资源拖管
app.use(express.static(path.join(__dirname, 'public','template')));
app.use("/admin",express.static(path.join(__dirname, 'public','admin')));
app.use(express.static(path.join(__dirname, 'public')));

// 中间件配置
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cookiesession({
  name:"1905",
  keys:["aa","bb"],
  maxAge:1000*60*60*15
}))

//跨域
app.use(cors({
  "origin": ['http://127.0.0.1:8848'],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders:['Content-Type', 'Authorization']
}));

// 上传文件
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if(req.url.indexOf('user')!==-1 || req.url.indexOf('reg')!==-1){
      cb(null, path.join(__dirname, 'public','upload','user'))
    }else if(req.url.indexOf('banner')!==-1){
      cb(null, path.join(__dirname, 'public','upload','banner'))
    }else{
      cb(null, path.join(__dirname, 'public/upload/product'))
    }
  }
})
let multerobj= multer({storage});
app.use(multerobj.any())

// 路由
//admin
app.use('/admin/user', require('./routes/admin/user'));


// api
app.all('/api/*',require('./routes/api/params'))
app.use('/api/user', require('./routes/api/user'));
app.use('/api/banner', require('./routes/api/banner'));
app.use('/api/login', require('./routes/api/login'));
app.use('/api/logout', require('./routes/api/logout'));
app.use('/api/reg', require('./routes/api/reg'));
app.use('/api/scene',require('./routes/api/scene'))
app.use('/api/life',require('./routes/api/life'))
app.use('/api/beauty',require('./routes/api/Beauty'))
app.use('/api/:product', require('./routes/api/product'));



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send({err:1,msg:"错误的接口"})
  
});

module.exports = app;
