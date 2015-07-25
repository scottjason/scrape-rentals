angular.module('BedAndBoard')
  .directive('ngDatePicker', function(ConstantService, StateService) {
    return {
      link: function(scope, element, attrs) {
        element.bind('click', function($event) {
          StateService.data['SearchForm'].isCheckIn = ($event.target.name === 'checkin');
          StateService.data['SearchForm'].isCheckOut = ($event.target.name === 'checkout');
        });
      },
      controller: ['$scope', function($scope) {

        var opts = ConstantService.generateOpts('date-picker');
        var checkIn = $('#checkin');
        var checkOut = $('#checkout');
        checkIn.datepicker(opts);
        checkOut.datepicker(opts);

      }],
    }
    ng.$inject('ConstantService', 'StateService');
  });
