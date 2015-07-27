var drawMode = false;
var eraserMode = false;
var eraserPressed = false;
var canvas, ctx, sidebar;
var prevX, prevY;

var colourPresets = ['red', 'blue', 'yellow','green'];
var colour = colourPresets[0];

var colourPreview = document.getElementById('colour-preview');
var colourPreview2 = document.getElementById('colour-preview2');
var colourPreview3 = document.getElementById('colour-preview3');
var colourPreview4 = document.getElementById('colour-preview4');
var thickness = 5;

var dividers = document.getElementsByClassName('divider');

var tempCanvas, tempCtx;

var socket = io();

function init() {
	// initiate colour picker
	$('.colourpicker').colorpicker();
  $('.colourpicker2').colorpicker();
  $('.colourpicker3').colorpicker();
  $('.colourpicker4').colorpicker();
	colourPreview.style.backgroundColor = colourPresets[0];
  colourPreview2.style.backgroundColor = colourPresets[1];
  colourPreview3.style.backgroundColor = colourPresets[2];
  colourPreview4.style.backgroundColor = colourPresets[3];
	canvas = document.getElementById('whiteboard');
	ctx = canvas.getContext('2d');

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	//dividers[0].style.left = (3 * (window.innerWidth / 12)) + 'px';

	$('#whiteboard').mousedown(function(e) {
		if (eraserPressed) {
			eraserMode = true;
			erase(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
		} else {
			drawMode = true;
			draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, false);
		}
	});

	$('#whiteboard').mousemove(function(e) {
		if (drawMode) {
			draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
		} else if (eraserMode) {
			erase(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
		}
	});

	$('#whiteboard').mouseup(function(e) {
		drawMode = false;
		eraserMode = false;
	});

	$('#whiteboard').mouseleave(function(e) {
		drawMode = false;
		eraserMode = false;
	});
    resizeScreen();
	window.addEventListener('resize', resizeScreen, false);
}

function loadCanvasImage(imgSource) {
    var img = new Image();
    img.onload = function () {
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
    }
    img.src = imgSource;
}

function resizeScreen() {
    resizeVideo();
    resizeCanvas();
}

function resizeCanvas() {
    //var width = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowWidth = window.innerWidth;
    var data = canvas.toDataURL();
    //move the canvas into the correct position
    var youtubeContainer = $('#video-container');
    var vidWidth = youtubeContainer.width();
    var xPosition = (windowWidth - vidWidth)/2 
    var videoWindow = $("#video")
    // scale and redraw the canvas content
    canvas.height = videoWindow.height();
    canvas.width = vidWidth;
    var canvasHolder = $("#whiteboard-holder");
    canvasHolder.css("left", xPosition);
    loadCanvasImage(data);
}
function resizeVideo() {
    var videoHolder = $('#video-holder');
    var topBarHeight = $('#navbar').height()+20;
    var bottomBarHeight = $('#controlBar').height()+20; 
    if(videoHolder.width() >= 250) {
        var hDiff = (innerHeight - topBarHeight - bottomBarHeight) - videoHolder.height();
        var wDiff = innerWidth - (videoHolder.width() -50)
        if (wDiff < 0) {
            videoHolder.width(innerWidth - 50);
            return;
        }
        var ratio = videoHolder.width()/videoHolder.height();
        var diff = hDiff * ratio;
        if((videoHolder.width() + diff) < innerWidth) {
            videoHolder.width(videoHolder.width() + diff);
        }
    } else {
        videoHolder.width(251);
    }
}

socket.on('drawReceived', function(data) {
	drawReceived(data);
});

socket.on('eraseReceived', function(x, y) {
	eraseReceived(x, y);
});

socket.on('clearReceived', function() {
	clearReceived();
});

function draw(x, y, pressed) {
	if (pressed) {
		ctx.beginPath();
		ctx.strokeStyle = colour;
		ctx.lineWidth = thickness;
		ctx.lineJoin = 'round';
		ctx.moveTo(prevX, prevY);
		ctx.lineTo(x, y);
		ctx.closePath();
		ctx.stroke();
		var height = canvas.height;
        var width = canvas.width;
        var data = {
            colour: ctx.strokeStyle,
            thickness: ctx.lineWidth,
            prevX: prevX,
            prevY: prevY,
            x: x,
            y: y,
            height: height,
            width: width
        }
        socket.emit('draw', data);
	}
	prevX = x;
	prevY = y;
}

function erase(x, y, pressed) {
	if (pressed) {
		var eraseThickness = Math.round(thickness/2);
		ctx.clearRect(x, y, -eraseThickness, -eraseThickness);
		ctx.clearRect(x, y, eraseThickness, -eraseThickness);
		ctx.clearRect(x, y, -eraseThickness, eraseThickness);
		ctx.clearRect(x, y, eraseThickness, eraseThickness);
        var data = {
        	thickness: eraseThickness,
            x: x,
            y: y
        }
		socket.emit('erase', data);
	}
}

function drawReceived(data) {
    var widthRatio = canvas.width / data.width;
    var heightRatio = canvas.height / data.height;
    ctx.beginPath();
	ctx.strokeStyle = data.colour;
	ctx.lineWidth = data.thickness;
	ctx.lineJoin = 'round';
	ctx.moveTo(data.prevX*widthRatio, data.prevY*heightRatio);
	ctx.lineTo(data.x*widthRatio, data.y*heightRatio);
	ctx.closePath();
	ctx.stroke();
}

function eraseReceived(data) {
	ctx.clearRect(data.x, data.y, -data.thickness, -data.thickness);
	ctx.clearRect(data.x, data.y, data.thickness, -data.thickness);
	ctx.clearRect(data.x, data.y, -data.thickness, data.thickness);
	ctx.clearRect(data.x, data.y, data.thickness, data.thickness);
}

function clearReceived() {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

var thicknessAmt = 6;


$('#drawButton').on('click', function() {
    eraserPressed = false;
    setCursor();
});


$('#fullscreenButton').on('click', function() {
    console.log(fullScreenApi.supportsFullScreen);
    if(fullScreenApi.supportsFullScreen) {
        if(fullScreenApi.isFullScreen()){
            fullScreenApi.cancelFullScreen(document.body);
        } else {
            fullScreenApi.requestFullScreen(document.body);
        }
    }
});

$('.colourpicker').on('changeColor', function(ev) {
    colour = ev.color.toHex();
    colourPreview.style.backgroundColor = colour;
    colourPresets[0] = colour;
    eraserPressed = false;
});

$('.colourpicker').on('click', function() {
  colour = colourPresets[0];
  eraserPressed = false;
  $('#colour-preview').addClass('selectedColour');
  $('#colour-preview2').removeClass('selectedColour');
  $('#colour-preview3').removeClass('selectedColour');
  $('#colour-preview4').removeClass('selectedColour');
});

$('.colourpicker2').on('changeColor', function(ev) {
    colour = ev.color.toHex();
    colourPreview2.style.backgroundColor = colour;
    colourPresets[1] = colour;
    eraserPressed = false;
});

$('.colourpicker2').on('click', function() {
  colour = colourPresets[1];
  eraserPressed = false;
  $('#colour-preview').removeClass('selectedColour');
  $('#colour-preview2').addClass('selectedColour');
  $('#colour-preview3').removeClass('selectedColour');
  $('#colour-preview4').removeClass('selectedColour');
});

$('.colourpicker3').on('changeColor', function(ev) {
    colour = ev.color.toHex();
    colourPreview3.style.backgroundColor = colour;
    colourPresets[2] = colour;
    eraserPressed = false;
});

$('.colourpicker3').on('click', function() {
  colour = colourPresets[2];
  eraserPressed = false;
  $('#colour-preview').removeClass('selectedColour');
  $('#colour-preview2').removeClass('selectedColour');
  $('#colour-preview3').addClass('selectedColour');
  $('#colour-preview4').removeClass('selectedColour');
});

$('.colourpicker4').on('changeColor', function(ev) {
    colour = ev.color.toHex();
    colourPreview4.style.backgroundColor = colour;
    colourPresets[3] = colour;
    eraserPressed = false;
});

$('.colourpicker4').on('click', function() {
  colour = colourPresets[3];
  eraserPressed = false;
  $('#colour-preview').removeClass('selectedColour');
  $('#colour-preview2').removeClass('selectedColour');
  $('#colour-preview3').removeClass('selectedColour');
  $('#colour-preview4').addClass('selectedColour');
});

$('#eraser').on('click', function() {
		eraserPressed = true;	
		setCursor();
});

$('#clear').on('click', function() {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	socket.emit('clear');
});


var brushSlider = new Slider('#ex2', {
  formatter: function(value) {
  	thickness = value;
  	setCursor();
    return value;
  }
});

function setCursor(){
	var roundedThickness = Math.round(thickness/5)*5;
	var url;
	if(roundedThickness==0)
		roundedThickness = 5;
	var spacing = Math.round(roundedThickness/2);

	if(!eraserPressed){
		url = "url('../Cursors/circleCursor-" + roundedThickness + "px.ico') " + spacing + " " + spacing + ", default"; 
		$('#whiteboard').css('cursor', url);
    //console.log(url);
	}
	else{
		url = "url('../Cursors/squareCursor-" + roundedThickness + "px.ico') " + spacing + " " + spacing + ", default"; 
		$('#whiteboard').css('cursor', url);
    //console.log(url);			
	}
}
