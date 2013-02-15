(function(window, $, AudicaMPD){
  "use strict";

  function PlayerView(){
    var scrollPosition = 0,
      scrollStep = 0,
      playlistLength = 0,
      trackInFront = 1,
      halfWindow = $(window).height() / 2;

    var updateView = function(args){
      var currentTrack = args.track;
      var trackName = currentTrack.name;
      var artist = currentTrack.artists[0].name;
      var album = currentTrack.album.name;
      AudicaMPD.Dom.track.text(trackName);
      AudicaMPD.Dom.artist.text(artist);
      AudicaMPD.Dom.album.text(album);

    };

    var renderCurrentTrack = function(obj){
      if('playing' === obj){
        AudicaMPD.mopidy.playback.getCurrentTlTrack()
          .then(function(track){

            AudicaMPD.trigger('updateView', {track: track.track});
            AudicaMPD.trigger('playing');
          });
      }else if(obj instanceof Object){
        if(obj.tl_track){
          AudicaMPD.trigger('updateView', {track: obj.tl_track.track})
        }
      }
    };

    var renderTracklist = function(list){
      var length = list.length;
      var angle = 360 / length;
      //110 = single track div height
      var radius = ((110 / Math.PI) * length) / 2;
      playlistLength = length;
      scrollStep = angle;
      for (var i = 0; i < length; i++) {
        var track = list[i].track;
        var trackDiv = $('<div><p>' + track.name+ '</p><p>by: '+ track.artists[0].name +'</p><p>from: '+ track.album.name +'</p></div>');
        trackDiv.css({'-webkit-transform':'rotateX(' + (angle * i) + 'deg) translateZ(' + radius + 'px)'});
        trackDiv.height(80);
        trackDiv.appendTo(AudicaMPD.Dom.ring);
      }
    };

    var getTracklist = function(){
      AudicaMPD.mopidy.tracklist.getTlTracks()
        .then(renderTracklist, console.error);
    };

    var scrollTracklist = function(args){
      if(args.dir === 'up'){
        scrollPosition = scrollPosition + scrollStep;
        trackInFront++;
      } else{
        scrollPosition = scrollPosition - scrollStep;
        trackInFront--;
      }

      if(trackInFront <= 0){
        trackInFront = playlistLength - 1;
      }else if(trackInFront >= playlistLength -1){
        trackInFront = 1;
      }
      console.log(trackInFront);
      //TODO wo kommt der offset von 40px her
      AudicaMPD.Dom.ring.css({'-webkit-transform': 'rotateX('+ scrollPosition +'deg) translateY('+ (halfWindow - 40)+'px)'});
    };

    var bindEvents = function(){

      AudicaMPD.on('updateView', updateView);
      AudicaMPD.on('scroll', scrollTracklist);

      AudicaMPD.on('websocketReady', function(){
        AudicaMPD.mopidy.on('event:trackPlaybackStarted', renderCurrentTrack);
//        AudicaMPD.mopidy.on('event:trackPlaybackEnded', updateView);

        AudicaMPD.mopidy.playback.getState()
          .then(renderCurrentTrack, console.error);

        getTracklist();
      });
    };


    this.init = function(){
      bindEvents();
      AudicaMPD.trigger('initReady');
    };
  }

  window.AudicaMPD.extend('playerView', new PlayerView());
})(window, jQuery, AudicaMPD);
