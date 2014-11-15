(function() {
    
    var paint, context;
    var clickX, clickY;

    context = document.getElementById('whiteBoard').getContext("2d");

    document.onmousemove = handleMouseMove;
    document.onmousedown = handleMouseDown;
    document.onmouseup = handleMouseUp;

    function handleMouseMove(event) {
        console.log(event.pageX + " " +event.pageY);
        console.log(isNaN(event.pageX) + "   " + $('whiteBoard').left);
        if(paint) {
            addClick(event.pageX, event.pageY, true);
        }
    }

    function handleMouseDown(event) {
        console.log("MOUSE DRAG");
        paint = true;
        clickX = event.pageX;
        clickY = event.pageY;
    }

    function handleMouseUp(event){
        console.log("MOUSE UP");
        paint = false;
    }

    function addClick(x, y) {
        context.beginPath();
        context.moveTo(clickX, clickY);
        context.lineTo(x, y);
        context.lineWidth = 5;
        context.strokeStyle = "#00F";
        context.stroke();
        clickX = x;
        clickY = y;
    }

})();