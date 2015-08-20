 //Initiations******************************************************************
 var styles = [
    ['normalizeStyle','fa fa-caret-square-o-right fa-lg custom-icon'],
    ['slowDownStyle','glyphicon glyphicon-fast-backward custom-icon'],
    ['speedUpStyle','glyphicon glyphicon-fast-forward custom-icon'],
    ['syncStyle','glyphicon glyphicon-refresh custom-icon'],
    ['playStyle','glyphicon glyphicon-play custom-icon'],
    ['pauseStyle','glyphicon glyphicon-pause custom-icon'],
    ['userStyle','fa fa-users fa-sm custom-icon']
];

initStyles();

function initStyles(){
    var s;
    var c;
    for(x = 0; x < (styles.length); x++) {
        for(y = 0; y < 2; y++) {
            if(y == 0)
                s = styles[x][y];
            if(y == 1)
                c = styles[x][y];
        }
        $.notify.addStyle(s, {
           html:"<div id='notifContainer'>" +
                "<span class='" + 
                c + "' aria-hidden='true'></span>" +
                "<div class='title' data-notify-html='title'/>" +
                "<div class='transparent-notif' </div>" +
                "</div>"
         });
    }   
}
//End Initiations***************************************************************

//Functions*********************************************************************
function removePrevNotification() {
    var notification = $('#notifContainer').parent('.notifyjs-container')
                                           .parent('.notifyjs-wrapper');
    if(notification) {
        notification.css('visibility', 'hidden');
        notification.trigger('notify-hide');
    }
}

function sendNotify(msg, styling, duration) {
    removePrevNotification();
    $.notify({
        title: msg,
        },
        {
          globalPosition:"top center",
          style: styling,
          autoHide: true,
          autoHideDelay: duration,
        }
        );
}
//End Functions*****************************************************************

