(function() {
    'use strict';

    var getHoursMinutes = function(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var amPm = 'AM';
        if (hours > 12) {
            hours = hours - 12;
            amPm = 'PM';
        }

        if (minutes < 10) {
            return hours + ':0' + minutes + ' ' + amPm;
        }

        return hours + ':' + minutes + ' ' + amPm;
    };

    var generatePercentages = function() {
        var percentages = [];
        for (var i = 1; i <= 100; i++) {
            percentages.push(i);
        }

        return percentages;
    };

    var convertTimeToDouble = function(time) {
        return time.getHours() + time.getMinutes() / 100;
    };

    var getGymFullnessMessage = function(percentage, gym) {
        var open = convertTimeToDouble(gym.openTime);
        var close = convertTimeToDouble(gym.closeTime);
        var now = convertTimeToDouble(new Date(Date.now()));
        if (now < open || now > close) {
            return 'Closed';
        }

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
                vm.fullnessMessage = getGymFullnessMessage(vm.currentPercentage, vm.currentlyDisplayedGym);
                console.log(vm.currentlyDisplayedGym.name + ' percentage changed to ' + vm.currentPercentage);
            }
        };

        var updateBestGymTimes = function() {
            dashboardService.getBestGymTimes().then(function(response) {
                if (response.success) {
                    response.bestGymTimes.forEach(function(bestGymTime) {
                        vm.memberships.forEach(function(gym) {
                            if (gym._id === bestGymTime.gymId) {
                                gym.bestTime = getHoursMinutes(new Date(bestGymTime.bestGymTime));
                            }
                        });
                    });
                }
            });
        };

        $interval(updateDisplayedData, 5000);
        $interval(updateBestGymTimes, 5 * 60 * 1000); //5 minutes

        var setupPopulationWatches = function(socket, gyms) {
            gyms.forEach(function(gym) {
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
                vm.memberships.forEach(function(gym) {
                    gym.bestTime = 'Unknown';
                    gym.openTime = new Date(gym.openTime);
                    gym.closeTime = new Date(gym.closeTime);
                });
                updateBestGymTimes();
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
