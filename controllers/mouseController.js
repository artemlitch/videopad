(function() {
    document.onmousemove = handleMouseMove;
    document.onclick = handleMouseClick;
    document.onmousedown = handleMouseDown;

    function handleMouseMove(event) {
        var dot, eventDoc, doc, body, pageX, pageY;

        event = event || window.event; // IE-ism

        // If pageX/Y aren't available and clientX/Y are,
        // calculate pageX/Y - logic taken from jQuery.
        // (This is to support old IE)
        if (event.pageX == null && event.clientX != null) {
            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX +
              (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
              (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
              (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
              (doc && doc.clientTop  || body && body.clientTop  || 0 );
        }
        console.log(event.pageX + " " +event.pageY);
    }

    function handleMouseClick(event) {
        console.log("MOUSE CLICK");
    }

    function handleMouseDown(event) {
        console.log("MOUSE DRAG");
    }

})();
