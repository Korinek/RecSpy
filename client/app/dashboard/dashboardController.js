(function() {
    'use strict';

    var generatePercentages = function() {
        var percentages = [];
        for (var i = 1; i <= 100; i++) {
            percentages.push(i);
        }
        return percentages;
    };

    var setupPopulationWatches = function(socket, gyms) {
        gyms.forEach(function(gym) {
            console.log('Setting up socket on: ' + gym.name);
            socket.on(gym.name, function(data) {
                console.log(gym.name + ' pop percent changed to ' + data.currentPopulationPercentage);
                gym.currentPopulationPercentage = data.currentPopulationPercentage;
            });
        });
    };

    var DashboardController = function(dashboardService, notifierService, requestErrorService) {
        var vm = this;
        vm.memberships = [];
        vm.percentages = generatePercentages();
        vm.currentPercentage = 0;
        vm.currentIndex = 0;

        var socket = io.connect('http://localhost:3030');

        vm.displayGymAtCurrentIndex = function() {
            vm.currentlyDisplayedGym = vm.memberships[vm.currentIndex];
            vm.currentPercentage = vm.currentlyDisplayedGym.currentPopulationPercentage;
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
                console.log(vm.memberships);
                setupPopulationWatches(socket, vm.memberships);

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
