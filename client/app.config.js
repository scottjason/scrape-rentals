'use strict';

angular.module('ScrapeRentals')
  .config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

    window.console.warn = function() {
      return false;
    }


    $stateProvider
      .state('landing', {
        url: '/',
        templateUrl: 'views/landing.html',
        controller: 'LandingCtrl as landingCtrl'
      })

    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  });