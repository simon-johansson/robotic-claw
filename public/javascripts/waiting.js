$(document).foundation();

var socket = io.connect();

$('.button').on('click', function(event) {
  event.preventDefault();
  console.log(window.location.href);
  window.location.replace(window.location.href + "controller");
});
