'use strict';

angular.module('ScrapeRentals')
  .controller('LandingCtrl', LandingCtrl);

function LandingCtrl($scope, $rootScope, $state, $timeout, GoogleMaps, DataService, RequestApi, StateService) {

  var autoComplete;
  var ctrl = this;

  var stateMap = DataService.generateMap();

  this.initialize = function() {
    var isReload = StateService.data['SearchForm'].isReload;
    if (!isReload) {
      autoComplete = GoogleMaps.addEventListener('autocomplete', ctrl.onAutoComplete)
      $timeout(function() {
        $scope.showBackground = true;
        window.scrollTo(0, 0);
        $timeout(function() {
          $scope.bgBlack = true;
        }, 1500);
      }, 300);
    } else {
      StateService.data['SearchForm'].isReload = false;
      autoComplete = GoogleMaps.addEventListener('autocomplete', ctrl.onAutoComplete);
      $scope.showBackground = true;
      $scope.bgBlack = true;
      $scope.showListings = false;
      window.scrollTo(0, 0);
    }
  };

  this.onSubmit = function(isReload) {
    if (!isReload) {
      var isValid = StateService.data['SearchForm'].isValid;
      if (isValid) {
        var requestOpts = StateService.data['SearchForm'].requestOpts;
        StateService.data['SearchForm'].isValid = false;
        StateService.data['SearchForm'].requestOpts = null;
        ctrl.makeRequest(requestOpts);
      }
    } else {
      StateService.data['SearchForm'].isReload = true;
      $state.go($state.current, {}, {
        reload: true
      });
    }
  };

  this.viewListing = function(url) {
    window.open(url);
  };

  ctrl.onAutoComplete = function() {
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
    obj.rentalsUrl = 'http://www.rentals.com/';
    var arr = obj.city.split(' ');
    if (arr.length > 1) {
      obj.city = '';
      obj.truiliaCity = '';
      arr.forEach(function(elem, index) {
        if (index !== arr.length - 1) {
          console.log(elem);
          obj.city += (elem + '-');
          obj.truiliaCity += (elem + '_');
        } else {
          console.log(elem);
          obj.city += elem;
          obj.truiliaCity += elem;
        }
      });
    }
    obj.rentalsUrl += stateMap[obj.state] + '/' + obj.city + '/'
    obj.truiliaCity = obj.truiliaCity ? obj.truiliaCity : obj.city;
    obj.truliaUrl = 'http://www.trulia.com/for_rent/' + obj.truiliaCity + ',' + obj.state;
    StateService.data['SearchForm'].isValid = true;
    StateService.data['SearchForm'].requestOpts = obj;
  };

  ctrl.makeRequest = function(requestOpts) {
    RequestApi.getAll(requestOpts).then(function(response) {
        if (typeof response.data.rentals === 'object' && Array.isArray(response.data.rentals) && typeof response.data.apartments === 'object' && Array.isArray(response.data.apartments)) {
          console.log(response)
          if (response.data.rentals.length) {
            var listings = response.data.rentals;
          }
          if (response.data.apartments.length && listings) {
            (response.data.apartments).forEach(function(obj) {
              listings.push(obj);
            });
          }
          $scope.searchForm = '';
          $scope.listings = listings;
          $scope.showListings = true;
        } else {
          console.log('no results found');
        }
      },
      function(err) {
        console.err('err', err);
      });
  };

  LandingCtrl.$inject['$scope', '$rootScope', '$state', '$timeout', 'GoogleMaps', 'DataService', 'RequestApi', 'StateService'];
}
