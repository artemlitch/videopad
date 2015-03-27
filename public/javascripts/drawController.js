var isPressed = false;
var ctx;
var prevX, prevY;

var colour;
var thickness = 5;

var socket = io();

function init() {
	ctx = document.getElementById('whiteboard').getContext('2d');

	$('#whiteboard').mousedown(function(e) {
		isPressed = true;
		draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, false);
	});

	$('#whiteboard').mousemove(function(e) {
		if (isPressed) {
			draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
		}
	});

	$('#whiteboard').mouseup(function(e) {
		isPressed = false;
	});

	$('#whiteboard').mouseleave(function(e) {
		isPressed = false;
	});
}

socket.on('drawReceived', function(style, oldX, oldY, currX, currY) {
	drawReceived(style, oldX, oldY, currX, currY);
});

function draw(x, y, mousePressed) {
	if (mousePressed) {
		ctx.beginPath();
		ctx.strokeStyle = colour;
		ctx.lineWidth = thickness;
		ctx.lineJoin = 'round';
		ctx.moveTo(prevX, prevY);
		ctx.lineTo(x, y);
		ctx.closePath();
		ctx.stroke();

		socket.emit('draw', prevX, prevY, x, y);
	}
	prevX = x;
	prevY = y;
}

function drawReceived(prevX, prevY, x, y) {
	ctx.beginPath();
	ctx.strokeStyle = colour;
	ctx.lineWidth = thickness;
	ctx.lineJoin = 'round';
	ctx.moveTo(prevX, prevY);
	ctx.lineTo(x, y);
	ctx.closePath();
	ctx.stroke();
}

$('#thin').on('click', function() {
    thickness = 1;
});

$('#medium').on('click', function() {
    thickness = 5;
});

$('#thick').on('click', function() {
    thickness = 10;
});

$('.colourpicker').on('changeColor', function(ev) {
    colour = ev.color.toHex();
});