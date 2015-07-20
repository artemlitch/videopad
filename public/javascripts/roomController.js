$(document).ready(function() {
    
    var canvas = document.getElementById('whiteboard');
	var context = canvas.getContext('2d');
    var socket = io();
	var roomId = Number(window.location.pathname.match(/\/room\/(\d+)$/)[1]);
    
    //As soon as socket connection happens try to load to room
    socket.on('connect', function() {
		socket.emit('joinRoom', roomId);
    });

    socket.on('getRoomInfo', function(userId) {
        data = {
            userId: userId,
            img: canvas.toDataURL(),
            videoURL: player.getVideoUrl()
        }
        socket.emit('sentRoomInfo',data)
        sync();
    });
    
    socket.on('enterRoomInfo', function(data) {
        loadCanvasImage(data.img);
    });
        
})
