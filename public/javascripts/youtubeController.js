var tag = document.createElement('script');;
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var socket = io();
var player;
var videoState;
var newUser = true;
var moveSlider=setInterval(function () {myTimer()}, 300);;

function onYouTubePlayerAPIReady() {

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
        videoState = -1;
        break;
     case 1:
        videoState = 1;
        if (newUser) {
            sync();
            newUser = false;
        }
        break;
     case 2:
        videoState = 2;
        break;
     case 3:
        videoState = 3;
        break;
  }
}

//Start Click Events
function onPlayerReady(event) {
  socket.emit('getRoomInfo');
  var playButton = document.getElementById("PlayButton");
  playButton.addEventListener("click", function() {
    playPause();
  });

  var muteButton = document.getElementById("MuteButton");
  muteButton.addEventListener("click", function() {
    mute();
  });

  var LoadVideo = document.getElementById("loadVideo");
  LoadVideo.addEventListener("click", function() {
    var urlID = $('#videoURL').val();
    $('#videoURL').val("")
    if(urlID){
    if(urlID.length > 5 && urlID){
    urlID = parseURL(urlID);
    loadVideo(urlID);
    socket.emit('loadVid', urlID);
    }
  }
  });

}
//End Click events 
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

//YouTube Player Functions
function syncLink(){
  var url = player.getVideoUrl();
  socket.emit('syncUrl', url);
}

function sync(){
  syncLink();
  var time =  player.getCurrentTime();
  player.seekTo(time, true);
  socket.emit('syncVid', time, videoState);
}

function syncSkip(time){
  player.seekTo(time, true);
  socket.emit('syncVid', time, videoState);
}

function loadVideo(url) {
    player.cueVideoByUrl(url, 0,"large"); 
}

function playPause(){
  var time = player.getCurrentTime();
  if(player.getPlayerState() == -1 || player.getPlayerState() == 5 || player.getPlayerState() == 2 || player.getPlayerState() == 3){
    player.playVideo();
    socket.emit('playVid',time);
    $("#playButtonIcon").removeClass('fa-play');
    $("#playButtonIcon").addClass('fa-pause');
  }
  if(player.getPlayerState() == 1){
    player.pauseVideo();
    socket.emit('pauseVid',time);
    $("#playButtonIcon").removeClass('fa-pause');
    $("#playButtonIcon").addClass('fa-play');
  }
  player.seekTo(time, true);
  if(player.getPlayerState() == 0){
    player.seekTo(0, true);
    syncSkip(0);
  }
}

function mute(){
  if(player.isMuted()){
    player.unMute();
    $("#muteButtonIcon").removeClass('fa-volume-off');
    $("#muteButtonIcon").addClass('fa-volume-up');
  }
  else{
    player.mute();
    $("#muteButtonIcon").removeClass('fa-volume-up');
    $("#muteButtonIcon").addClass('fa-volume-off');
  }
}

function goBack(){
  var time = player.getCurrentTime() - 5;
  player.seekTo(time, true);
  syncSkip(time);
}

function goForward(){
  var time = player.getCurrentTime() + 5;
  player.seekTo(time, true);
  syncSkip(time);
}

function speedUp(){
  var speed = player.getPlaybackRate() * 1.5;
  player.setPlaybackRate(speed);

}

function slowDown(){
  var speed = player.getPlaybackRate() / 2;
  player.setPlaybackRate(speed);
}

function normalize(){
  player.setPlaybackRate(1.0);
}

function turnUp(){
  var volume = player.getVolume() + 5;
  volumeSlider.setValue(volume);
}

function turnDown(){
  var volume = player.getVolume() - 5;
  volumeSlider.setValue(volume);
}
//End YouTubePlayer Functions
function parseURL(url) {
  var parsedURL = url.split(/v\/|v=|youtu\.be\//)[1].split(/[?&]/)[0]; 
  parsedURL = "https://www.youtube.com/embed/" + parsedURL + "?rel=0&amp;controls=1&amp;showinfo=0;enablejsapi=1&html5=1;hd=1&iv_load_policy=3";
  return parsedURL;
}
//Socket IO Receivers 
socket.on('vidReceived', function(url) {
  loadVideo(url);
});

socket.on('urlReceived', function(url) {
  var parsedURL = url.split(/v\/|v=|youtu\.be\//)[1].split(/[?&]/)[0]; 
  var parsedMyUrl = (player.getVideoUrl()).split(/v\/|v=|youtu\.be\//)[1].split(/[?&]/)[0];
  if(parsedURL != parsedMyUrl){ 
    loadVideo(parseURL(url));
  }
  
});

socket.on('syncReceived', function(time, state) {
  player.seekTo(time, true);
    if (state != 1 && state != 3) {
      player.pauseVideo();
    }else if(state == 1 || state == 5){
      player.playVideo();
    }
});

socket.on('pauseReceived', function(time){
  $("#playButtonIcon").addClass('fa-play');
  $("#playButtonIcon").removeClass('fa-pause');
  if(player.getPlayerState != 2){
    player.seekTo(time, true);
    player.pauseVideo();
    notifyPause();
  }
});



socket.on('playReceived', function(time){
  $("#playButtonIcon").removeClass('fa-play');
  $("#playButtonIcon").addClass('fa-pause');
  if(player.getPlayerState != 1){
    player.seekTo(time, true);
    player.playVideo();
    notifyPlay();
  }
});

socket.on('playFasterReceived', function(){
  speedUp();
});

socket.on('playSlowerReceived', function(){
  slowDown();
});

socket.on('normalPlaybackReceived', function(){
  normalize();
});
//End Socket IO Receivers

//Slider
var slider = new Slider('#ex1', {
  //value: currentTime(),
  tooltip: 'hide',
  formatter: function(value) {
    
   if(currentTime() && returnDuration) //i dont remember what this does exactly but it breaks shit if not here
      //console.log(Math.round(currentTime()/returnDuration()*100));
    return value;
  }
});

slider.on('change',function(value){
  if(Math.abs(value.oldValue - value.newValue) > 12){
    youtubeSliderTime(value.newValue, true);
  }
});


function youtubeSliderTime(value, refresh){
  if(player){
    player.seekTo(player.getDuration()*(value/10000), refresh);
    syncSkip(player.getDuration()*(value/10000));
  }
  
}

function returnDuration(){
  if(player){
    return player.getDuration();
  }
}

function currentTime(){
  if(player){
    return (player.getCurrentTime());
  }
  else{
    return 0;
  }
} 

  

function myTimer() {
  if(player){
    if(player.getCurrentTime){
      slider.setValue(Math.round(currentTime()/returnDuration()*10000));
    }
  }
}

var volumeSlider = new Slider('#volumeSlider', {
  formatter: function(value) {
    if(player)
      player.setVolume(value);
    return value;
  }
});

