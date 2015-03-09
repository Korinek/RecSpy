(function () {
    'use strict';

    angular.module('app').directive('loginDirective', function () {
        return {
            templateUrl: '/app/account/loginTemplate.html',
            controller: 'loginController',
            controllerAs: 'vm'
        };
    });
}());
