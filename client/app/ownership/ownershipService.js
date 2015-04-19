(function() {
    'use strict';

    var ownershipService = function($http, $q, employmentService) {
        return {
            getOwnedGym: function() {
                var deferred = $q.defer();
                $http.get('/api/ownership').then(function(response) {
                    console.log(response);
                    deferred.resolve({
                        success: true,
                        gym: response.data
                    });
                }, function(error) {
                    console.log(error);
                    deferred.resolve({
                        success: false,
                        error: error.data
                    });
                });
                return deferred.promise;
            },
            createGym: function(gymName, gymMaxCapacity, gymOpenTime, gymCloseTime) {
                var deferred = $q.defer();
                $http.post('/api/ownership', {
                        gymName: gymName,
                        maxCapacity: gymMaxCapacity,
                        openTime: gymOpenTime,
                        closeTime: gymCloseTime
                    })
                    .then(function(response) {
                        deferred.resolve({
                            success: true,
                            gym: response.data
                        });
                    }, function(error) {
                        deferred.resolve({
                            success: false,
                            error: error.data.reason
                        });
                    });

                return deferred.promise;
            },
            acceptEmployment: function(pendingEmployee, gym) {
                var deferred = $q.defer();
                console.log('--sending acceptEmployment request--');
                $http.post('/api/acceptEmployment', {
                    pendingEmployee: pendingEmployee,
                    gym: gym
                }).then(function(response) {
                    console.log(response);
                    deferred.resolve({
                        success: true
                    });
                }, function(error) {
                    deferred.resolve({
                        success: false,
                        error: error.data.reason
                    });
                });

                return deferred.promise;
            },
            deleteEmployment: function(employee, gym) {
                return employmentService.deleteEmployment(employee, gym);
            },
            acceptMembership: function(pendingMember, gym) {
                return employmentService.acceptMembership(pendingMember, gym);
            },
            deleteMembership: function(member, gym) {
                return employmentService.deleteMembership(member, gym);
            }
        };
    };

    angular.module('app')
        .factory('ownershipService', ['$http', '$q', 'employmentService', ownershipService]);
}());
