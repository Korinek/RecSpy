(function() {
    'use strict';

    var gymService = function($http, $q) {
        return {
            search: function() {
                var deferred = $q.defer();
                $http.get('/api/gyms').then(function(response) {
                    console.log('--search--');
                    console.log(response);
                    console.log('----------');
                    deferred.resolve({
                        success: true,
                        gyms: response.data
                    });

                }, function(error) {
                    console.log('--search--');
                    console.log(error);
                    console.log('----------');
                    deferred.resolve({
                        success: false,
                        error: error.data
                    });
                });
                return deferred.promise;
            }
        };
    };

    angular.module('app').factory('gymService', ['$http', '$q', gymService]);
}());
