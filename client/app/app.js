(function () {
    'use strict';

    angular.module('app', ['ngResource', 'ngRoute']);
    angular.module('app').config(function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode({enabled: true, requireBase: false});
        $routeProvider
            .when('/',
            {
                templateUrl: '/app/main/main.html',
                controller: 'mainController',
                controllerAs: 'vm'
            })
            .otherwise({redirectTo: '/'});
    });
}());