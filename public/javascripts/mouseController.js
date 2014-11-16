(function() {
    
    var paint, newLine; 
    var context;
    var clickX, clickY;
    context = document.getElementById('whiteBoard').getContext("2d");
    
    var canvas = document.getElementById("whiteBoard"); 
    //document.onmousedown = handleMouseDown;
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
        //console.log('Mouse position: ' + mousePos.x + ',' + mousePos.y);
        if(paint) {
            addClick(mousePos.x, mousePos.y);
        }
      }, false);
    
    canvas.addEventListener('mousedown' ,function(evt) {
        paint = true;
        var mousePos = getMousePos(canvas, evt);
        mouseX = mousePos.x;
        mouseY = mousePos.y;
    }, false);

    function handleMouseUp(event){
        console.log("MOUSE UP");
        paint = false;
        clickX = undefined;
        clicKY = undefined;
    }

    function addClick(x, y) {
        context.beginPath();
        context.moveTo(clickX, clickY);
        context.lineTo(x, y);
        context.lineWidth = 5;
        context.stroke();
        clickX = x;
        clickY = y;
    }

    $('.colourpicker').on('changeColor', function(ev) {
        context.strokeStyle = ev.color.toHex();
    });

})();
