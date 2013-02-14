/*global window, $*/

(function(window, $){
  "use strict";


  function AudicaMPD(){
    this.eventList = [];
    this.mopidy = null;
    this.plugins = {};
    this.pluginsToInitialize = 0;

    var viewState = 'player';
    var songBoxPositionY = null;

    //  Getter & Setter
    this.getViewState = function () {
      return viewState;
    };
    this.setViewState = function (newViewState) {
      var oldState = viewState;
      viewState = newViewState;
      this.trigger('viewStateChanged', {from:oldState, to:viewState});
    };
    this.getSongBoxPositionY = function () {
      return songBoxPositionY;
    };
    this.setSongBoxPositionY = function (positionY) {
      songBoxPositionY = positionY;
    };

  }

  AudicaMPD.prototype.Dom = {
    wrapper: null,
    searchView: null,
    controls: null,
    timeline: null,
    playerView: null,
    trackList: null,
    currentPlaying: null,
    track: null,
    artist: null,
    album: null,
    searchField: null,
    searchResults: null
  };

  AudicaMPD.prototype.initDom = function(){
    for(var selector in this.Dom){
      if(this.Dom.hasOwnProperty(selector)){
        this.Dom[selector] = $('#' + selector);
      }
    }
    this.trigger('domInitReady');
  };

  AudicaMPD.prototype.applyDimensions = function(){
    var windowHeight = $(window).height();
    var windowWidth = $(window).width();
    this.Dom.wrapper.width(windowWidth);
    this.Dom.searchView.height(windowHeight);
    this.Dom.searchResults.height(windowHeight - 50);
    this.Dom.trackList.height(windowHeight - 50);
    this.Dom.playerView.height(windowHeight);
  };

  AudicaMPD.prototype.initWebsocket = function(){
    var self = this;
    this.mopidy = new Mopidy({webSocketUrl: "ws://192.168.2.105:6680/mopidy/ws/"});
    this.mopidy.on('state:online', function(){
      self.trigger('websocketReady');
    });
  };

//Start Events
  AudicaMPD.prototype.bindEvents = function(){
    var self = this;

    this.on('websocketReady', function(){
      self.initDom();

      self.mopidy.playlists.getPlaylists().then(function(list){
        console.log('websocketReady');
      });

      self.mopidy.on('event:playbackStateChanged', self.stateChanged);
//      self.mopidy.on('event:trackPlaybackStarted', self.updatePlayerView);
    });

    this.on('domInitReady', function(){
      self.applyDimensions();
      window.keybindings(self);
    });

    this.on('search', function(args){
      self.mopidy.library.search(JSON.parse(args))
        .then(function(list){
          self.renderSearchResults(list);
        }, console.error);
    });

    this.on('initReady', function(){
      if(this.pluginsToInitialize !== 0){
        this.pluginsToInitialize--;
      }else{
        this.trigger('pluginsInitReady');
      }
    });

    this.on('pluginsInitReady', function(){
      this.initWebsocket()
    });
  };

  AudicaMPD.prototype.on = function (eventName, fn) {
    if (!this.eventList[eventName]) {
      this.eventList[eventName] = [];
    }
    this.eventList[eventName].push({ context:this, callback:fn });
    return this;
  };

  AudicaMPD.prototype.trigger = function (eventName) {
    if (!this.eventList[eventName]) {
      return false;
    }
    var args = Array.prototype.slice.call(arguments, 1),
      events = this.eventList[eventName],
      i = 0, length = events.length, subscription;
    for (i; i < length; i++) {
      subscription = events[i];
      //noinspection JSValidateTypes
      subscription.callback.apply(subscription.context, args);
    }
    return this;
  };

//End Events

//Start Search
    AudicaMPD.prototype.renderSearchResults = function(lists){
      var self = this;
      var searchResultCon = $('#searchResults');
      searchResultCon.empty();
      var ul = $('<ul ></ul>');
      ul.appendTo(searchResultCon);
//      var localSearchResults = lists[0];
      var spotifySearchResults = lists[1];

      var bindDblClick = function (li, fn, args) {
        li.on('dblclick', {args: args, scope: self}, fn);
      };

      var buildList = function(){
        var list = arguments[0],
          i = 0, length = list.length, entry;
        for (i; i < length; i++) {
          entry = list[i];
          var li = $('<li>'+ entry.__model__ +' : '+ entry.name +'</li>');
          if('Track' === entry.__model__){
            bindDblClick(li, self.playSingleTrack, entry);
          }else{
            bindDblClick(li, self.playAlbum, entry);
          }
          li.appendTo(ul);
        }
      };

      if(spotifySearchResults.tracks){
        buildList.call(self,spotifySearchResults.tracks);
      }

      if(spotifySearchResults.albums){
        buildList.call(self,spotifySearchResults.albums);
      }
  };
//End Search

//Start playback
  AudicaMPD.prototype.playSingleTrack = function(ev){
      var self = ev.data.scope, track = ev.data.args;
      var getFirst = function(list){
        return list[0];
      };

      self.mopidy.tracklist.add([track])
        .then(getFirst, console.error)
        .then(self.mopidy.playback.play, console.error);
  };

  AudicaMPD.prototype.playAlbum = function(ev){
    var self = ev.data.scope, album = ev.data.args;
    var getFirst = function(list){
      return list[0];
    };
    self.mopidy.library.lookup(album.uri)
      .then(self.mopidy.tracklist.add, console.error)
      .then(getFirst, console.error)
      .then(self.mopidy.playback.play, console.error);
  };
//End playback

  AudicaMPD.prototype.stateChanged = function(event){
    console.log(event);
  };

  AudicaMPD.prototype.extend = function(name, fn){
    this.plugins[name] = fn;
  };

  AudicaMPD.prototype.initPlugins = function(){
    var plugins = [];
    for(var name in this.plugins){
      if(this.plugins.hasOwnProperty(name)){
        if(this.plugins[name].init instanceof Function){
          plugins[plugins.length] = name;
        }
      }
    }
    var length = plugins.length, plugin;
    this.pluginsToInitialize = length-1;
    if(length !== 0){
      for(var i = 0; i < length; ++i){
        plugin = plugins[i];
        this.plugins[plugin].init.call(this);
      }
    }else{
      this.trigger('pluginsInitReady');
    }
  };

//End view

  AudicaMPD.prototype.start = function(){
    this.bindEvents();
    this.initPlugins();
  };

  window.AudicaMPD = new AudicaMPD();
})(window, jQuery);