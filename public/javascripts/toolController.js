$(document).ready(function() {

	var context = document.getElementById('whiteBoard').getContext('2d');
	
	$('.colourpicker').on('changeColor', function(ev) {
        context.strokeStyle = ev.color.toHex();
    });
})