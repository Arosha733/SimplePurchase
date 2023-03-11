var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var svgRouter = require('./routes/svg');
var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');
var adminRouter = require('./routes/admin');
var session = require('express-session');

var app = express();
app.use(cookieParser());
app.use(session({
  name: "user_key",
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000
}));

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('express-art-template'));
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'public')));

app.use('/svg', svgRouter);
/**
 *  All pages show routes
 * 所有的页面显示路由
 */
app.use('/', indexRouter);
/**
 * All api routes
 * 所有的api路由
 */
app.use('/api', apiRouter);
/**
 * All administrator requests
 * 所有的管理员请求
 */
app.use('/admin', adminRouter)

app.use(function (req, res, next) {
  res.status(404);
  res.render('error');
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;

  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);

  res.render('error');
});

module.exports = app;
