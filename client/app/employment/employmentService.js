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
                    console.log('--acceptMembership = success--');
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
            deleteMembership: function(member, gym) {
                return membershipService.deleteMembership(member, gym);
            }
        };
    };

    angular.module('app')
        .factory('employmentService', ['$http', '$q', 'membershipService', employmentService]);
}());
