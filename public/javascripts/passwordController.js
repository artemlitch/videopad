var wrongPass = 0;
var noName = 0;
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
    if(noName == 0) {
        $( "#alert" ).append( "<p>Please Enter Name</p>" );
        noName = 1;
    } 
}


function alertPassword() {
    if(wrongPass == 0) {
        $( "#alert" ).append( "<p>Incorrect Password!</p>" );
        wrongPass = 1;
    }    
} 
   
function joinRoom() {
    var username = $('#usernameField').val();
    var password = $('#passwordField').val();
    if(username.length == 0){
       alertName();
    } else if(password.length == 0){
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
                if(data.password) {
                    window.location = data.redirect; 
                } else {
                    alertPassword();
                }
            }
        });
    }
}

$('#joinRoomBtn').on('click', function(ev) {
    joinRoom();
});

function handleKeyPress(e) {
    var key = e.keyCode || e.which;
    if (key == 13){
        joinRoom(); 
    }
}