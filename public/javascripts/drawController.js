var drawMode = false;
var eraserMode = false;
var eraserPressed = false;
var canvas, ctx, sidebar;
var prevX, prevY;
var numOfColourPickers = 4;
var colourPreview = ['1','2','3','4'];
var colourPresets = ['red', 'blue', 'yellow','green'];
var thickness = 5;
var dividers = document.getElementsByClassName('divider');
var tempCanvas, tempCtx;
var socket = io();
var colour = colourPresets[0];
var x; //for loop things
var drawKeysEnabled = false;

$('#infoButton').on('click', function() {
    drawKeysEnabled = false;
});

$('.exitInfo').on('click', function() {
     drawKeysEnabled = true;
});

for(i = 0; i < numOfColourPickers; i++) {
    if(localStorage.getItem('colour' + i)) {
        colourPresets[i] = localStorage.getItem('colour' + i);
    }
}

x = 1;
for(i = 0; i < numOfColourPickers; i++){
    colourPreview[i] = $('#colour-preview' + x)[0];
    x++;
}
colour = colourPresets[0];

function init() {
	// initiate colour pickers
    x = 1;
    for(i = 0; i < numOfColourPickers; i++) {
        colourPreview[i].style.backgroundColor = colourPresets[i];
        $('.colourpicker' + x).colorpicker();
        x++;   
    }

	canvas = document.getElementById('whiteboard');
	ctx = canvas.getContext('2d');

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	$('#whiteboard').mousedown(function(e) {
		if (eraserPressed) {
			eraserMode = true;
			erase(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
		} else {
			drawMode = true;
			draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, false);
		}
        $('#whiteboard').mousemove(function(e) {
            if (drawMode) {
                draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
            } else if (eraserMode) {
                erase(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
            }
        });
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


$('.picker').on('click', function() {
    x = 1;
    eraserPressed = false;
    for(i = 0; i < numOfColourPickers; i++){ 
        compare = 'colourpicker' + x;
        if($(this).hasClass(compare)) {
            $('#colour-preview' + x).addClass('selectedColour'); 
            colour = colourPresets[i];
        } else {
            $('#colour-preview' + x).removeClass('selectedColour');
        }
        x++;
    }
});

$('.picker').on('changeColor', function(ev) {
    colour = ev.color.toHex();
    var i = parseInt($(this).attr('class')[12]) - 1;
    colourPreview[i].style.backgroundColor = colour;
    colourPresets[i] = colour;
    localStorage.setItem('colour' + i, colour);
    eraserPressed = false;
});

$('#eraser').on('click', function() {
	eraserPressed = true;	
	setCursor();
});

$('#clear').on('click', function() {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	socket.emit('clear');
});

var brushSlider = new Slider('#brushSlider', {
  formatter: function(value) {
  	thickness = value;
  	setCursor();
    return value;
  }
});

function setCursor() {
	var roundedThickness = Math.round(thickness/5)*5;
	var url;
	if(roundedThickness==0)
		roundedThickness = 5;
	var spacing = Math.round(roundedThickness/2);
	if(!eraserPressed){
		url = "url('../Cursors/circleCursor-" + roundedThickness + "px.ico') " + spacing + " " + spacing + ", default"; 
		$('#whiteboard').css('cursor', url);
	}
	else{
		url = "url('../Cursors/squareCursor-" + roundedThickness + "px.ico') " + spacing + " " + spacing + ", default"; 
		$('#whiteboard').css('cursor', url);
	}
}

//DRAWING KEYBINDS
$(window).keypress(function(e) {
    if(drawKeysEnabled){
        if (e.which == 91 && thickness > 1) { // "[" Key
            brushSlider.setValue(thickness - thicknessAmt);
        }
        if (e.which == 93 && thickness < 60) { // "]" Key
            brushSlider.setValue(thickness + thicknessAmt);
        }
        if (e.which == 99 || e.which == 67) { //c key
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            socket.emit('clear');
        }
        if (e.which == 101 || e.which == 69) { //e key
            eraserPressed = true;
            setCursor();
        }
        if (e.which == 100 || e.which == 68) { //d key
            eraserPressed = false;
            setCursor();
        }

        if (e.which == 49) { //1 key
            colour = colourPresets[0];
            $('#colour-preview1').addClass('selectedColour');
            $('#colour-preview2').removeClass('selectedColour');
            $('#colour-preview3').removeClass('selectedColour');
            $('#colour-preview4').removeClass('selectedColour');
            eraserPressed = false;
        }
        
        if (e.which == 50) { //2 key
            colour = colourPresets[1];
            $('#colour-preview1').removeClass('selectedColour');
            $('#colour-preview2').addClass('selectedColour');
            $('#colour-preview3').removeClass('selectedColour');
            $('#colour-preview4').removeClass('selectedColour');
          eraserPressed = false;
        }
        
        if (e.which == 51) { //3 key
            colour = colourPresets[2];
            $('#colour-preview1').removeClass('selectedColour');
            $('#colour-preview2').removeClass('selectedColour');
            $('#colour-preview3').addClass('selectedColour');
            $('#colour-preview4').removeClass('selectedColour');
            eraserPressed = false;
        }
        
        if (e.which == 52) { //4 key
            colour = colourPresets[3];
            $('#colour-preview1').removeClass('selectedColour');
            $('#colour-preview2').removeClass('selectedColour');
            $('#colour-preview3').removeClass('selectedColour');
            $('#colour-preview4').addClass('selectedColour');
            eraserPressed = false;
        }  
    }
});
//END DRAWING KEYBINDS
