;(function () {

  var sliderCache = 90;

  $('[data-slider]').on('change.fndtn.slider', function(ev){
    var data = parseInt($(this).attr('data-slider'));

    if(sliderCache !== data) {
      socket.emit('slider', { data: data });
      sliderCache = data;
      console.log(data);
    }
  });

})();
