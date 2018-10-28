/**********************************************************/
/*                                                        */
/*                GET THE PACKAGES WE NEED                */
/*                                                        */
/**********************************************************/
var express       = require('express');
var path          = require('path');
var favicon       = require('serve-favicon');
var logger        = require('morgan');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var mongoose      = require('mongoose');
var jwt    			  = require('jsonwebtoken');

var app           = express();

app.set('superSecret', 'eliosdriveflnd0105');

/**********************************************************/
/*                                                        */
/*                      CONFIGURATION                     */
/*                                                        */
/**********************************************************/
//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/elios-drive';
mongoose.connect(mongoDB, { useMongoClient: true });

// Different routes
var index = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var search = require('./routes/files');
var calendar = require('./routes/calendar');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//// HOMEPAGE ////
app.use('/login', login)

/**********************************************************/
/*                                                        */
/*                  NORMAL USER ROUTES                    */
/*                                                        */
/**********************************************************/
/* === Token validation : normal user === */
app.use(function(req, res, next) {
  var token = req.cookies.auth;
  if (token) {
    jwt.verify(token, 'eliosdriveflnd0105', function(err, decoded) {
      if (err) {
        return res.redirect('/login');
      } else {
        req.decoded = decoded;
        next();}
      });
  } else {return res.redirect('/login');}
});

app.use('/', index);
app.use('/files', search);
app.use('/calendar', calendar)
/**********************************************************/
/*                                                        */
/*                   ADMIN USER ROUTES                    */
/*                                                        */
/**********************************************************/
/* === Admin validation === */
app.use(function(req, res, next) {
  var decoded = jwt.decode(req.cookies.auth);
  if (decoded.data.admin === true) {next();}
  else {  console.log('User trying to access admin informations.'),
      res.redirect('back');}
});

app.use('/users', users);

/**********************************************************/
/*                                                        */
/*                     ERROR ROUTES                       */
/*                                                        */
/**********************************************************/

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

//// EXPORT ////
module.exports = app;
