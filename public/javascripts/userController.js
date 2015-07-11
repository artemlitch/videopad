$(document).ready(function() {
    var canvas = document.getElementById('whiteboard');
    var context = canvas.getContext('2d');
    var socket = io();
    socket.on('userInfo' , function(user) {
       console.log("welcome "+ user.id);
    });
    socket.on('roomCreateConf' , function(user) {
       $('#roomNameLabel').text("Click To Show Room Key");
    });
    socket.on('roomJoinConf' , function(user) {
       $('#roomNameLabel').text("Click To Show Room Key");

    });
	 
        
})
