angular.module('ScrapeRentals')
  .service('RequestApi', function($http) {

    'use strict'

    function getAll(params) {
      var request = $http({
        method: 'POST',
        url: '/',
        data: params
      });
      return (request.then(successHandler, errorHandler));
    }

    function successHandler(response) {
      return (response);
    }

    function errorHandler(response) {
      return (response);
    }

    return ({
      getAll: getAll
    });
    RequestApi.$inject('$http');
  });