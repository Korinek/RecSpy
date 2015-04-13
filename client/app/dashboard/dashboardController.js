(function() {
    'use strict';

    var generatePercentages = function() {
        var percentages = [];
        for (var i = 1; i <= 100; i++) {
            percentages.push(i);
        }
        return percentages;
    };

    var getGymFullnessMessage = function(percentage) {
        if (percentage <= 50) {
            return 'Not Busy';
        } else if (percentage <= 70) {
            return 'Somewhat Busy';
        } else if (percentage <= 99) {
            return 'Very Busy';
        } else {
            return 'Full';
        }
    };

    var DashboardController = function(dashboardService, notifierService, requestErrorService, $interval) {
        var vm = this;
        vm.memberships = [];
        vm.percentages = generatePercentages();
        vm.currentPercentage = 0;
        vm.currentIndex = 0;

        var socket = io.connect();

        var updateDisplayedData = function() {
            if (vm.currentlyDisplayedGym) {
                vm.currentPercentage = vm.currentlyDisplayedGym.currentPopulationPercentage;
                vm.fullnessMessage = getGymFullnessMessage(vm.currentPercentage);
                console.log(vm.currentlyDisplayedGym.name + ' percentage changed to ' + vm.currentPercentage);
            }
        };

        $interval(updateDisplayedData, 5000);

        var setupPopulationWatches = function(socket, gyms) {
            gyms.forEach(function(gym) {
                console.log('Setting up socket on: ' + gym.name);
                socket.on(gym.name, function(data) {
                    gym.currentPopulationPercentage = data.currentPopulationPercentage;
                });
            });
        };

        vm.displayGymAtCurrentIndex = function() {
            vm.currentlyDisplayedGym = vm.memberships[vm.currentIndex];
            updateDisplayedData();
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

    DashboardController.$inject = ['dashboardService', 'notifierService', 'requestErrorService', '$interval'];
    angular.module('app').controller('DashboardController', DashboardController);
}());
