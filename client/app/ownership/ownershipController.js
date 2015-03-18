(function() {
    'use strict';

    var OwnershipController = function(ownershipService) {
        var vm = this;
        ownershipService.getOwnedGym().then(function(success, gym) {
            if(success) {
                console.log('getOwnedGym success');
                console.log(gym);
            }
        });
    };

    OwnershipController.$inject = ['ownershipService'];
    angular.module('app').controller('OwnershipController', OwnershipController);
}());
