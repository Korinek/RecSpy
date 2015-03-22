(function() {
    'use strict';

    var membershipService = function($http, $q) {
        return {
            requestMembership: function(gym) {
                var deferred = $q.defer();
                $http.post('/api/requestMembership', {
                    gym: gym
                }).then(function(response) {
                    console.log('--requestMembership--');
                    console.log(response);
                    console.log('---------------------');
                    deferred.resolve({
                        success: true
                    });
                }, function(error) {
                    console.log('--requestMembership--');
                    console.log(error);
                    console.log('---------------------');
                    deferred.resolve({
                        success: false,
                        error: error.data
                    });
                });
                return deferred.promise;
            },
            deleteMembership: function(gym) {
                var deferred = $q.defer();
                $http.post('/api/deleteMembership', {
                    gym: gym
                }).then(function(response) {
                    console.log('--deleteMembership--');
                    console.log(response);
                    console.log('--------------------');
                    deferred.resolve({
                        success: true
                    });
                }, function(error) {
                    console.log('--deleteMembership--');
                    console.log(error);
                    console.log('-------------------');
                    deferred.resolve({
                        success: false
                    });
                });
                return deferred.promise;
            }
        };
    };

    angular.module('app').factory('membershipService', ['$http', '$q', membershipService]);
}());
