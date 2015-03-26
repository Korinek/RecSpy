(function() {
    'use strict';

    var employmentService = function($http, $q, membershipService) {
        return {
            acceptMembership: function(pendingMember, gym) {
                var deferred = $q.defer();
                $http.post('/api/acceptMembership', {
                    pendingMember: pendingMember,
                    gym: gym
                }).then(function(response) {
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
            deleteMembership: function(member, gym) {
                return membershipService.deleteMembership(member, gym);
            },
            searchEmployment: function() {
                var deferred = $q.defer();
                $http.get('/api/employment').then(function(response) {
                    console.log('--searchEmployment--');
                    console.log(response);
                    console.log('--------------------');
                    deferred.resolve({
                        success: true,
                        employment: response.data.employment,
                        pendingEmployments: response.data.pendingEmployments,
                        possibleEmployments: response.data.possibleEmployments
                    });
                }, function(error) {
                    deferred.resolve({
                        success: false,
                        error: error.data.reason
                    });
                });
                return deferred.promise;
            },
            requestEmployment: function(gym) {
                var deferred = $q.defer();
                $http.post('/api/requestEmployment', {
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
                var deferred = $q.defer();
                $http.post('/api/deleteEmployment', {
                    employee: employee,
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
            }
        };
    };

    angular.module('app')
        .factory('employmentService', ['$http', '$q', 'membershipService', employmentService]);
}());
