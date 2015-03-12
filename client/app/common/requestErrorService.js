(function() {
    'use strict';

    var requestErrorService = function(notifierService, identityService, $location) {
        return {
            handleSessionExpired: function() {
                notifierService.error('Your session has expired');
                identityService.reset();
                $location.path('/');
            }
        };
    };

    angular.module('app').factory('requestErrorService',
        ['notifierService', 'identityService', '$location', requestErrorService]);
}());
