;(function () {

  var gyroCache = 90;

  if(window.DeviceMotionEvent) {
    window.addEventListener("devicemotion", motion, false);
  }

  function motion(event) {
    var deg = 180;
    var pos = event.accelerationIncludingGravity.x; // num between -10 and 10
    var x = Math.floor(Math.abs(pos + 10) * (deg / 20));

    if(gyroCache !== x) {
      socket.emit('gyro', { x: x });
      gyroCache = x;
    }
  }

})();
