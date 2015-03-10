(function () {
    'use strict';

    angular.module('app').factory('identityService', function (User) {
        return {
            currentUser: undefined,
            isAuthenticated: function () {
                return !!this.currentUser;
            }
        };
    });
}());
