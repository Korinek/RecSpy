(function () {
    'use strict';

    angular.module('app').directive('navbarDirective', function (identityService) {
        return {
            restrict: 'E',
            templateUrl: '/app/navbar/navbarTemplate.html',
            scope: {},
            link: function(scope, element) {
                scope.identity = identityService;
            }
        };
    });
}());
