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
(function () {
    'use strict';

    angular.module('app').controller('mainController', function () {
        var vm = this;
        vm.myVar = 'Hello from main controller';
    });
}());
angular.module("app").run(["$templateCache", function($templateCache) {$templateCache.put("app/main/main.html","<h1>Now Displaying The Main Controller</h1>\n<h2> {{ vm.myVar}} </h2>");}]);