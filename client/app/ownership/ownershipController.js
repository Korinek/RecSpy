(function() {
    'use strict';

    var OwnershipController = function(ownershipService, requestErrorService, notifierService) {
        var vm = this;
        ownershipService.getOwnedGym().then(function(response) {
            if (response.success) {
                vm.gym = response.gym;
            } else {
                requestErrorService.handleSessionExpired();
            }
        });

        vm.createGym = function() {
            ownershipService.createGym(vm.gymName).then(function(response) {
                if (response.success) {
                    vm.gym = response.gym;
                } else {
                    notifierService.error(response.error);
                }
            });
        };
    };

    OwnershipController.$inject = ['ownershipService', 'requestErrorService', 'notifierService'];
    angular.module('app').controller('OwnershipController', OwnershipController);
}());
