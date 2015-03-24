(function() {
    'use strict';

    var remove = function(collection, item) {
        var index = collection.indexOf(item);
        if (index >= 0) {
            collection.splice(index, 1);
        }
    };

    var MembershipsController = function(identityService, membershipService) {
        var vm = this;

        vm.deleteMembership = function(gym) {
            membershipService.deleteMembership(identityService.currentUser, gym).then(function(response) {
                if (response.success) {
                    remove(vm.pendingMemberships, gym);
                    remove(vm.currentMemberships, gym);
                } else {
                    console.log(response.error);
                }
            });
        };

        membershipService.searchMemberships().then(function(response) {
            if (response.success) {
                vm.pendingMemberships = response.pendingMemberships;
                vm.currentMemberships = response.currentMemberships;
            } else {
                console.log(response.error);
            }
        });

    };

    MembershipsController.$inject = ['identityService', 'membershipService'];
    angular.module('app').controller('MembershipsController', MembershipsController);
}());
