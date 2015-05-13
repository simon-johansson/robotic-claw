var path = require('path');
var http = require('http');

var express = require('express');
var debug = require('debug')('robot-claw:server');
var ip = require('my-local-ip');
var wifiName = require('wifi-name');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var lessMiddleware = require("less-middleware");
var five = require("johnny-five");
var debug = require('debug')('robot-claw:server');
var io, board, servo, led;

// board = new five.Board();
// board.on("ready", function() {
//   servo = new five.Servo({
//     pin:10,
//     range: [0,180],
//     type: "standard",
//     // center:true
//   });
// });

// var routes = require('./routes/index');
// var users = require('./routes/users');

var app = express();

var port = process.env.PORT || '3000';
app.set('port', port);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(__dirname + "/public", {
  force: true
}));
app.use(express.static(__dirname + '/public'));

// app.use('/users', users);
app.get('/', function(req, res, next) {
  if( io.engine.clientsCount && io.engine.clientsCount > 0 ) {
    res.render('occupied');
  }
  res.render('index');
});

app.get('/controller', function(req, res, next) {
  res.render('index');
});

app.get('/instructions', function(req, res, next) {
  wifiName(function (err, name) {
    res.render('instructions', {
      ip: ip(),
      port: port,
      wifi: name
    });
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var server = http.Server(app);
io = require('socket.io')(server);

io.on('connection', function (socket) {

  // socket.on('kick', function (data) {
  //   socket.emit('kicked');
  //   if (io.sockets.connected[socket.id]) {
  //     io.sockets.connected[socket.id].disconnect();
  //   }
  // });

  socket.on('slider', function (data) {
    // servo.to(data.data);
  });

  socket.on('keypress:right', function (data) {
    servo.to(180);
  });

  socket.on('keypress:left', function (data) {
    servo.to(0);
  });

  var x = 90;
  socket.on('gyro', function (data) {
    // servo.to(data.x);
    // console.log(data.x);
  });
});

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
  ? 'Pipe ' + port
  : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
  ? 'pipe ' + addr
  : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

 server.listen(port);
 server.on('error', onError);
 server.on('listening', onListening);

 module.exports = app;
