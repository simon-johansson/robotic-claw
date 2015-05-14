var path = require('path');
var http = require('http');

var express        = require('express');
var ip             = require('my-local-ip');
var wifiName       = require('wifi-name');
var lessMiddleware = require("less-middleware");

if(!process.env.NO_CLAW) {
  var servo  = require('./components/servo').init();
}
var socket = require('./components/socket');

var app = express();

var port = process.env.PORT || '3000';
app.set('port', port);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(lessMiddleware(__dirname + "/public", { force: true }));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res, next) {
  if( socket.clients() > 1 ) {
    res.render('occupied');
  } else {
    res.redirect('/controller');
  }
});

app.get('/controller', function(req, res, next) {
  res.render('controller', {
    questionnaire: require('./components/questionnaire')
  });
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

// redirect in case of catching a error
app.use(function(req, res, next) {
  res.redirect('/');
});

var server = http.Server(app);
socket.init(server);
server.listen(port);

server.on('error', function (error) {
  throw error;
}).on('listening', function () {
  console.log('Running on port', port);
});

module.exports = app;
