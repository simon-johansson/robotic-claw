$(document).foundation();

var sliderCache = 90;
$('[data-slider]').on('change.fndtn.slider', function(ev){
  var data = $(this).attr('data-slider');
  if(sliderCache !== data) {
    socket.emit('slider', { data: data });
    console.log(data);
  }
});

var socket = io.connect();

// socket.on('kicked', function () {
//   console.log('kicked');
//   window.location.replace(window.location.href + "/kicked");
// });

// $(document).on('keydown', function (ev) {
//   if (ev.keyCode == 39) {
//     console.log('Keypress: right');
//     socket.emit('keypress:right');
//   } else if (ev.keyCode == 37) {
//     console.log('Keypress: left');
//     socket.emit('keypress:left');
//   }
// });

if(window.DeviceMotionEvent) {
  window.addEventListener("devicemotion", motion, false);
} else {
  $('.tilt-msg, .or').hide();
}

function motion(event) {
  var x = Math.floor(Math.abs(event.accelerationIncludingGravity.x + 10) * (180 / 20));
  var y = Math.round(event.accelerationIncludingGravity.y);
  var z = Math.round(event.accelerationIncludingGravity.z);

  var msg = "Accelerometer: " + x + ", " + y + ", " + z;

  socket.emit('gyro', {
    x: x,
    y: y,
    z: z,
    msg: msg,
  });
}
