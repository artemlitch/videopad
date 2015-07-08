var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;

function onYouTubePlayerAPIReady() {
  // create the global player from the specific iframe (#video)
  player = new YT.Player('video', {
    events: {
      // call this function when player is ready to use
      'onReady': onPlayerReady
    }
  });
}

function onPlayerReady(event) {
  
  // bind events
  var playButton = document.getElementById("PlayButton");
  playButton.addEventListener("click", function() {
  	if(player.getPlayerState() == -1 || player.getPlayerState() == 5 || player.getPlayerState() == 2){
  		player.playVideo();
  	}
  	if(player.getPlayerState() == 1){
  		player.pauseVideo();
  	}
    
  });
  
  var muteButton = document.getElementById("MuteButton");
  muteButton.addEventListener("click", function() {
    if(player.isMuted()){
    	player.unMute();
    }
    else{
    	player.mute();
    }
  });
}