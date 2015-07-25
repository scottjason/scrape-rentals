angular.module('BedAndBoard')
  .service('GoogleMaps', function($timeout, StateService) {

    'use strict'

    var address = '';

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

    function isValid(obj, cb) {
      if (!obj.place.address_components) {
        return cb(null);
      }

      for (var i = 0; i < obj.place.address_components.length; i++) {
        var addressType = obj.place.address_components[i].types[0];
        if (obj.componentForm[addressType]) {
          var val = obj.place.address_components[i][obj.componentForm[addressType]];
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
