$(document).ready(function() {

    var socket = io();
    function init(){

    }
    
    function alertName() {
        $('#usernameField').fadeOut(100).fadeIn(100);
    }    
    function alertPassword() {
        $('#passwordField').fadeOut(100).fadeIn(100);
    }    

    $('#createRoomBtn').on('click', function(ev) {
        var username = $('#usernameField').val();
        var password = $('#passwordField').val();
        if(username.length == 0){
           alertName();
        } else if(password.length == 0){
           alertPassword();
        } else {
            var data = {};
            data.user = username;
            data.ps = password;
            $.ajax({
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                url: '/createRoom',						
                success: function(data) {
                    var roomId = data.roomId;
                    window.location.href = window.location.href + 'room/'+roomId
                }
            });
        }
    });
    
    
    $('#joinRoomBtn').on('click', function(ev) {
        var roomId = prompt("Enter room ID");
        if(roomId != null ) {
            socket.emit('joinRoom', roomId);
        }
    });

    

});
