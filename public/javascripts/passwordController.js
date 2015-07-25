$(document).ready(function() {
    var socket = io();

    function getUrlVars()
    {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++)
        {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }
    var roomId = getUrlVars()["next"];
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
                        window.location = data.redirect; 
                    } else {
                        console.log("failed Password");
                        alertPassword();
                    }
                }
            });
        }
    });
});   
