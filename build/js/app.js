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

    angular.module('app').controller('loginController', function () {
        console.log('Creating LoginController');
        var vm = this;
    });
}());

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

(function () {
    'use strict';

    angular.module('app').controller('mainController', function () {
        console.log('Creating MainController');
        var vm = this;
        vm.myVar = 'Hello from main controller';
    });
}());

(function () {
    'use strict';

    angular.module('app').directive('navbarDirective', function () {
        return {
            templateUrl: '/app/navbar/navbarTemplate.html'
        };
    });
}());

angular.module("app").run(["$templateCache", function($templateCache) {$templateCache.put("app/account/loginTemplate.html","<div class=navbar-right ng-controller=loginController><form class=navbar-form><div class=form-group><input class=form-control placeholder=Email ng-model=username )=\"\"></div><div class=form-group><input class=form-control type=password placeholder=Password ng-model=password></div><button class=\"btn btn-primary\" ng-click=\"signin(username, password)\">Sign In</button></form></div>");
$templateCache.put("app/main/main.html","<h1>Now Displaying The Main Controller</h1><h2>{{ vm.myVar}}</h2>");
$templateCache.put("app/navbar/navbarTemplate.html","<div class=\"navbar navbar-inverse navbar-fixed-top\"><div class=container><div class=navbar-header><a class=navbar-brand href=\"/\">RecSpy</a></div><div class=\"navbar-collapse collapse\"><ul class=\"nav navbar-nav\"><li><a href=\"/\">Home</a></li></ul><login-directive></login-directive></div></div></div>");}]);