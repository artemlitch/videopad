  //Keyboard Events
  $(window).keypress(function(e) {
    if (e.which == 32) {
        playPause(); 
    }
    if (e.which == 122) {
        goBack();
    }
    if (e.which == 120) {
        goForward();
    }
    if (e.which == 51) {
        //slowDown();
    }
    if (e.which == 52) {
        //speedUp();
    }
    if (e.which == 53) {
        //normalize();
    }
    if (e.which == 109) {
        mute();
    }
    if (e.which == 115) {
        sync();
    }
});

$(window).keydown(function(e) {
  if (e.which == 40) {
      turnDown();
  }
  if (e.which == 38) {
      turnUp();
  }
});
//End Keyboard Events
