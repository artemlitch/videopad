$(document).ready(function() {
    
    var canvas = document.getElementById('whiteboard');
	var context = canvas.getContext('2d');
    var socket = io();

	$('#createRoomBtn').on('click', function(ev) {
        socket.emit('createRoom');   
    });
	
    $('#joinRoomBtn').on('click', function(ev) {
        var roomId = prompt("Enter room ID");
        if(roomId != null ) {
            socket.emit('joinRoom', roomId);
        }
    });
    
    $('#roomNameLabel').on('click', function() {
        socket.emit('seeKey');
    });

    socket.on('showKey' , function(roomId) {
       window.prompt ("Copy to clipboard: Ctrl+C, Enter", roomId); 
    });

    socket.on('getRoomInfo', function(userId) {
        //console.log(canvas.toDataURL());
        //console.log(userId + " WANTS TO SEE SOME SHIT");
        //console.log(player)
        data = {
            userId: userId,
            img: canvas.toDataURL(),
            videoURL: player.getVideoUrl()
        }
        socket.emit('sentRoomInfo',data)
        sync();
    });
    
    socket.on('enterRoomInfo', function(data) {
        //console.log(data);
        loadCanvasImage(data.img);
    });
        
})
