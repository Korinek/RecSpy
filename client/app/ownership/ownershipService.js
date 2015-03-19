(function() {
    'use strict';

    var ownershipService = function($http, $q) {
        return {
            getOwnedGym: function() {
                var deferred = $q.defer();
                $http.get('/api/ownership').then(function(response) {
                    console.log('---getOwnedGym---');
                    console.log(response);
                    console.log('-----------------');
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
                        console.log('---createGym---');
                        console.log(response.data);
                        console.log('---------------');

                        deferred.resolve({
                            success: true,
                            gym: response.data
                        });
                    }, function(error) {
                        console.log('---createGym---');
                        console.log(error);
                        console.log('---------------');
                        deferred.resolve({
                            success: false,
                            error: error.data.reason
                        });
                    });

                return deferred.promise;
            }
        };
    };

    angular.module('app').factory('ownershipService', ['$http', '$q', ownershipService]);
}());
