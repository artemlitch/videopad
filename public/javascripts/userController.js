$(document).ready(function() {
    var canvas = document.getElementById('whiteboard');
    var context = canvas.getContext('2d');
    var socket = io();
    socket.on('userInfo' , function(user) {
        console.log("welcome "+ user.id);
    });
    socket.on('roomCreateConf' , function(user) {
       $('#roomNameLabel').text(user.room);
    });
    socket.on('roomJoinConf' , function(user) {
       $('#roomNameLabel').text(user.room);
       var image = new Image();
      // image.src = user.roomCanvas;
      // context.drawImage(image,0,0);
    });
	 
        
})
