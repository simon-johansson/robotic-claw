var five = require("johnny-five");

var servo;

function init() {
  var board = new five.Board();
  board.on("ready", function() {

    servo = new five.Servo({
      pin: 10,
      range: [0,180],
      type: "standard",
    });
  });
}

module.exports = {
  set: function (deg) {
    if(typeof servo !== 'undefined') {
      servo.to(deg);
    }
  },
  init: init,
};
