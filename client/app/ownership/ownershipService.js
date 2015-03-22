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
            createGym: function(gymName) {
                var deferred = $q.defer();
                $http.post('/api/ownership', {
                        gymName: gymName
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
                $http.post('/api/acceptEmployment', {
                    pendingEmployee: pendingEmployee,
                    gym: gym
                }, function(response) {
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
                var deferred = $q.defer();
                $http.post('/api/deleteEmployment', {
                    employee: employee,
                    gym: gym
                }, function(response) {
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
