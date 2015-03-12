(function() {
    'use strict';

    var requestErrorService = function(notifierService, authService, $location) {
        return {
            handleSessionExpired: function() {
                authService.logoutUser().then(function() {
                    notifierService.error('Your session has expired');
                    $location.path('/');
                });
            }
        };
    };

    angular.module('app').factory('requestErrorService',
        ['notifierService', 'authService', '$location', requestErrorService]);
}());
