  var socket = io();
  //Keyboard Events
  $(window).keypress(function(e) {
    if (e.which == 32) { //spacebar
        playPause(); 
    }
    if (e.which == 122) { //z key
        slowDown();
        socket.emit('playSlower');
    }
    if (e.which == 120) { //x key
        speedUp();
        socket.emit('playFaster');
    }
    if (e.which == 110) { //n key
        normalize();
        socket.emit('normalPlayback');
    }
    if (e.which == 109) { //m key
        mute();
    }
    if (e.which == 115) { //s key
        sync();
    }
});

$(window).keydown(function(e) {
  if (e.which == 40) { //down arrow
      turnDown();
  }
  if (e.which == 38) { //up arrow
      turnUp();
  }
  if (e.which == 37) { //left arrow
      goBack();
  }
  if (e.which == 39) { //right arrow
      goForward();
  }
});
//End Keyboard Events
