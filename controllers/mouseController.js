(function() {
    
    var paint, context;
    var clickX = new Array();
    var clickY = new Array();
    var clickDrag = new Array();

    context = document.getElementById('whiteBoard').getContext("2d");

    document.onmousemove = handleMouseMove;
    document.onclick = handleMouseClick;
    document.onmousedown = handleMouseDown;
    document.onmouseup = handleMouseUp;

    function handleMouseMove(event) {
        console.log(event.pageX + " " +event.pageY);
        console.log(isNaN(event.pageX) + "   " + $('whiteBoard').left);
        if(paint) {
            addClick(event.pageX, event.pageY, true);
            redraw();
        }
    }

    function handleMouseClick(event) {
        console.log("MOUSE CLICK");    
    }

    function handleMouseDown(event) {
        console.log("MOUSE DRAG");
        paint = true;
    }

    function handleMouseUp(event){
        console.log("MOUSE UP");
        paint = false;
    }

    function addClick(x, y, dragging) {
        clickX.push(x);
        clickY.push(y);
        clickDrag.push(dragging);
        console.log("Adding point: (" + x + ", " + y + ") Draw: " + dragging);
    }

    function redraw() {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);

        context.strokeStyle = "#df4b26";
        context.lineJoin = "round";
        context.lineWidth = 5;

        for(var i=0; i < clickX.length; i++) {
            context.beginPath();
            if(clickDrag[i] && i) {
                context.moveTo(clickX[i-1], clickY[i-1]);
            }else{
                context.moveTo(clickX[i-1], clickY[i]);
            }
            context.lineTo(clickX[i], clickY[i]);
            context.closePath();
            context.stroke();
        }
    }

})();