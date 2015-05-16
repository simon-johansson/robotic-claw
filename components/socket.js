
var servo  = require('./servo');
var io;

function init(server) {
  io = require('socket.io')(server);
  bindEvents(io);
}

function bindEvents() {

  io.on('connection', function (socket) {

    socket.on('slider', function (data) {
      servo.set(data.data);
    });

    socket.on('gyro', function (data) {
      console.log(data.x);
      servo.set(data.x);
    });
  });
}

function clientCount() {
  if (io && io.engine.clientsCount) {
    return io.engine.clientsCount;
  }
}

module.exports = {
  init: init,
  clients: clientCount
};
