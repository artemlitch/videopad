var noName = 0;
var noPass = 0;
var socket = io();
function init(){

}

function alertName() {
    if(noName == 0) {
        $( "#alert" ).append( "<p>Please Enter Name</p>" );
        noName = 1;
    } 
}  
function alertPassword() {
    if(noPass == 0) {
        $( "#alert" ).append( "<p>Please Choose a Password!</p>" );
        noPass = 1;
    }    
}   
function createRoom() {
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
                window.location.href = 'room/'+roomId
            }
        });
    }
}
$('#createRoomBtn').on('click', function(ev) {
    createRoom();
});

function handleKeyPress(e) {
    var key = e.keyCode || e.which;
    if (key == 13){
        createRoom(); 
    }
}