(function() {
    var socket = io();
    var paint, newLine; 
    var context;
    var clickX, clickY;
    context = document.getElementById('whiteBoard').getContext("2d");
    
    var canvas = document.getElementById("whiteBoard"); 
    document.onmouseup = handleMouseUp;
    
    // get the mouse position and return as Json
    function getMousePos(canvas, event) {
        var rect = canvas.getBoundingClientRect();
        var jCanvas = $('#whiteBoard');
        var posJson = {"x": (event.clientX-rect.left)/(rect.right-rect.left)*jCanvas.width(),
                       "y": (event.clientY-rect.top)/(rect.bottom-rect.top)*jCanvas.height()};  
        return posJson;
    }
    // add a listener to the canvas when mouse is moving over it
    canvas.addEventListener('mousemove', function(evt) {
        var mousePos = getMousePos(canvas, evt);
        if(paint) {
            addClick(clickX, clickY, mousePos.x, mousePos.y);
        }
      }, false);
    
    canvas.addEventListener('mousedown' ,function(evt) {
        paint = true;
        var mousePos = getMousePos(canvas, evt);
        mouseX = mousePos.x;
        mouseY = mousePos.y;
    }, false);

    function handleMouseUp(event){
        paint = false;
        clickX = undefined;
        clicKY = undefined;
    }
    

    // Called when a client recieves data that a line is drawn
    socket.on('writeLineRecieved' , function(style, oldX, oldY, mouseX, mouseY) {
        addLine(style, oldX, oldY, mouseX, mouseY);
    });
    
    // call this for local drawing
    function addClick(oldX, oldY, x, y) {
        context.beginPath();
        context.moveTo(clickX, clickY);
        context.lineTo(x, y);
        context.lineWidth = 5;
        context.stroke();
        socket.emit('writeLine',context.strokeStyle, clickX, clickY, x, y);
        clickX = x;
        clickY = y;
    }
    // call this when the server calls writeLineRecieved
    function addLine(style, oldX, oldY, x, y) {
        var oldStyle = context.strokeStyle;
        context.strokeStyle = style;
        context.beginPath();
        context.moveTo(oldX, oldY);
        context.lineTo(x, y);
        context.lineWidth = 5;
        context.stroke();
        context.strokeStyle = oldStyle;
    }

})();
