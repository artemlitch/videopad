$(document).ready(function() {
    var socket = io();
	var roomId = Number(window.location.pathname.match(/\/room\/(\d+)$/)[1]);


    function alertName() {
        $('#usernameField').fadeOut(100).fadeIn(100);
    }    
    
    function alertPassword() {
        $('#passwordField').fadeOut(100).fadeIn(100);
    }    

    $('#joinRoomBtn').on('click', function(ev) {
        var username = $('#usernameField').val();
        var password = $('#passwordField').val();
        if(password.length == 0){
           alertPassword();
        } else {
            var data = {};
            data.id = roomId;
            data.ps = password;
            data.user = username;
            $.ajax({
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                url: '/joinRoom',						
                success: function(data) {
                    console.log('success');
                    if(data.password) {
                        window.location.href = window.location.href; 
                    } else {
                        console.log("failed Password");
                        alertPassword();
                    }
                }
            });
        }
    });
});   
