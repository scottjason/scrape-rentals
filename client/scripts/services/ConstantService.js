angular.module('AirBnb')
  .service('ConstantService', function(StateService) {

    'use strict'

    function generateOpts(type) {
      if (type === 'component-form') {
        var opts = {
          street_number: 'short_name',
          route: 'long_name',
          locality: 'long_name',
          administrative_area_level_1: 'short_name',
          country: 'long_name',
          postal_code: 'short_name'
        };
      } else if (type === 'date-picker') {
        var opts = {
          onSelect: function(date) {

            var isCheckIn = StateService.data['SearchForm'].isCheckIn;
            if (isCheckIn) {
              StateService.data['SearchForm'].isCheckIn = false;
              StateService.data['SearchForm'].checkInDate = date;
            } else {
              StateService.data['SearchForm'].isCheckOut = false;
              StateService.data['SearchForm'].checkOutDate = date;
            }
          }
        };
      }
      return opts;
    }

    return ({
      generateOpts: generateOpts
    });
    ng.$inject('StateService');
  });
