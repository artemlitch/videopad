$(document).ready(function() {
    
    var canvas = document.getElementById('whiteBoard');
	var context = canvas.getContext('2d');
    var socket = io();
	 
	$('.colourpicker').on('changeColor', function(ev) {
        context.strokeStyle = ev.color.toHex();
    });
	$('#createRoomBtn').on('click', function(ev) {
        socket.emit('createRoom');   
    });
	$('#joinRoomBtn').on('click', function(ev) {
        var roomId = prompt("Enter room ID");
        if(roomId != null ) {
            socket.emit('joinRoom', roomId);
        }
    });
    $('#roomNameLabel').on('click', function(ev) {
        window.prompt ("Copy to clipboard: Ctrl+C, Enter",$(this).text()); 
    });


        
})
