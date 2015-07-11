var drawMode = false;
var eraserMode = false;
var eraserPressed = false;
var canvas, ctx, sidebar;
var prevX, prevY;

var colour = 'black';
var colourPreview = document.getElementById('colour-preview');
var thickness = 5;

var dividers = document.getElementsByClassName('divider');

var tempCanvas, tempCtx;

var socket = io();

function init() {
	// initiate colour picker
	$('.colourpicker').colorpicker();
	colourPreview.style.backgroundColor = 'black';

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
    resizeCanvas();
	window.addEventListener('resize', resizeCanvas, false);
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
    canvas.height = videoWindow.height() - 40;
    canvas.width = vidWidth;
    var canvasHolder = $("#whiteboard-holder");
    canvasHolder.css("left", xPosition);
    var img = new Image();
    img.onload = function () {
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
    }
    img.src = data;
}

socket.on('drawReceived', function(colour, thickness, prevX, prevY, x, y, height, width) {
	drawReceived(colour, thickness, prevX, prevY, x, y, height, width);
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
        //console.log(height + ' ' + width)
        socket.emit('draw', ctx.strokeStyle, ctx.lineWidth, prevX, prevY, x, y, height, width);
	}
	prevX = x;
	prevY = y;
}

function erase(x, y, pressed) {
	if (pressed) {
		ctx.clearRect(x, y, -5, -5);
		ctx.clearRect(x, y, 5, -5);
		ctx.clearRect(x, y, -5, 5);
		ctx.clearRect(x, y, 5, 5);

		socket.emit('erase', x, y);
	}
}

function drawReceived(colour, thickness, prevX, prevY, x, y, height, width) {
    var widthRatio = canvas.width / width;
    var heightRatio = canvas.height / height;
    ctx.beginPath();
	ctx.strokeStyle = colour;
	ctx.lineWidth = thickness;
	ctx.lineJoin = 'round';
	ctx.moveTo(prevX*widthRatio, prevY*heightRatio);
	ctx.lineTo(x*widthRatio, y*heightRatio);
	ctx.closePath();
	ctx.stroke();
}

function eraseReceived(x, y) {
	ctx.clearRect(x, y, -5, -5);
	ctx.clearRect(x, y, 5, -5);
	ctx.clearRect(x, y, -5, 5);
	ctx.clearRect(x, y, 5, 5);
}

function clearReceived() {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}
var thicknessAmt = 6;
$(window).keypress(function(e) {
  if (e.which == 91 && thickness > 7) { 
      thickness = thickness - thicknessAmt;
  }
  if (e.which == 93 && thickness < 50) { 
      thickness = thickness + thicknessAmt;
  }
});

$('#thin').on('click', function() {
    thickness = 1;
    eraserPressed = false;
});

$('#medium').on('click', function() {
    thickness = 5;
    eraserPressed = false;
});

$('#thick').on('click', function() {
    thickness = 10;
    eraserPressed = false;
});

$('.colourpicker').on('changeColor', function(ev) {
    colour = ev.color.toHex();
    colourPreview.style.backgroundColor = colour;
    eraserPressed = false;
});

$('.colorpicker').mouseup(function() {
	$('.colourpicker').colorpicker('hide');
});

$('#eraser').on('click', function() {
	if (eraserPressed) {
		eraserPressed = false;
	}
	else {
		eraserPressed = true;
	}
});

$('#clear').on('click', function() {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	socket.emit('clear');
});
