//Initiations*******************************************************************
var firstVidLoad = true;
var canvas = document.getElementById('whiteboard');
var context = canvas.getContext('2d');
var socket = io();
var roomVideoTime = 0;
var roomVideoState = 0;
var roomId = window.location.pathname.match(/\/room\/([-0-9a-zA-Z]+)/)[1];
var infoPage = 1;
var newUser = 0;
var usersInRoom = [];
var canvasImg = "";
//document.getElementById('draw_script').src='/javascripts/drawController.js';

if(localStorage.getItem('new') == 1) {
    $('#infoPage1').hide();
    $('#infoPage4').show();
    $('#navButtons').hide();
}
//End Initiations***************************************************************

//Socket Receivers**************************************************************
socket.on('connect', function() {
	socket.emit('joinRoom', roomId); 
});

socket.on('usersReceived', function(list) {
    var lineList = "";
    for(i = 0; i < list.length; i++) {
        if(lineList == "")
            lineList = list[i];
        else
            lineList = lineList + '<br />' + list[i];
    }
    sendNotify(lineList, "userStyle", 2000);
});

socket.on('userJoined', function(username) {
    sendNotify(username + " Connected", "userStyle", 1000);
    usersInRoom.push(username);
});

socket.on('userLeft', function(username) {
    sendNotify(username + " Disconnected", "userStyle", 1000);
});

socket.on('roomJoinConf', function() {
    socket.emit('getRoomInfo');
});

socket.on('sendRoomInfo', function(userId) {
    if(typeof player !== 'undefined') {
        data = {
            userId: userId,
            img: canvas.toDataURL(),
            time: currentTime(),
            videoURL: currentURL(),
            state: currentState()
        }
    } else {
        data = {
            userId: userId,
            img: canvas.toDataURL(),
            time: 0,
            videoURL: '',
            state: -1
        }
    }
    socket.emit('sentRoomInfo',data)
});

socket.on('enterRoomInfo', function(data) { //data should send video state
    roomVideoTime = Math.round(data.time);
    roomVideoState = data.state;
    canvasImg = data.img;
    if(canvas) {
        loadCanvasImage(canvasImg);
    }
    if(data.videoURL) {
        checkVideo(parseURL(data.videoURL));
        $(".exitInfo").click();
    }
});

socket.on('urlReceived', function(url) {
    var parsedURL = url.split(/v\/|v=|youtu\.be\//)[1].split(/[?&]/)[0]; 
    var parsedMyUrl = (player.getVideoUrl()).split(/v\/|v=|youtu\.be\//)[1].split(/[?&]/)[0];
    if(parsedURL != parsedMyUrl) { 
        checkVideo(parseURL(url));
    } 
});

socket.on('vidReceived', function(url) {
    checkVideo(url); 
});
//End Socket Receivers**********************************************************

//Class Functions***************************************************************
function init() {
    canvasInit();
    loadCanvasImage(canvasImg);
    $(".shareURL").val(window.location.href);
}

function checkVideo(url) {
    if(firstVidLoad) {
        localStorage.setItem('new', 1);
        firstVidLoad = false;
        loadIframe(url);
    } else {
        loadVideo(url); 
    }
}

function loadIframe(url) {
    var autoplay;
    if(roomVideoState == 1){
        autoplay = "&autoplay=1;"
    } else {
        autoplay = "";
    }
    var startTime = "&start=" + roomVideoTime + ";";
    $('#video-container').html("<iframe width='1920' height='930' src='" 
                                + url + startTime + autoplay 
                                + "' frameborder='0' id='video'></iframe>");
    document.getElementById('yt_script').src='/javascripts/youtubeController.js'; 
}

function parseURL(url) {
    var parsedURL = url.split(/v\/|v=|youtu\.be\//)[1].split(/[?&]/)[0]; 
    parsedURL = "https://www.youtube.com/embed/" + parsedURL 
                + "?rel=0&amp;controls=0&amp;showinfo=0;"
                + "enablejsapi=1&html5=1;hd=1&iv_load_policy=3;";
    return parsedURL;
}
//End Class Functions***********************************************************

//User Input********************************************************************

$('.shareURL').click(function() { $(this).select(); });

$('#next1').on('click', function() {
    $('#infoPage'+ infoPage).hide();
    if(infoPage < 3){
        infoPage++;
    }
    $('#infoPage' + infoPage).show();
    $(".shareURL").select();
});

$('#back1').on('click', function() {
    $('#infoPage'+ infoPage).hide();
    if(infoPage > 1){
        infoPage--;
    }       
    $('#infoPage' + infoPage).show();
    $(".shareURL").select();

});

$('#fullscreenButton').on('click', function() {
    if(fullScreenApi.supportsFullScreen) {
        if(fullScreenApi.isFullScreen()){
            fullScreenApi.cancelFullScreen(document.body);
        } else {
            fullScreenApi.requestFullScreen(document.body);
        }
    }
});

$('#leaveRoom').on('click', function() {
  window.location.href = '/';
});

$('#usersButton').on('click', function() {
    socket.emit('getUsers', roomId); 
});

$('#infoButton').on('click', function() {
    infoPage = 1;
    $(".shareURL").val(window.location.href);
    $('#navButtons').show();
    $('#infoPage1').show();
    $('#infoPage2').hide();
    $('#infoPage3').hide();
    $('#infoPage4').hide();
    $('#welcomeBox').fadeIn(1000);
});

$('.exitInfo').on('click', function() {
    $('#welcomeBox').fadeOut(1000);
});

//Rewrite This
$('.loadVideo').on('click', function() {

    if($('#videoURL').val().match(/youtu/)) {
        var url = $('#videoURL').val();
        if(url.length > 5 && url) {
            url = parseURL(url);
            checkVideo(url);
            socket.emit('loadVid', url);
        }
    }
    $('#videoURL').val(''); 

    if($('#videoURLTut').val().match(/youtu/)) {
        var url = $('#videoURLTut').val();
        if(url.length > 5 && url) {
            url = parseURL(url);
            checkVideo(url);
            socket.emit('loadVid', url);
        }
    }
    $('#videoURLTut').val('');

    if($('#videoURLSplash').val().match(/youtu/)) {
        var url = $('#videoURLSplash').val();
        if(url.length > 5 && url) {
            url = parseURL(url);
            checkVideo(url);
            socket.emit('loadVid', url);
        }
    }
    $('#videoURLSplash').val('');
});

function handleKeyPress(e) {
    var key = e.keyCode || e.which;
    if (key == 13 && $('#videoURL').val().match(/youtu/)){
        var url = $('#videoURL').val();
        if(url.length > 5 && url) {
            url = parseURL(url);
            checkVideo(url);
            socket.emit('loadVid', url);
        }
        $('#videoURL').val(''); 
    }
    if (key == 13 && $('#videoURLTut').val().match(/youtu/)){
        var url = $('#videoURLTut').val();
        if(url.length > 5 && url) {
            url = parseURL(url);
            checkVideo(url);
            socket.emit('loadVid', url);
        }
    }
    if (key == 13 && $('#videoURLSplash').val().match(/youtu/)){
        var url = $('#videoURLSplash').val();
        if(url.length > 5 && url) {
            url = parseURL(url);
            checkVideo(url);
            socket.emit('loadVid', url);
        }
    }
}
//End User Input****************************************************************

