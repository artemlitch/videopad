var tag = document.createElement('script');;
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var socket = io();
var player;
var videoState;
var newUser = true;
var moveSlider=setInterval(function () {myTimer()}, 1000);;
var totalVideoTime='';
 
function onYouTubeIframeAPIReady() {
    player = new YT.Player('video', {
        events: {
            'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
        }
    });
}
       
function onPlayerStateChange(event) {
    var embedCode = event.target.getVideoEmbedCode();
    switch(event.data) {
        case -1:
            $("#playButtonIcon").addClass('fa-play');
            $("#playButtonIcon").removeClass('fa-pause');
            videoState = -1;
            break;
        case 0:
            $("#playButtonIcon").addClass('fa-play');
            $("#playButtonIcon").removeClass('fa-pause');
            videoState = 0;
            break; 
        case 1:
            $("#playButtonIcon").addClass('fa-pause');
            $("#playButtonIcon").removeClass('fa-play');
            videoState = 1;
            if (newUser) {
                sync();
                newUser = false;
            }
            break;
        case 2:
            $("#playButtonIcon").addClass('fa-play');
            $("#playButtonIcon").removeClass('fa-pause');
            videoState = 2;
            break;
        case 3:
            videoState = 3;
            break;
        case 5:
            $("#playButtonIcon").addClass('fa-play');
            $("#playButtonIcon").removeClass('fa-pause');
            videoState = 5;
            break;
    }
}

function onPlayerReady(event) {
    $('#controlBar').fadeIn(1000);
    if(localStorage.getItem("sound")) {
        player.setVolume(localStorage.getItem("sound"));
    } else {
        player.setVolume(75);
    }

    var playButton = document.getElementById("PlayButton");
    playButton.addEventListener("click", function() {
        playPause();
    });

    var muteButton = document.getElementById("MuteButton");
    muteButton.addEventListener("click", function() {
        mute();
    });
}

//Quality Button
$('#quality').on('click', function() {
    document.getElementById("dropUp").innerHTML = "";
    var options = player.getAvailableQualityLevels();
    for(i = 0; i < options.length; i++) {

        if(options[i] == player.getPlaybackQuality()) {
            optionString = "<li id='" + options[i] + "'><a>" + options[i] + " (current)</a></li>"
            $("#dropUp").append(optionString);
        }
        else if(options[i] == 'auto') {}
        else {
            optionString = "<li id='" + options[i] + "'><a>" + options[i] + " </a></li>"
            $("#dropUp").append(optionString);
        }
    }

    $('#hd1080').on('click', function() {
        player.stopVideo();
        player.setPlaybackQuality('hd1080');
        player.playVideo();
        sync();
    });

    $('#hd720').on('click', function() {
        player.stopVideo();
        player.setPlaybackQuality('hd720');
        player.playVideo();
        sync();
    });

    $('#large').on('click', function() {
        player.stopVideo();
        player.setPlaybackQuality('large');
        player.playVideo();
        sync();
    });

    $('#medium').on('click', function() {
        player.stopVideo();
        player.setPlaybackQuality('medium');
        player.playVideo();
        sync();
    });

    $('#small').on('click', function() {
        player.stopVideo();
        player.setPlaybackQuality('small');
        player.playVideo();
        sync();
    });

    $('#tiny').on('click', function() {
        player.stopVideo();
        player.setPlaybackQuality('tiny');
        player.playVideo();
        sync();
    });

});

$('#syncRoom').on('click', function() {
    sync();
});

$('#slowDownButton').on('click', function() {
    slowDown();
    socket.emit('playSlower');
});

$('#normalizeButton').on('click', function() {
    normalize();
    socket.emit('normalPlayback');
});

$('#speedUpButton').on('click', function() {
    speedUp();
    socket.emit('playFaster');
});

function syncLink() {
    var url = player.getVideoUrl();
    socket.emit('syncUrl', url);
}

function sync() {
    syncLink();
    var time =  player.getCurrentTime();
    player.seekTo(time, true);
    socket.emit('syncVid', time, videoState);
}

function syncSkip(time) {
    player.seekTo(time, true);
    socket.emit('syncVid', time, videoState);
}

function loadVideo(url) {
    player.cueVideoByUrl(url, 0,"large"); 
}

