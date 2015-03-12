(function() {
    'use strict';

    angular.module('app').factory('identityService', ['User',
        function(User) {
            return {
                currentUser: undefined,
                isAuthenticated: function() {
                    return !!this.currentUser;
                },
                reset: function() {
                    this.currentUser = undefined;
                }
            };
        }
    ]);
}());
