angular.module('AirBnb')
  .service('StateService', function() {

    'use strict'

    var data = {
      'SearchForm': {
        'isValidLocation': false,
        'isCheckIn': false,
        'isCheckOut': false,
        'checkInDate': null,
        'checkOutDate': null
      }
    };

    return ({
      data: data
    });
  });
