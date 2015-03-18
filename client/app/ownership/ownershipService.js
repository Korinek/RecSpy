(function() {
    'use strict';

    var ownershipService = function($http, $q) {
        return {
            getOwnedGym: function() {
                var deferred = $q.defer();
                $http.get('/api/ownership').then(function(response) {
                    deferred.resolve(true, response.data);
                }, function(error) {
                    console.log(error);
                    deferred.resolve(false);
                });
                return deferred.promise;
            }
        };
    };

    angular.module('app').factory('ownershipService', ['$http', '$q', ownershipService]);
}());
