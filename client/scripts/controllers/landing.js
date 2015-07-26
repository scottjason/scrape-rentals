'use strict';

angular.module('BedAndBoard')
  .controller('LandingCtrl', LandingCtrl);

function LandingCtrl($scope, $rootScope, $state, $timeout, GoogleMaps, DataService, RequestApi, StateService) {

  var autoComplete;
  var ctrl = this;

  var stateMap = DataService.generateMap();

  this.initialize = function() {
    autoComplete = GoogleMaps.addEventListener('autocomplete', ctrl.onAutoComplete)
    $timeout(function() {
      $scope.showBackground = true;
      window.scrollTo(0, 0);
      $timeout(function() {
        $scope.bgBlack = true;
      }, 1500);
    }, 300);
  };


  this.onSubmit = function() {
    var isValid = StateService.data['SearchForm'].isValid;
    if (isValid) {
      var requestOpts = StateService.data['SearchForm'].requestOpts;
      StateService.data['SearchForm'].isValid = false;
      StateService.data['SearchForm'].requestOpts = null;
      ctrl.makeRequest(requestOpts);
    }
  };


  ctrl.onAutoComplete = function() {
    window.scrollTo(0, 0);
    var address = autoComplete.getPlace();
    var obj = {};
    var arr = (address.formatted_address).split(',');
    arr.forEach(function(elem, index) {
      if (index === 0) {
        obj.city = elem.trim();
      } else if (index === 1) {
        obj.state = elem.trim();
      }
    });
    obj.url = 'http://www.rentals.com/';
    var arr = obj.city.split(' ');
    if (arr.length > 1) {
      obj.city = '';
      arr.forEach(function(elem, index) {
        if (index !== arr.length - 1) {
          obj.city += (elem + '-');
        } else {
          obj.city += elem;
        }
      });
    }
    obj.url += stateMap[obj.state] + '/' + obj.city + '/'
    StateService.data['SearchForm'].isValid = true;
    StateService.data['SearchForm'].requestOpts = obj;
  }


  ctrl.makeRequest = function(requestOpts) {
    RequestApi.getAll(requestOpts).then(function(response) {
      if (typeof response.data === 'object' && Array.isArray(response.data)) {
        DataService.generateListings(response.data, function(listings) {
          $scope.listings = listings;
          $scope.showListings = true;
          console.log('listings', listings);
        });
      };
    }, function(err) {
      console.err('err', err);
    });
  };

  LandingCtrl.$inject['$scope', '$rootScope', '$state', '$timeout', 'GoogleMaps', 'DataService', 'RequestApi', 'StateService'];
}
