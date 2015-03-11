(function() {
    'use strict';

    angular.module('app').factory('User', function($resource) {
        var UserResource = $resource('/api/users/:id', {
            _id: '@id'
        });

        return UserResource;
    });
}());
