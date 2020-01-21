var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var config = require('./config');

var index = require('./routes/index');
var users = require('./routes/users');
var issuers = require('./routes/issuers');
var admin = require('./routes/admin');
var comments = require('./routes/comments');
var deals = require('./routes/deals');
var invest = require('./routes/invest');

var cors = require('cors');


var app = express();
//app.enable('trust proxy');

//remove from production

app.use(cors());

/*
app.use(function(req, res, next) {
	console.log("asdf2 set CORS");
	//req.header("Access-Control-Allow-Origin", "*");
	//req.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});
*/

//enable on bluemix for https
/*
app.use(function (req, res, next) {

        if (req.secure) {
                // request was via https, so do no special handling
                next();
        } else {
                // request was via http, so redirect to https
                res.redirect('https://' + req.headers.host + req.url);
        }
});
*/


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//Mongoose
mongoose.connect(config.mongoUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("Connected correctly to server");
});

app.set('db', db);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// passport config
var User = require('./models/user');
app.use(passport.initialize());
passport.use(new LocalStrategy(User.authenticate()));
//passport.serializeUser(User.serializeUser());
passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());
/*
passport.deserializeUser(function(id, done) {
	console.log("inside deserialize:"+id);
    User.findById(id, function(err, user) {
		console.log("inside deserialize2:"+user);
        done(err, user);
    });
});
*/


app.use('/', index);
app.use('/users', users);
app.use('/issuers', issuers);
app.use('/admin', admin);
app.use('/comments', comments);
app.use('/deals', deals);
app.use('/invest', invest);

app.use('/javascripts', express.static(__dirname + '/javascripts'));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use('/styleSheets', express.static(__dirname + '/styleSheets'));
app.use('/images', express.static(__dirname + '/images'));
app.use('/font-awesome', express.static(__dirname + '/node_modules/font-awesome'));
app.use('/rxjs', express.static(__dirname + '/node_modules/@rxjs/rx/dist'));
app.use('/angular', express.static(__dirname + '/node_modules/angular'));
app.use('/fontawesome', express.static(__dirname + '/fontawesome'));





app.use(express.static(__dirname + '/public'));





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



module.exports = app;
