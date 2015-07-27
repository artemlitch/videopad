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

  $.notify.addStyle('syncStyle', {
   html: "<div id='notifContainer'>"+
             "<span class='glyphicon glyphicon-refresh custom-icon' aria-hidden='true'></span>" +
             "<div class='title' data-notify-html='title'/>" +
             "<div class='transparent-notif' </div>" +
         "</div>"
 }); 

$.notify.addStyle('speedUpStyle', {
   html: "<div id='notifContainer'>"+
             "<span class='glyphicon glyphicon-fast-forward custom-icon' aria-hidden='true'></span>" +
             "<div class='title' data-notify-html='title'/>" +
             "<div class='transparent-notif' </div>" +
         "</div>"
 });

$.notify.addStyle('slowDownStyle', {
   html: "<div id='notifContainer'>"+
             "<span class='glyphicon glyphicon-fast-backward custom-icon' aria-hidden='true'></span>" +
             "<div class='title' data-notify-html='title'/>" +
             "<div class='transparent-notif' </div>" +
         "</div>"
 });

$.notify.addStyle('normalizeStyle', {
   html: "<div id='notifContainer'>"+
             "<span class='fa fa-caret-square-o-right fa-lg custom-icon' aria-hidden='true'></span>" +
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

function notifySync() {
    removePrevNotification();
  $.notify({
      title:"Video Synced",
      },
      { 
        globalPosition:"top center",
        style: 'syncStyle',
        autoHide: true,
        autoHideDelay: 700,
      }
      );
}

function notifySpeedUp() {
    removePrevNotification();
  $.notify({
      title:"Speed Increased",
      },
      { 
        globalPosition:"top center",
        style: 'speedUpStyle',
        autoHide: true,
        autoHideDelay: 700,
      }
      );
}

function notifySlowDown() {
    removePrevNotification();
  $.notify({
      title:"Speed Decreased",
      },
      { 
        globalPosition:"top center",
        style: 'slowDownStyle',
        autoHide: true,
        autoHideDelay: 700,
      }
      );
}

function notifyNormalize() {
    removePrevNotification();
  $.notify({
      title:"Normal Speed",
      },
      { 
        globalPosition:"top center",
        style: 'normalizeStyle',
        autoHide: true,
        autoHideDelay: 700,
      }
      );
}