(function() {
    'use strict';

    var membershipService = function($http, $q) {
        return {
            requestMembership: function(gym) {
                var deferred = $q.defer();
                $http.post('/api/requestMembership', {
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
                var deferred = $q.defer();
                $http.post('/api/deleteMembership', {
                    member: member,
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
            }
        };
    };

    angular.module('app').factory('membershipService', ['$http', '$q', membershipService]);
}());
