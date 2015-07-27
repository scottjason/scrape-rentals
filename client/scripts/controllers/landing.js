'use strict';

angular.module('ScrapeRentals')
  .controller('LandingCtrl', LandingCtrl);

function LandingCtrl($scope, $rootScope, $state, $timeout, GoogleMaps, DataService, RequestApi, StateService) {

  var ctrl = this;
  var autoComplete;

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
        $scope.showLoader = true;
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
    var opts = {};
    opts.type = 'request-opts';
    opts.address = autoComplete.getPlace();
    DataService.generateOpts(opts, function(requestOpts) {
      StateService.data['SearchForm'].isValid = true;
      StateService.data['SearchForm'].requestOpts = requestOpts;
    });
  };

  ctrl.makeRequest = function(requestOpts) {
    RequestApi.getAll(requestOpts).then(function(response) {
        if (typeof response.data === 'object' && Array.isArray(response.data)) {
          if (response.data.length) {
            $timeout(function() {
              $scope.showLoader = false;
              $scope.searchForm = '';
              $scope.listings = response.data;
              $scope.showListings = true;
            });
          } else {
            $timeout(function() {
              $scope.showLoader = false;
              $scope.searchForm = '';
              $scope.showErrMessage = true;
              $timeout(function() {
                $scope.showErrMessage = false;
              }, 1400)
            })
          }
        }
      },
      function(err) {
        console.err('err', err);
      });
  };

  LandingCtrl.$inject['$scope', '$rootScope', '$state', '$timeout', 'GoogleMaps', 'DataService', 'RequestApi', 'StateService'];
}
