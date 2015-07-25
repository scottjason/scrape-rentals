angular.module('BedAndBoard')
  .service('GoogleMaps', function($timeout, StateService) {

    'use strict'

    var address = '';
    var componentForm = {
      street_number: 'short_name',
      route: 'long_name',
      locality: 'long_name',
      administrative_area_level_1: 'short_name',
      country: 'long_name',
      postal_code: 'short_name'
    };

    function addEventListener(type, cb) {
      var autocomplete = new google.maps.places.Autocomplete(
        (document.getElementById('autocomplete')), {
          types: ['geocode']
        });
      google.maps.event.addListener(autocomplete, 'place_changed', function(e) {
        cb();
      });
      return autocomplete;
    }

    function isValid(place, cb) {
      if (!place.address_components) {
        return cb(null);
      }

      for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        if (componentForm[addressType]) {
          var val = place.address_components[i][componentForm[addressType]];
          address += val + ' ';
        }
      }

      $timeout(function() {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
          "address": address
        }, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            cb(true, results);
          } else {
            cb(null, results);
          }
        });
      });
    }

    return ({
      addEventListener: addEventListener,
      isValid: isValid
    });
    ng.$inject('$timeout');
  });
