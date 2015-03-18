(function() {
    'use strict';

    var OwnershipController = function(ownershipService) {
        var vm = this;
        ownershipService.getOwnedGym(function(gym) {
            console.log('success');
            console.log(gym);
        }, function(error) {});
    };

    OwnershipController.$inject = ['ownershipService'];
    angular.module('app').controller('OwnershipController', OwnershipController);
}());
