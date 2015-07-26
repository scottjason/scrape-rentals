angular.module('ScrapeRentals')
  .service('GoogleMaps', function($timeout, StateService) {

    'use strict'

    var address = '';

    function addEventListener(type, cb) {
      var autocomplete = new google.maps.places.Autocomplete(
        (document.getElementById('autocomplete')), {
          types: ['(cities)']
        });
      google.maps.event.addListener(autocomplete, 'place_changed', function(e) {
        window.scrollTo(0, 0);
        cb();
      });
      return autocomplete;
    }

    return ({
      addEventListener: addEventListener
    });
    ng.$inject('$timeout');
  });
