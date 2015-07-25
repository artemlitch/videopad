 $.notify.addStyle('pauseStyle', {
  html: "<div id='notifContainer'>"+
            "<span class='glyphicon glyphicon-pause custom-icon' aria-hidden='true'></span>" +
            "<div class='title' data-notify-html='title'/>" +
            "<div class='transparent-notif' </div>" +
        "</div>"
});   

 $.notify.addStyle('playStyle', {
  html: "<div id='notifContainer'>"+
            "<span class='glyphicon glyphicon-play custom-icon' aria-hidden='true'></span>" +
            "<div class='title' data-notify-html='title'/>" +
            "<div class='transparent-notif' </div>" +
        "</div>"
});   
function removePrevNotification() {
    var notification = $('#notifContainer').parent('.notifyjs-container').parent('.notifyjs-wrapper');
    if(notification) {
        notification.trigger('notify-hide');
    }
}

function notifyPause() {
    removePrevNotification();
  $.notify({
      title:"Video Paused",
      },
      {
        globalPosition:"top center",
        style: 'pauseStyle',
        autoHide: true,
        autoHideDelay: 700,
      }
      );
}
function notifyPlay() {
    removePrevNotification();
  $.notify({
      title:"Video Resumed",
      },
      { 
        globalPosition:"top center",
        style: 'playStyle',
        autoHide: true,
        autoHideDelay: 700,
      }
      );
}

