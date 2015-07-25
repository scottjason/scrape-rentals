'use strict';

angular.module('BedAndBoard')
  .controller('LandingCtrl', LandingCtrl);

function LandingCtrl($scope, $rootScope, $state, $timeout, GoogleMaps, StateService) {

  var autoComplete;
  var ctrl = this;

  $scope.search = {};

  this.initialize = function() {
    $timeout(function() {
      $scope.hideOverlay = true;
    });
    autoComplete = GoogleMaps.addEventListener('autocomplete', ctrl.onAutoComplete)
  };


  // var url = "https://www.airbnb.com/s/Laguna-Niguel--CA--United-States?guests=&checkin=07%2F31%2F2015&checkout=08%2F18%2F2015&ss_id=k11m706a&source=bb";

  this.onSubmit = function() {
    var isValidLocation = StateService.data['SearchForm'].isValidLocation;
    var isValidCheckIn = StateService.data['SearchForm'].checkInDate;
    var isValidCheckOut = StateService.data['SearchForm'].checkOutDate;
    if (isValidLocation && isValidCheckIn && isValidCheckOut) {
      $scope.search.checkIn = StateService.data['SearchForm'].checkInDate;
      $scope.search.checkOut = StateService.data['SearchForm'].checkOutDate;
      console.log('make request, all fields valid', $scope.search);
    } else if (!isValidLocation) {
      $timeout(function() {
        $scope.search.location = '';
        console.log('invalid location')
      });
    } else {
      $timeout(function() {
        console.log('invalid checkin or checkout');
      });
    }
  };


  ctrl.onAutoComplete = function() {
    var selectedLocation = autoComplete.getPlace();
    var isValid = GoogleMaps.isValid(selectedLocation, function(isValid, location) {
      if (isValid && typeof location === 'object' && Array.isArray(location)) {
        $timeout(function() {
          $scope.search.location = location[0].formatted_address;
          StateService.data['SearchForm'].isValidLocation = true;
        });
      } else {
        $timeout(function() {
          $scope.search.location = '';
          StateService.data['SearchForm'].isValidLocation = false;
        });
      }
    });
  };

  LandingCtrl.$inject['$scope', '$rootScope', '$state', '$timeout', 'GoogleMaps', 'StateService'];
}
