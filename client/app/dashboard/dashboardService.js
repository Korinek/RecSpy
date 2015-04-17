(function() {
    'use strict';

    var dashboardService = function($http, $q) {
        return {
            getGymStatistics: function() {
                var deferred = $q.defer();
                $http.get('/api/dashboard').then(function(response) {
                    console.log(response);
                    deferred.resolve({
                        success: true,
                        memberships: response.data.memberships
                    });
                }, function(error) {
                    console.log(error);
                    deferred.resolve({
                        success: false,
                        error: error.data.reason
                    });
                });
                return deferred.promise;
            },
            getBestGymTimes: function() {
                var deferred = $q.defer();
                $http.get('/api/getBestGymTimes').then(function(response) {
                    deferred.resolve({
                        success: true,
                        bestGymTimes: response.data.bestGymTimes
                    });
                }, function(error) {
                    console.log(error);
                    deferred.resolve({
                        success: false,
                        error: error.data.reason
                    });
                });

                return deferred.promise;
            }
        };
    };

    angular.module('app').factory('dashboardService', ['$http', '$q', dashboardService]);
}());
