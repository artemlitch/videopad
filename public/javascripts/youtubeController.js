var tag = document.createElement('script');;
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var socket = io();
var player;

function onYouTubePlayerAPIReady() {
  player = new YT.Player('video', {
    events: {
      'onReady': onPlayerReady
    }
  });
}

//Start Click Events
function onPlayerReady(event) {
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
    var urlID = prompt("Enter YouTube URL TestChange");
    if(urlID.length > 5){
    urlID = urlID.split(/v\/|v=|youtu\.be\//)[1].split(/[?&]/)[0];
    urlID = "https://www.youtube.com/embed/" + urlID + "?rel=0&amp;controls=0&amp;showinfo=0;enablejsapi=1&html5=1;hd=1&iv_load_policy=3";
    loadVideo(urlID);
    socket.emit('loadVid', urlID);
    }
  });
}
//End Click events 

//YouTube Player Functions
function syncLink(){
  var url = player.getVideoUrl();
  socket.emit('syncUrl', url);
}
function sync(){
  syncLink();
  var sync =  player.getCurrentTime();
  player.seekTo(sync, true);
  socket.emit('syncVid', sync);
  player.playVideo();
}
function syncSkip(time){
  player.seekTo(time, true);
  socket.emit('syncVid', time);
}
function loadVideo(url) {
    player.cueVideoByUrl(url, 0,"large"); 
  }

function playPause(){
  if(player.getPlayerState() == -1 || player.getPlayerState() == 5 || player.getPlayerState() == 2 ){
    player.playVideo();
    socket.emit('playVid');
  }
  if(player.getPlayerState() == 1){
    player.pauseVideo();
    socket.emit('pauseVid');
  }
  if(player.getPlayerState() == 0){
    player.seekTo(0, true);
  }

}

function mute(){
  if(player.isMuted()){
    player.unMute();
  }
  else{
    player.mute();
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
  player.setVolume(volume);
}

function turnDown(){
  var volume = player.getVolume() - 5;
  player.setVolume(volume);
}
//End YouTubePlayer Functions

//Socket IO Receivers 
socket.on('vidReceived', function(url) {
  loadVideo(url);
});

socket.on('urlReceived', function(url) {

  if(url != player.getVideoUrl()){ 
    url = url.split(/v\/|v=|youtu\.be\//)[1].split(/[?&]/)[0];
    url = "https://www.youtube.com/embed/" + url + "?rel=0&amp;controls=0&amp;showinfo=0;enablejsapi=1&html5=1;hd=1&iv_load_policy=3";
    loadVideo(url);
  }
  
});

socket.on('syncReceived', function(sync) {
  player.seekTo(sync, true);
});

socket.on('pauseReceived', function(){
  if(player.getPlayerState != 2){
    player.pauseVideo();
  }
});

socket.on('playReceived', function(){
  if(player.getPlayerState != 1){
    player.playVideo();
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