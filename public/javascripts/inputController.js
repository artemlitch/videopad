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

    if (e.which == 91 && thickness > 1) { // "[" Key
      brushSlider.setValue(thickness - thicknessAmt);
    }
    if (e.which == 93 && thickness < 60) { // "]" Key
      brushSlider.setValue(thickness + thicknessAmt);
    }
    if (e.which == 99) { //c key
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    socket.emit('clear');
    }
    if (e.which == 101) { //e key
        eraserPressed = true;
        setCursor();
    }
    if (e.which == 100) { //d key
    eraserPressed = false;
    setCursor();
    }


    //colour presets
    //Preset 1
    if (e.which == 49) { //1 key
        colour = colourPresets[0];
      $('#colour-preview').addClass('selectedColour');
      $('#colour-preview2').removeClass('selectedColour');
      $('#colour-preview3').removeClass('selectedColour');
      $('#colour-preview4').removeClass('selectedColour');
    }
    //Preset 2
    if (e.which == 50) { //2 key
        colour = colourPresets[1];
      $('#colour-preview').removeClass('selectedColour');
      $('#colour-preview2').addClass('selectedColour');
      $('#colour-preview3').removeClass('selectedColour');
      $('#colour-preview4').removeClass('selectedColour');
    }
    //Preset 3
    if (e.which == 51) { //3 key
        colour = colourPresets[2];
      $('#colour-preview').removeClass('selectedColour');
      $('#colour-preview2').removeClass('selectedColour');
      $('#colour-preview3').addClass('selectedColour');
      $('#colour-preview4').removeClass('selectedColour');
    }
    //Preset 4
    if (e.which == 52) { //4 key
        colour = colourPresets[3];
      $('#colour-preview').removeClass('selectedColour');
      $('#colour-preview2').removeClass('selectedColour');
      $('#colour-preview3').removeClass('selectedColour');
      $('#colour-preview4').addClass('selectedColour');
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
