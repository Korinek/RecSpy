(function() {
    'use strict';

    function remove(collection, item) {
        var index = collection.indexOf(item);
        if (index >= 0) {
            collection.splice(index, 1);
        }
    }

    var OwnershipController = function(ownershipService, requestErrorService, notifierService) {
        var vm = this;
        vm.openTime = new Date();
        vm.closeTime = new Date();

        ownershipService.getOwnedGym().then(function(response) {
            if (response.success) {
                vm.gym = response.gym;
            } else {
                requestErrorService.handleSessionExpired();
            }
        });

        vm.createGym = function() {
            ownershipService.createGym(vm.gymName, vm.gymMaxCapacity, vm.gymOpenTime, vm.gymCloseTime)
                .then(function(response) {
                    if (response.success) {
                        vm.gym = response.gym;
                    } else {
                        notifierService.error(response.error);
                    }
                });
        };

        vm.deleteMembership = function(member) {
            ownershipService.deleteMembership(member, vm.gym).then(function(response) {
                if (response.success) {
                    remove(vm.gym.members, member);
                    remove(vm.gym.pendingMembers, member);
                } else {
                    console.log(response.error);
                }
            });
        };

        vm.acceptMembership = function(pendingMember) {
            ownershipService.acceptMembership(pendingMember, vm.gym).then(function(response) {
                if (response.success) {
                    remove(vm.gym.pendingMembers, pendingMember);
                    vm.gym.members.push(pendingMember);
                } else {
                    console.log(response.error);
                }
            });
        };

        vm.deleteEmployment = function(employee) {
            ownershipService.deleteEmployment(employee, vm.gym).then(function(response) {
                if (response.success) {
                    remove(vm.gym.employees, employee);
                    remove(vm.gym.pendingEmployees, employee);
                } else {
                    console.log(response.error);
                }
            });
        };

        vm.acceptEmployment = function(pendingEmployee) {
            ownershipService.acceptEmployment(pendingEmployee, vm.gym).then(function(response) {
                if (response.success) {
                    remove(vm.gym.pendingEmployees, pendingEmployee);
                    vm.gym.employees.push(pendingEmployee);
                } else {
                    console.log(response.error);
                }
            });
        };
    };

    OwnershipController.$inject = ['ownershipService', 'requestErrorService', 'notifierService'];
    angular.module('app').controller('OwnershipController', OwnershipController);
}());
