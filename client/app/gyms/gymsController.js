(function() {
    'use strict';

    var GymsController = function(gymService) {
        var vm = this;
        gymService.search().then(function(response) {
            if (response.success) {
                vm.gyms = response.gyms;
            } else {
                console.log(response.error);
            }
        });
    };

    GymsController.$inject = ['gymService'];
    angular.module('app').controller('GymsController', GymsController);
}());
