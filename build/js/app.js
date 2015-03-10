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

    angular.module('app').factory('User', function ($resource) {
        var UserResource = $resource('/api/users/:id', {_id: "@id"}, {
            update: {method: 'PUT', isArray:false}
        });

        return UserResource;
    });
}());

(function () {
    'use strict';

    angular.module('app').factory('authService', function ($http, identityService, $q, User) {
        return {
            authenticateUser: function (username, password) {
                var deferred = $q.defer();
                $http.post('/login', {username:username, password:password})
                     .then(function (response) {
                         if (response.data.success) {
                             var user = new User();
                             angular.extend(user, response.data.user);
                             identityService.currentUser = user;
                             deferred.resolve(true);
                         } else {
                             deferred.resolve(false);
                         }
                      });

                return deferred.promise;
            },

            createUser: function (newUserData) {
                var newUser = new User(newUserData);
                var deferred = $q.defer();

                newUser.$save().then(function () {
                    identityService.currentUser = newUser;
                    deferred.resolve();
                }, function (response) {
                    deferred.reject(response.data.reason);
                });

                return deferred.promise;
            },

            logoutUser: function () {
                var deferred = $q.defer();
                $http.post('/logout', {logout:true})
                     .then(function () {
                        identityService.currentUser = undefined;
                        deferred.resolve();
                     });
            }
        };
    });
}());

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

(function () {
    'use strict';

    angular.module('app').controller('loginController', function (identityService,
        notifierService, authService, $location) {
        var vm = this;
        vm.identity = identityService;
        vm.signin = function (username, password) {
            authService.authenticateUser(username, password).then(function (success) {
                if (success) {
                    notifierService.success('You have successfully signed in!');
                } else {
                    notifierService.failure('Username/Password combination incorrect');
                }
                vm.username = "";
            });
        };

        vm.signout = function () {
            authService.logoutUser().then(function () {
                vm.username = "";
                vm.password = "";
                notifierService.success('You have successfully signed out!');
                $location.path('/');
            });
        };
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
    angular.module('app').controller('signupController',
        function (User, notifierService, $location, authService) {
            var vm = this;
            vm.signup = funciton () {
                var newUserData = {
                    username: vm.email,
                    password: vm.password,
                    firstName: vm.firstName,
                    lastName: vm.lastName
                };

                authService.createUser(newUserData)
                    .then(function () {
                        notifierService.success('User account created!');
                        $location.path('/');
                    }, function (reason) {
                        notifierService.error(reason);
                    }); 
        });
}());

(function () {
    'use strict';

    angular.module('app').value('toastr', toastr);

    angular.module('app').factory('notifierService', function (toastr) {
        return {
            success: function (message) {
                toastr.success(message);
            },
            failure: function (message) {
                toastr.error(message);
            }
        };
    });
}());

(function () {
    'use strict';

    angular.module('app').controller('mainController', function () {
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

angular.module("app").run(["$templateCache", function($templateCache) {$templateCache.put("app/account/loginTemplate.html","<div class=navbar-right><form class=navbar-form ng-hide=vm.identity.isAuthenticated()><ul class=\"nav navbar-nav\"><li><a href=/signup>Sign Up</a></li></ul><div class=form-group><input class=form-control placeholder=Email ng-model=vm.username )=\"\"></div><div class=form-group><input class=form-control type=password placeholder=Password ng-model=vm.password></div><button class=\"btn btn-primary\" ng-click=\"vm.signin(username, password)\">Sign In</button></form><ul ng-show=vm.identity.isAuthenticated() class=\"nav navbar-nav navbar-right\"><li class=dropdown><a class=dropdown-toggle href data-toggle=dropdown>{{vm.identity.currentUser.firstName + \" \" + identity.currentUser.lastName}} <b class=caret></b></a><ul><li><a href ng-click=vm.signout()>Sign Out</a></li></ul></li></ul></div>");
$templateCache.put("app/account/signup.html","");
$templateCache.put("app/main/main.html","<h1>Now Displaying The Main Controller</h1><h2>{{ vm.myVar}}</h2>");
$templateCache.put("app/navbar/navbarTemplate.html","<div class=\"navbar navbar-inverse navbar-fixed-top\"><div class=container><div class=navbar-header><a class=navbar-brand href=\"/\">RecSpy</a></div><div class=\"navbar-collapse collapse\"><ul class=\"nav navbar-nav\"><li><a href=\"/\">Home</a></li></ul><login-directive></login-directive></div></div></div>");}]);