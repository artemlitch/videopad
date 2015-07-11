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


        
})
