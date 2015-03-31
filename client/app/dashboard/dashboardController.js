(function() {
    'use strict';

    var DashboardController = function(dashboardService, notifierService, requestErrorService) {
        var vm = this;
        vm.memberships = [];

        vm.currentIndex = 0;

        vm.displayGymAtCurrentIndex = function() {
            vm.currentlyDisplayedGym = vm.memberships[vm.currentIndex];
            console.log('--currentlyDisplayedGym--');
            console.log(vm.currentlyDisplayedGym);
            console.log('-------------------------');
        };

        vm.moveLeft = function() {
            if (vm.currentIndex <= 0) {
                vm.currentIndex = vm.memberships.length - 1;
            } else {
                vm.currentIndex--;
            }

            vm.displayGymAtCurrentIndex();
        };

        vm.moveRight = function() {
            if (vm.currentIndex >= vm.memberships.length - 1) {
                vm.currentIndex = 0;
            } else {
                vm.currentIndex++;
            }

            vm.displayGymAtCurrentIndex();
        };

        dashboardService.getGymStatistics().then(function(response) {
            if (response.success) {
                vm.memberships = response.memberships;

                if (vm.memberships.length > 0) {
                    vm.displayGymAtCurrentIndex();
                } else {
                    vm.currentlyDisplayedGym = null;
                }
            } else {
                requestErrorService.handleSessionExpired();
            }
        });
    };

    DashboardController.$inject = ['dashboardService', 'notifierService', 'requestErrorService'];
    angular.module('app').controller('DashboardController', DashboardController);
}());
