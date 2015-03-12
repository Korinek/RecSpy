(function() {
    'use strict';

    angular.module('app', ['ngResource', 'ngRoute']);
    angular.module('app').config(function($routeProvider, $locationProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
        $routeProvider
            .when('/', {
                templateUrl: '/app/main/main.html',
                controller: 'mainController',
                controllerAs: 'vm'
            })
            .when('/signup', {
                templateUrl: 'app/account/signup.html',
                controller: 'signupController',
                controllerAs: 'vm'
            })
            .when('/dashboard', {
                templateUrl: 'app/dashboard/dashboard.html',
                controller: 'dashboardController',
                controllerAs: 'vm'
            })
            .when('/gyms', {
                templateUrl: 'app/gyms/gyms.html',
                controller: 'gymsController',
                controllerAs: 'vm'
            })
            .when('/memberships', {
                templateUrl: 'app/memberships/memberships.html',
                controller: 'membershipsController',
                controllerAs: 'vm'
            })
            .when('/employment', {
                templateUrl: 'app/employment/employment.html',
                controller: 'employmentController',
                controllerAs: 'vm'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
}());
