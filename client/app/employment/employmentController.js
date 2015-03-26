(function() {
    'use strict';

    var remove = function(collection, item) {
        var index = collection.indexOf(item);
        if (index >= 0) {
            collection.splice(index, 1);
        }
    };

    var EmploymentController = function(employmentService, identityService) {
        var vm = this;

        employmentService.searchEmployment().then(function(response) {
            if (response.success) {
                console.log(response);
                vm.employment = response.employment;
                vm.pendingEmployments = response.pendingEmployments;
                vm.possibleEmployments = response.possibleEmployments;
            } else {
                console.log(response.error);
            }
        });

        vm.requestEmployment = function(gym) {
            console.log('requesting employment with ');
            console.log(gym);
            employmentService.requestEmployment(gym).then(function(response) {
                if (response.success) {
                    remove(vm.possibleEmployments, gym);
                    vm.pendingEmployments.push(gym);
                } else {
                    console.log(response.error);
                }
            });
        };

        vm.deleteEmployment = function(gym) {
            employmentService.deleteEmployment(identityService.currentUser, gym)
                .then(function(response) {
                    if (response.success) {
                        vm.employment = null;
                        remove(vm.pendingEmployments, gym);
                        vm.possibleEmployments.push(gym);
                    } else {
                        console.log(response.error);
                    }
                });
        };
    };

    EmploymentController.$inject = ['employmentService', 'identityService'];
    angular.module('app').controller('EmploymentController', EmploymentController);
}());
