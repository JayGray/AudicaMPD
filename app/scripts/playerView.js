(function(window, $, AudicaMPD){
  "use strict";

  function PlayerView(){
    var scrollPosition = 0,
      scrollStep = 0,
      playlistLength = 0,
      trackInFront = 0,
      halfWindow = $(window).height() / 2,
      currentState = 'stopping',
      currentTrackID = null;


    var scrollToCurrentTrack = function () {
      AudicaMPD.Dom.ring.find('.activeTrack').removeClass('activeTrack');
      AudicaMPD.Dom.ring.find('div').eq(trackInFront).addClass('activeTrack');
      AudicaMPD.Dom.ring.css({'-webkit-transform':'rotateX(' + scrollPosition + 'deg) translateY(' + (halfWindow - 40) + 'px)'});
    };

    var renderTracklist = function(list){
      AudicaMPD.Dom.ring.empty();
      var length = list.length;
      var angle = 360 / length;
      //110 = single track div height
      var radius = ((110 * length) / 2) / Math.PI;
      playlistLength = length;
      scrollStep = angle;
      for (var i = 0; i < length; i++) {
        var track = list[i].track;
        var clazz = '';
        if(currentTrackID && currentTrackID === list[i].tlid){
           clazz = 'activeTrack';
          trackInFront = i;
        }else if(!currentTrackID && i === 0){
           clazz = 'activeTrack';
        }
        var trackDiv = $('<div class="'+ clazz +'"><p>' + track.name+ '</p><p>by: '+ track.artists[0].name +'</p><p>from: '+ track.album.name +'</p></div>');
        trackDiv.css({'-webkit-transform':'rotateX(' + (angle * i) + 'deg) translateZ(' + radius + 'px)'});
        //80 plus 15 padding top/bottom = 110
        trackDiv.height(80);
        trackDiv.appendTo(AudicaMPD.Dom.ring);
      }
      scrollPosition = -(trackInFront * scrollStep);
      scrollToCurrentTrack();
    };

    var getTracklist = function(){
      AudicaMPD.mopidy.tracklist.getTlTracks()
        .then(renderTracklist, console.error);
    };

    var scrollTracklist = function(args){
      if(args.dir === 'up'){
        scrollPosition = scrollPosition - scrollStep;
        trackInFront++;
      } else{
        scrollPosition = scrollPosition + scrollStep;
        trackInFront--;
      }

      if(trackInFront < 0){
        trackInFront = playlistLength - 1;
      }else if(trackInFront >= playlistLength){
        trackInFront = 0;
      }
      scrollToCurrentTrack();
    };

    var setCurrentTrackID = function(){
      AudicaMPD.mopidy.playback.getCurrentTlTrack().then(function(track){
        currentTrackID = track.tlid;
      });
    };

    var setCurrentState = function(state){
      currentState = state.new_state ? state.new_state : state;
      if('playing' === currentState){
        setCurrentTrackID();
      }
      getTracklist();
    };

    var bindEvents = function(){

//      AudicaMPD.on('updateView', updateView);
      AudicaMPD.on('scroll', scrollTracklist);
      AudicaMPD.on('playbackStateChanged', setCurrentState);

      AudicaMPD.on('websocketReady', function(){

        AudicaMPD.currentPlaybackStatus().then(setCurrentState);

      });
    };


    this.init = function(){
      bindEvents();
      AudicaMPD.trigger('initReady');
    };
  }

  window.AudicaMPD.extend('playerView', new PlayerView());
})(window, jQuery, AudicaMPD);
