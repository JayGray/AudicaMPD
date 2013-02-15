(function(window, $, AudicaMPD){
  "use strict";

  function PlayerView(){
    var self = this,
      scrollPositions = [],
      scrollStep = 0,
      maxScrollsteps = 0,
      ring = $('<div id="ring"></div>');

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
      var radius = 200;
      maxScrollsteps = length - 1;
      for (var i = 0; i < length; i++) {
        var track = list[i].track;
        scrollPositions.push(angle * i);
        var trackDiv = $('<div style="-webkit-transform:rotateX(' + (angle * i) + 'deg) translateZ(' + radius + 'px);"><p>' + track.name+ '</p></div>');
        trackDiv.appendTo(ring);
      }
      ring.appendTo(AudicaMPD.Dom.trackList);
      var halfWindow = $(window).height() / 2;
      ring.height(halfWindow);
      ring.css({'top':halfWindow / 2});
    };

    var getTracklist = function(){
      AudicaMPD.mopidy.tracklist.getTlTracks()
        .then(renderTracklist, console.error);
    };

    var scrollTracklist = function(args){
      args.dir === 'up' ? scrollStep++ : scrollStep--;
      if(scrollStep > maxScrollsteps){
        scrollStep = 0;
      }else if( scrollStep < 0){
        scrollStep = maxScrollsteps;
      }
      var scrollPosition = scrollPositions[scrollStep];
      ring.css({'-webkit-transform': 'rotateX('+ scrollPosition +'deg) translateY(140px)'});
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
