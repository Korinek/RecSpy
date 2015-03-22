(function() {
    'use strict';

    var GymsController = function(gymService, identityService, membershipService) {
        var vm = this;

        vm.requestMembership = function(gym) {
            membershipService.requestMembership(gym).then(function(response) {
                if (response.success) {
                    gym.isCurrentUserPendingMember = true;
                } else {
                    console.log(response.error);
                }
            });
        };

        vm.deleteMembership = function(gym) {
            membershipService.deleteMembership(gym).then(function(response) {
                if (response.success) {
                    console.log('delete success!');
                    gym.isCurrentUserMember = false;
                    gym.isCurrentUserPendingMember = false;
                } else {
                    console.log(response.error);
                }
            });
        };

        gymService.search().then(function(response) {
            if (response.success) {
                vm.gyms = response.gyms;
            } else {
                console.log(response.error);
            }
        });
    };

    GymsController.$inject = ['gymService', 'identityService', 'membershipService'];
    angular.module('app').controller('GymsController', GymsController);
}());
