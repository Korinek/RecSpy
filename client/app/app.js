(function() {
    'use strict';

    angular.module('app', ['ngResource', 'ngRoute']);
    angular.module('app').config(['$routeProvider', '$locationProvider',
        function($routeProvider, $locationProvider) {
            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });
            $routeProvider
                .when('/', {
                    templateUrl: '/app/main/main.html',
                    controller: 'MainController',
                    controllerAs: 'vm'
                })
                .when('/signup', {
                    templateUrl: 'app/account/signup.html',
                    controller: 'SignupController',
                    controllerAs: 'vm'
                })
                .when('/dashboard', {
                    templateUrl: 'app/dashboard/dashboard.html',
                    controller: 'DashboardController',
                    controllerAs: 'vm'
                })
                .when('/gyms', {
                    templateUrl: 'app/gyms/gyms.html',
                    controller: 'GymsController',
                    controllerAs: 'vm'
                })
                .when('/memberships', {
                    templateUrl: 'app/memberships/memberships.html',
                    controller: 'MembershipsController',
                    controllerAs: 'vm'
                })
                .when('/employment', {
                    templateUrl: 'app/employment/employment.html',
                    controller: 'EmploymentController',
                    controllerAs: 'vm'
                })
                .when('/ownership', {
                    templateUrl: 'app/ownership/ownership.html',
                    controller: 'OwnershipController',
                    controllerAs: 'vm'
                })
                .otherwise({
                    redirectTo: '/'
                });
        }]);
}());
