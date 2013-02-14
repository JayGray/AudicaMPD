(function(window, $, AudicaMPD){
  $(function(){
    $('#searchField').typeahead({
      source: ['Any: ','Artist: ','Album: ','Track: ']
    });

    AudicaMPD.start();
  });

})(window, jQuery, AudicaMPD);