(function() {
    'use strict';

    var dashboardService = function($http, $q) {
        return {
            getGymStatistics: function() {
                var deferred = $q.defer();
                $http.get('/api/dashboard').then(function(response) {
                    deferred.resolve(true);
                }, function(error) {
                    console.log(error);
                    deferred.resolve(false);
                });
                return deferred.promise;
            }
        };
    };

    angular.module('app').factory('dashboardService', ['$http', '$q', dashboardService]);
}());
