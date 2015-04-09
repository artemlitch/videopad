var drawMode = false;
var eraserMode = false;
var eraserPressed = false;
var canvas, ctx;
var prevX, prevY;

var colour;
var thickness = 5;

var tempCanvas, tempCtx;

var socket = io();

function init() {
	canvas = document.getElementById('whiteboard');
	ctx = canvas.getContext('2d');

	canvas.width = window.innerWidth - (window.innerWidth / 12);
	canvas.height = window.innerHeight;

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

	window.addEventListener('resize', resizeCanvas, false);
}

function resizeCanvas() {
	tempCanvas = document.createElement('canvas');
	tempCtx = tempCanvas.getContext('2d');
	tempCanvas.width = canvas.width;
	tempCanvas.height = canvas.height;
	tempCtx.drawImage(canvas, 0, 0);
	canvas.width = window.innerWidth - (window.innerWidth / 12);
	canvas.height = window.innerHeight;
	ctx.drawImage(tempCanvas, 0, 0);
}

socket.on('drawReceived', function(colour, thickness, prevX, prevY, x, y) {
	drawReceived(colour, thickness, prevX, prevY, x, y);
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

		socket.emit('draw', ctx.strokeStyle, ctx.lineWidth, prevX, prevY, x, y);
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

function drawReceived(colour, thickness, prevX, prevY, x, y) {
	ctx.beginPath();
	ctx.strokeStyle = colour;
	ctx.lineWidth = thickness;
	ctx.lineJoin = 'round';
	ctx.moveTo(prevX, prevY);
	ctx.lineTo(x, y);
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
    eraserPressed = false;
});

$('#eraser').on('click', function() {
	eraserPressed = true;
});

$('#clear').on('click', function() {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	socket.emit('clear');
});