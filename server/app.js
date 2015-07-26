var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var compression = require('compression');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var config = require('./config');

var app = express();
var port = process.env.PORT || 3000;

var isProduction = (process.NODE_ENV === 'production');

isProduction ? app.set('env', 'production') : app.set('env', 'development');

app.set('views', config.root + '/server/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(compression({
  threshold: 512
}));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(cookieParser());
app.use(express.static(path.join(config.root, 'client')));

app.use('/', routes);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


app.listen(port, function() {
  console.log('server listeninging on port', port, 'in', app.get('env') + ' mode');
});


module.exports = app;
