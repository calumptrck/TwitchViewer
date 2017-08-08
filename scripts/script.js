
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
if (getCookie("streamList")=="") {
    setCookie("streamList",'"ESL_SC2","OgamingSC2","imaqtpie","TwitchPresents","freecodecamp","storbeck","habathcx","RobotCaleb","noobs2ninjas"')
}
var streamers = getCookie("streamList").substring(1,getCookie("streamList").length-1).split('","');

$(document).ready(function(){
  for (var streamer in streamers) {
    getUserContent(streamers[streamer]);
  }

  $(".iAdd").keyup(function(event){
    if(event.keyCode == 13){
        $(".bAdd").click();
    }
  });

  $('.bAdd').click(function(){
    streamers.unshift($('.iAdd').val());
    setCookie("streamList","\""+streamers.join("\",\"")+"\"",30);
    console.log("\""+streamers.join("\",\"")+"\"");
    $('.content').html("");
    for (var streamer in streamers) {
      getUserContent(streamers[streamer]);
    }
    $('.iAdd').val('');
  })

  $('.bStat').click(function(){
      $(this).addClass('active').siblings().removeClass('active');
  });
  $('.bAll').click(function(){
    $('.content').html("");
    for (var streamer in streamers) {
      getUserContent(streamers[streamer]);
    }
  })
  $('.bOnline').click(function(){
    $('.content').html("");
    for (var streamer in streamers) {
      getUserContent(streamers[streamer]);
    }
  })
  $('.bOffline').click(function(){
    $('.content').html("");
    for (var streamer in streamers) {
      getUserContent(streamers[streamer]);
    }
  })
});


function generateHTML([name,desc,status,viewers,image,profile,url]) {
  if ($('.bAll').hasClass("active")) {
    addCard([name,desc,status,viewers,image,profile,url]);
  } else if ($('.bOnline').hasClass("active")) {
    if (status=="online") {
      addCard([name,desc,status,viewers,image,profile,url]);
    }
  } else {
    if (status=="offline") {
      addCard([name,desc,status,viewers,image,profile,url]);
    }
  }
}

function addCard([name,desc,status,viewers,image,profile,url]) {
  var vButton = "Profile";
  var statBar = "";
  if (status == "online") {
    vButton = "Stream";
  }
  if (status=="online") {
    statBar = "statOnline";
  } else {
    statBar = "statOffline";
  }
  var cardHTML = '<div class="col-sm-12 col-md-6 col-lg-4"> \
      <div class="card shadow '+status+'"> \
        <img class="card-img-top" src='+image+' alt="Card image cap"> \
        <div class="'+statBar+'"></div> \
          <div class="card-block"> \
              <img class="profile" src="'+profile+'" /> \
              <h3 class="card-title">'+name+'</h3> \
              <div class="card-text dim"> \
                  '+desc+' \
              </div> \
              <a href="'+url+'"><button type="button" class="btn btn-purple mt-2 vStream">View '+vButton+'</button></a> \
          </div> \
          <div class="card-footer text-muted"> \
            <i class="fa fa-user" aria-hidden="true"></i> &nbsp;'+viewers+' \
          </div> \
      </div> \
  </div>'
  $('.content').append(cardHTML);
}

function removeStreamer(name) {
  var ind = streamers.indexOf(name);
  if (ind > -1) {
    streamers.splice(ind, 1);
  }
  setCookie("streamList","\""+streamers.join("\",\"")+"\"",30);
  $('.content').html("");
  for (var streamer in streamers) {
    getUserContent(streamers[streamer]);
  }
}

function getUserContent(streamer) {
  var fArray=[];
  $.ajax({
            type        : 'GET',
            url         :  "https://wind-bow.gomix.me/twitch-api/streams/" + streamer,
            dataType    : 'jsonp',
            success     : function(data) {
              if (data.stream !== null) {
                var pTitle = data.stream.channel.display_name;
                var profile = data.stream.channel.logo;
                var preview = data.stream.preview.medium;
                var viewers = data.stream.viewers;
                var desc = data.stream.channel.status;
                if (desc.length > 175) {
                  desc = desc.substring(0,170)+"...";
                }
                var url = data.stream.channel.url;
                fArray = [pTitle,desc,"online",viewers,preview,profile,url];
                generateHTML(fArray);
              } else {
                $.ajax({
                  type        : 'GET',
                  url         :  "https://wind-bow.gomix.me/twitch-api/users/" + streamer,
                  dataType    : 'jsonp',
                  success     : function(data) {
                    var pTitle = data.display_name;
                    var profile = data.logo;
                    var preview = "images/notStreaming.png"
                    var viewers = "Offline";
                    var desc = data.bio;
                    if (desc == null) {
                      desc = "No bio available";
                    } else if (desc.length > 175) {
                      desc = desc.substring(0,175)+"...";
                    }
                    if (profile == null) {
                      profile = "https://s.jtvnw.net/jtv_user_pictures/hosted_images/GlitchIcon_purple.png";
                    }
                    var url = "https://www.twitch.tv/"+data.name;
                    fArray = [pTitle,desc,"offline",viewers,preview,profile,url];
                    generateHTML(fArray);
                  }
                });
              }
            }
          });
}
