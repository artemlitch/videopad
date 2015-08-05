var socket = io();
var ytKeysEnabled = true;

$('#infoButton').on('click', function() {
    ytKeysEnabled = false;
});

$('.exitInfo').on('click', function() {
    ytKeysEnabled = true;
});

//Input Controller For Handling Custom YouTube Controls
$(window).keypress(function(e) {
    if(ytKeysEnabled){
        if (e.which == 32) { //spacebar
            playPause(); 
        }
        if (e.which == 122 || e.which == 90) { //z key
            slowDown();
            socket.emit('playSlower');
        }
        if (e.which == 120 || e.which == 88) { //x key
            speedUp();
            socket.emit('playFaster');
        }
        if (e.which == 110 || e.which == 78) { //n key
            normalize();
            socket.emit('normalPlayback');
        }
        if (e.which == 109 || e.which == 77) { //m key
            mute();
        }
        if (e.which == 115 || e.which == 83) { //s key
            sync();
        }
    }
});

$(window).keydown(function(e) {
    if(ytKeysEnabled){
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
    }
});
//End Keyboard Events
