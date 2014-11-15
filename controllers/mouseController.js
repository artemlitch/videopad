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
            //redraw();
        }
    }

    function handleMouseDown(event) {
        console.log("MOUSE DRAG");
        paint = true;
    }

    function handleMouseUp(event){
        console.log("MOUSE UP");
        paint = false;
    }

    function addClick(x, y) {
        context.fillRect(x+1, y+1, 2, 2);
    }

})();