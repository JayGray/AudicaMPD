(function(window, $, AudicaMPD){
  "use strict";

  function PlayerView(){
    var self = this;

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
      var ul = $('<ul></ul>');
      for (var i = 0, length = list.length; i < length; i++) {
        var track = list[i].track;
        console.log(track);
        var li = $('<li>' + track.name+ '</li>');
        li.appendTo(ul);
      }
      ul.appendTo(AudicaMPD.Dom.trackList);
    };

    var getTracklist = function(){
      AudicaMPD.mopidy.tracklist.getTlTracks()
        .then(renderTracklist, console.error);
    };


    var bindEvents = function(){

      AudicaMPD.on('updateView', updateView);

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
