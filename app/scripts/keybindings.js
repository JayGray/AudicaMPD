(function (window, Mousetrap) {

  window.keybindings = function(AudicaMPD) {
    var dom = AudicaMPD.Dom,
      searchField = dom.searchField,
      searchResults = dom.searchResults,
      bindKeysToView = {};


    AudicaMPD.on('viewStateChanged', function(args){
      Mousetrap.reset();
      bindKeysToView[args.to].call(this);
    });

    bindKeysToView.player = function(){

      Mousetrap.bind(['l'], function () {
        AudicaMPD.Dom.playerView.css('left', '100%');
        AudicaMPD.setViewState('search');

      });

      Mousetrap.bind(['space'], function () {
        var togglePlay = function(state){
          if('playing' === state){
            AudicaMPD.mopidy.playback.pause();
          }else{
            AudicaMPD.mopidy.playback.resume();
          }
        };
        AudicaMPD.mopidy.playback.getState()
          .then(togglePlay, console.error);
      });

    };

    bindKeysToView.search = function(){
      Mousetrap.bind(['enter'], function () {
        if (searchField.is(':focus')) {
          var split = searchField.val().split(':');
          var searchVal = split[1].trim();
          var searchType = split[0].trim().toLowerCase();
          var searchJSON = '{"' + searchType + '":["' + searchVal + '"]}';
          AudicaMPD.trigger('search', searchJSON);
        }
      });

      Mousetrap.bind(['up'], function(){
        var prev = null;
        var songBoxPositionY = AudicaMPD.getSongBoxPositionY();
        if (!songBoxPositionY) {
          AudicaMPD.setSongBoxPositionY(searchResults.find('li').eq(0));
          prev = AudicaMPD.getSongBoxPositionY();
        } else {
          prev = songBoxPositionY.prev();
          songBoxPositionY.removeClass('active');
          if (prev.length === 0) {
            prev = dom.searchResults.find('li').last();
          }
        }
        var halfWindowSize = window.innerHeight / 2;
        var scrollPos = Math.abs(searchResults.scrollTop() + prev.position().top) - halfWindowSize;
        searchResults.scrollTop(scrollPos);
        prev.addClass('active');
        AudicaMPD.setSongBoxPositionY(prev);
      });

      Mousetrap.bind(['down'], function(){
        var next = null;
        var songBoxPositionY = AudicaMPD.getSongBoxPositionY();
        if (!songBoxPositionY) {
          AudicaMPD.setSongBoxPositionY(searchResults.find('li').eq(0));
          next = AudicaMPD.getSongBoxPositionY();
        } else {
          next = songBoxPositionY.next();
          songBoxPositionY.removeClass('active');
          if (next.length === 0) {
            next = searchResults.find('li').eq(0);
          }
        }
        var halfWindowSize = window.innerHeight / 2;
        var scrollPos = Math.abs(next.position().top + searchResults.scrollTop()) - halfWindowSize;
        searchResults.scrollTop(scrollPos);
        next.addClass('active');
        AudicaMPD.setSongBoxPositionY(next);
      });

      Mousetrap.bind(['escape'], function () {
        AudicaMPD.Dom.playerView.css('left', 0);
        AudicaMPD.setViewState('player');
      });
    };



    Mousetrap.bind(['c'], function () {
      var open = self.Dom.controls.data('open');
      if(open){
        self.Dom.controls.animate({'bottom': -46}, function(){
          $(this).data('open', false);
        });
      }else{
        self.Dom.controls.animate({'bottom': 0}, function(){
          $(this).data('open', true);
        });
      }
    });

    bindKeysToView[AudicaMPD.getViewState()].call(AudicaMPD);
  };
})(window, Mousetrap);
