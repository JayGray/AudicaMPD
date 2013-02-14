(function(window, $, AudicaMPD){
  "use strict";

  function Controls(){
    var self = this;
    var backgroundIntervalID = null;

    var startBackgroundTasks = function(currentTrack){
      var currentTrackLength = currentTrack.tl_track ? currentTrack.tl_track.track.length : currentTrack.track.length;

      var updateTimings = function(currentPos){
        var percentage = (100 * currentPos) / currentTrackLength;
        AudicaMPD.Dom.timeline.width(percentage + '%');
      };

      if(backgroundIntervalID){
        window.clearInterval(backgroundIntervalID);
      }
      backgroundIntervalID = window.setInterval(function(){
        AudicaMPD.mopidy.playback.getTimePosition()
          .then(updateTimings,console.error)
        }, 1000);
    };

    var stopBackgroundTasks = function(){
      window.clearInterval(backgroundIntervalID);
    };

    var getCurrentTrack = function(){
      AudicaMPD.mopidy.playback.getCurrentTlTrack()
        .then(startBackgroundTasks, console.error);
    };

    var bindEvents = function(){
      AudicaMPD.on('websocketReady', function(){
        AudicaMPD.mopidy.on('event:trackPlaybackStarted', startBackgroundTasks);
        AudicaMPD.mopidy.on('event:trackPlaybackEnded', stopBackgroundTasks);
        AudicaMPD.on('playing', getCurrentTrack);
      });
    };


    this.init = function(){
      bindEvents();
      AudicaMPD.trigger('initReady');
    };
  }

  window.AudicaMPD.extend('controls', new Controls());
})(window, jQuery, AudicaMPD);
