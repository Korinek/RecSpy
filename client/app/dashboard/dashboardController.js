(function() {
    'use strict';

    var DashboardController = function(dashboardService, notifierService, requestErrorService) {
        var vm = this;
        vm.message = '';
        dashboardService.getGymStatistics().then(function(success) {
            if (success) {
                console.log('Successful Get Message');
            } else {
                requestErrorService.handleSessionExpired();
            }
        });
    };

    DashboardController.$inject = ['dashboardService', 'notifierService', 'requestErrorService'];
    angular.module('app').controller('DashboardController', DashboardController);
}());
