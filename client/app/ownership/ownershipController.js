(function() {
    'use strict';

    var OwnershipController = function(ownershipService, requestErrorService) {
        var vm = this;
        ownershipService.getOwnedGym().then(function(success, gym) {
            if (success) {
                console.log(gym);
                vm.gym = gym;
            } else {
                requestErrorService.handleSessionExpired();
            }
        });
    };

    OwnershipController.$inject = ['ownershipService', 'requestErrorService'];
    angular.module('app').controller('OwnershipController', OwnershipController);
}());
