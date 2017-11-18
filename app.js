var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var session = require('express-session');

var configDB = require('./config/database');

mongoose.connect(configDB.url);

require('./config/passport')(passport);

var index = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');
var client = require('./routes/client');
var owner = require('./routes/owner');

var UserModel = require('./model/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret:'dReservation',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/', client);
app.use('/user', client);
app.use('/admin', admin);
app.use('/owner', owner);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

UserModel.find({role:'admin'}).exec(function(err, data){
  if(data.length == 0){
    var admin = new UserModel();
    admin.role = 'admin';
    admin.status = 'active';
    admin.local.password = admin.generateHash("admin");
    admin.local.email = "book@admin.com";
    admin.save(function(err){
      if(err) process.exit(1);
    })
  }
})

UserModel.find({role:'owner'}).exec(function(err, data){
  if(data.length == 0){
    var owner = new UserModel();
    owner.role = 'owner';
    owner.status = 'active';
    owner.local.password = owner.generateHash("owner");
    owner.local.email = "book@owner.com";
    owner.save(function(err){
      if(err) process.exit(1);
    })
  }
})

module.exports = app;