function playPause() {
    var time = player.getCurrentTime();
    if(player.getPlayerState() == -1 || player.getPlayerState() == 5 || player.getPlayerState() == 2 || player.getPlayerState() == 3) {
        player.playVideo();
        player.seekTo(time, true);
        socket.emit('playVid',time);
        //$("#playButtonIcon").removeClass('fa-play');
        //$("#playButtonIcon").addClass('fa-pause');
    }
    if(player.getPlayerState() == 1) {
        player.pauseVideo();
        socket.emit('pauseVid',time);
       // $("#playButtonIcon").removeClass('fa-pause');
        //$("#playButtonIcon").addClass('fa-play');
    }
    
    if(player.getPlayerState() == 0) {
        player.seekTo(0, true);
        syncSkip(0);
    }
}

function mute() {
  if(player.isMuted()) {
    player.unMute();
    $("#muteButtonIcon").removeClass('fa-volume-off');
    $("#muteButtonIcon").addClass('fa-volume-up');
  }
  else {
    player.mute();
    $("#muteButtonIcon").removeClass('fa-volume-up');
    $("#muteButtonIcon").addClass('fa-volume-off');
  }
}

function goBack() {
    var time = player.getCurrentTime() - 5;
    player.seekTo(time, true);
    syncSkip(time);
}

function goForward() {
    var time = player.getCurrentTime() + 5;
    player.seekTo(time, true);
    syncSkip(time);
}

function speedUp() {
    var speed = player.getPlaybackRate() * 1.5;
    player.setPlaybackRate(speed);

}

function slowDown() {
    var speed = player.getPlaybackRate() / 2;
    player.setPlaybackRate(speed);
}

function normalize() {
    player.setPlaybackRate(1.0);
}

function turnUp() {
    var volume = player.getVolume() + 5;
    volumeSlider.setValue(volume);
}

function turnDown() {
    var volume = player.getVolume() - 5;
    volumeSlider.setValue(volume);
}


socket.on('syncReceived', function(time, state) {
    player.seekTo(time, true);
    if (state != 1 && state != 3) {
        player.pauseVideo();
    } else if(state == 1 || state == 5) {
        player.playVideo();
    }
    notifySync();
});

socket.on('pauseReceived', function(time) {
    //$("#playButtonIcon").addClass('fa-play');
    //$("#playButtonIcon").removeClass('fa-pause');
    if(player.getPlayerState != 2) {
        player.seekTo(time, true);
        player.pauseVideo();
        notifyPause();
    }
});

socket.on('playReceived', function(time) {
    //$("#playButtonIcon").removeClass('fa-play');
    //$("#playButtonIcon").addClass('fa-pause');
    if(player.getPlayerState != 1) {
        player.seekTo(time, true);
        player.playVideo();
        notifyPlay();
    }
});

socket.on('playFasterReceived', function() {
    speedUp();
    notifySpeedUp();
});

socket.on('playSlowerReceived', function() {
    slowDown();
    notifySlowDown();
});

socket.on('normalPlaybackReceived', function() {
    normalize();
    notifyNormalize();
});
//End Socket IO Receivers

//Slider
var slider = new Slider('#controlSlider', {
    //value: currentTime(),
    tooltip: 'hide',
    formatter: function(value) {
    
        if(currentTime() && returnDuration) {
            return value;
        }
    }
});

slider.on('change',function(value) {
    if(Math.abs(value.oldValue - value.newValue) > 12) {
        youtubeSliderTime(value.newValue, true);
    }
});

function youtubeSliderTime(value, refresh) {
    if(player) {
        player.seekTo(player.getDuration()*(value/10000), refresh);
        syncSkip(player.getDuration()*(value/10000));
    }  
}

function returnDuration() {
    if(player) {
        return player.getDuration();
    }
}

function currentTime() {
    if(player) {
        return (player.getCurrentTime());
    }
    else {
        return 0;
    }
} 

function myTimer() {
    if(player) {
        if(player.getCurrentTime) {
            slider.setValue(Math.round(currentTime()/returnDuration()*10000));
            var time = Math.round(currentTime());
            totalVideoTime = secondsToHMS(returnDuration()); 
            document.getElementById("time").innerHTML = secondsToHMS(time) + " / " + totalVideoTime;
        }
    }
}
var defaultVolume = 75;
if(localStorage.getItem("sound")) {
    defaultVolume = parseInt(localStorage.getItem("sound"));
}
var volumeSlider = new Slider('#volumeSlider', {
    value: defaultVolume,
    formatter: function(value) {
        if(player) {
            player.setVolume(value);
        }
        localStorage.setItem("sound", value);
        return value;
    }
});

function secondsToHMS(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
    return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s); 
}