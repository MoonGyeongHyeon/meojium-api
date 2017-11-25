var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var test = require('./routes/test');
var user = require('./routes/db_user');
var museum = require('./routes/db_museum');
var image_loader = require('./routes/image_loader');
var story = require('./routes/db_story');
var story_content = require('./routes/db_story_content');
var search = require('./routes/db_search');
var review = require('./routes/db_review');
var favorite = require('./routes/db_favorite');
var stamp = require('./routes/db_stamp');
var tasting = require('./routes/db_tasting');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// port setup
app.set('port', process.env.PORT || 80);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/test', test);
app.use('/user', user);
app.use('/museum', museum);
app.use('/image', image_loader);
app.use('/story', story);
app.use('/content', story_content);
app.use('/search', search);
app.use('/review', review);
app.use('/favorite', favorite);
app.use('/stamp', stamp);
app.use('/tasting', tasting);

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

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});
