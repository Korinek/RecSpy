(function() {
    'use strict';

    var gymService = function($http, $q) {
        return {
            search: function() {
                var deferred = $q.defer();
                $http.get('/api/gyms').then(function(response) {
                    deferred.resolve({
                        success: true,
                        gyms: response.data
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

    angular.module('app').factory('gymService', ['$http', '$q', gymService]);
}());
