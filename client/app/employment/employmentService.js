(function() {
    'use strict';

    var resolveSuccess = function(deferred) {
        deferred.resolve({
            success: true
        });
    };

    var resolveError = function(deferred, error) {
        deferred.resolve({
            success: false,
            error: error.data.reason
        });
    };

    var employmentService = function($http, $q, membershipService) {
        return {
            acceptMembership: function(pendingMember, gym) {
                var deferred = $q.defer();
                $http.post('/api/acceptMembership', {
                    pendingMember: pendingMember,
                    gym: gym
                }).then(function(response) {
                    resolveSuccess(deferred);
                }, function(error) {
                    resolveError(deferred, error);
                });

                return deferred.promise;
            },
            deleteMembership: function(member, gym) {
                return membershipService.deleteMembership(member, gym);
            },
            searchEmployment: function() {
                var deferred = $q.defer();
                $http.get('/api/employment').then(function(response) {
                    deferred.resolve({
                        success: true,
                        employment: response.data.employment,
                        pendingEmployments: response.data.pendingEmployments,
                        possibleEmployments: response.data.possibleEmployments
                    });
                }, function(error) {
                    resolveError(deferred, error);
                });
                return deferred.promise;
            },
            requestEmployment: function(gym) {
                var deferred = $q.defer();
                $http.post('/api/requestEmployment', {
                    gym: gym
                }).then(function(response) {
                    resolveSuccess(deferred);
                }, function(error) {
                    resolveError(deferred, error);
                });
                return deferred.promise;
            },
            deleteEmployment: function(employee, gym) {
                var deferred = $q.defer();
                $http.post('/api/deleteEmployment', {
                    employee: employee,
                    gym: gym
                }).then(function(response) {
                    resolveSuccess(deferred);
                }, function(error) {
                    resolveError(deferred, error);
                });
                return deferred.promise;
            },
            checkInMember: function(gym, member) {
                var deferred = $q.defer();
                $http.post('api/checkInMember', {
                    gym: gym,
                    member: member
                }).then(function(response) {
                    resolveSuccess(deferred);
                }, function(error) {
                    resolveError(deferred, error);
                });
                return deferred.promise;
            },
            checkOutMember: function(gym, member) {
                var deferred = $q.defer();
                $http.post('api/checkOutMember', {
                    gym: gym,
                    member: member
                }).then(function(response) {
                    resolveSuccess(deferred);
                }, function(error) {
                    resolveError(deferred, error);
                });
                return deferred.promise;
            }
        };
    };

    angular.module('app')
        .factory('employmentService', ['$http', '$q', 'membershipService', employmentService]);
}());
