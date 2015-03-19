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

(function() {
    'use strict';

    angular.module('app').factory('User', ['$resource',
        function($resource) {
            var UserResource = $resource('/api/users/:id', {
                _id: '@id'
            });

            return UserResource;
        }
    ]);
}());

(function() {
    'use strict';

    var authService = function($http, identityService, $q, User) {
        return {
            authenticateUser: function(username, password) {
                var deferred = $q.defer();
                $http.post('/api/login', {
                        username: username,
                        password: password
                    })
                    .then(function(response) {
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

            createUser: function(newUserData) {
                var newUser = new User(newUserData);
                var deferred = $q.defer();

                newUser.$save().then(function() {
                    identityService.currentUser = newUser;
                    deferred.resolve();
                }, function(response) {
                    deferred.reject(response.data.reason);
                });

                return deferred.promise;
            },

            logoutUser: function() {
                var deferred = $q.defer();
                $http.post('/logout', {
                    logout: true
                }).then(function() {
                    identityService.currentUser = undefined;
                    deferred.resolve();
                });
                return deferred.promise;
            }
        };
    };

    angular.module('app')
        .factory('authService', ['$http', 'identityService', '$q', 'User', authService]);
}());

(function() {
    'use strict';

    angular.module('app').factory('identityService', ['User',
        function(User) {
            return {
                currentUser: undefined,
                isAuthenticated: function() {
                    return !!this.currentUser;
                }
            };
        }
    ]);
}());

(function() {
    'use strict';

    var LoginController = function(identityService, notifierService, authService, $location) {
        var vm = this;
        vm.password = '';
        vm.username = '';

        vm.identity = identityService;
        vm.signin = function(username, password) {
            authService.authenticateUser(username, password).then(function(success) {
                if (success) {
                    notifierService.success('You have successfully signed in!');
                } else {
                    notifierService.error('Username/Password combination incorrect');
                }
                vm.password = '';
            });
        };

        vm.signout = function() {
            authService.logoutUser().then(function() {
                vm.username = '';
                vm.password = '';
                notifierService.success('You have successfully signed out!');
                $location.path('/');
            });
        };
    };
    LoginController.$inject = ['identityService', 'notifierService', 'authService', '$location'];
    angular.module('app').controller('LoginController', LoginController);
}());

(function() {
    'use strict';

    angular.module('app').directive('loginDirective', function() {
        return {
            templateUrl: '/app/account/loginTemplate.html',
            controller: 'LoginController',
            controllerAs: 'vm'
        };
    });
}());

(function() {
    'use strict';

    var SignupController = function(User, notifierService, $location, authService) {
        var vm = this;
        vm.signup = function() {
            var newUserData = {
                username: vm.username,
                password: vm.password,
                firstName: vm.firstName,
                lastName: vm.lastName
            };

            authService.createUser(newUserData)
                .then(function() {
                    notifierService.success('User account created!');
                    $location.path('/');
                }, function(reason) {
                    notifierService.error(reason);
                });
        };
    };

    SignupController.$inject = ['User', 'notifierService', '$location', 'authService'];
    angular.module('app').controller('SignupController', SignupController);
}());

(function() {
    'use strict';
    /* jshint ignore:start */
    angular.module('app').value('toastr', toastr);
    /* jshint ignore:end */

    angular.module('app').factory('notifierService', ['toastr',
        function(toastr) {
            return {
                success: function(message) {
                    toastr.success(message);
                },
                error: function(message) {
                    toastr.error(message);
                }
            };
        }
    ]);
}());

(function() {
    'use strict';

    var requestErrorService = function(notifierService, authService, $location) {
        return {
            handleSessionExpired: function() {
                authService.logoutUser().then(function() {
                    notifierService.error('Your session has expired');
                    $location.path('/');
                });
            }
        };
    };

    angular.module('app').factory('requestErrorService',
        ['notifierService', 'authService', '$location', requestErrorService]);
}());

(function() {
    'use strict';

    var DashboardController = function(dashboardService, notifierService, requestErrorService) {
        var vm = this;
        vm.message = '';
        dashboardService.getGymStatistics().then(function(success) {
            if (success) {
                console.log('Successful Get Message');
            } else {
                requestErrorService.handleSessionExpired();
            }
        });
    };

    DashboardController.$inject = ['dashboardService', 'notifierService', 'requestErrorService'];
    angular.module('app').controller('DashboardController', DashboardController);
}());

(function() {
    'use strict';

    var dashboardService = function($http, $q) {
        return {
            getGymStatistics: function() {
                var deferred = $q.defer();
                $http.get('/api/dashboard').then(function(response) {
                    deferred.resolve(true);
                }, function(error) {
                    console.log(error);
                    deferred.resolve(false);
                });
                return deferred.promise;
            }
        };
    };

    angular.module('app').factory('dashboardService', ['$http', '$q', dashboardService]);
}());

(function() {
    'use strict';

    var EmploymentController = function() {
        var vm = this;
    };

    EmploymentController.$inject = [];
    angular.module('app').controller('EmploymentController', EmploymentController);
}());

(function() {
    'use strict';

    var GymsController = function() {
        var vm = this;
    };

    GymsController.$inject = [];
    angular.module('app').controller('GymsController', GymsController);
}());

(function() {
    'use strict';

    var MainController = function() {
        var vm = this;
        vm.myVar = 'Hello From Main Controller';
    };

    MainController.$inject = [];
    angular.module('app').controller('MainController', MainController);
}());

(function() {
    'use strict';

    var MembershipsController = function() {
        var vm = this;
    };

    MembershipsController.$inject = [];
    angular.module('app').controller('MembershipsController', MembershipsController);
}());

(function() {
    'use strict';

    angular.module('app').directive('navbarDirective', ['identityService',
        function(identityService) {
            return {
                restrict: 'E',
                templateUrl: '/app/navbar/navbarTemplate.html',
                scope: {},
                link: function(scope, element) {
                    scope.identity = identityService;
                }
            };
        }
    ]);
}());

(function() {
    'use strict';

    var OwnershipController = function(ownershipService, requestErrorService, notifierService) {
        var vm = this;
        ownershipService.getOwnedGym().then(function(response) {
            if (response.success) {
                vm.gym = response.gym;
            } else {
                requestErrorService.handleSessionExpired();
            }
        });

        vm.createGym = function() {
            ownershipService.createGym(vm.gymName).then(function(response) {
                if (response.success) {
                    vm.gym = response.gym;
                } else {
                    notifierService.error(response.error);
                }
            });
        };
    };

    OwnershipController.$inject = ['ownershipService', 'requestErrorService', 'notifierService'];
    angular.module('app').controller('OwnershipController', OwnershipController);
}());

(function() {
    'use strict';

    var ownershipService = function($http, $q) {
        return {
            getOwnedGym: function() {
                var deferred = $q.defer();
                $http.get('/api/ownership').then(function(response) {
                    console.log('---getOwnedGym---');
                    console.log(response);
                    console.log('-----------------');
                    deferred.resolve({
                        success: true,
                        gym: response.data
                    });
                }, function(error) {
                    console.log(error);
                    deferred.resolve({
                        success: false,
                        error: error.data
                    });
                });
                return deferred.promise;
            },
            createGym: function(gymName) {
                var deferred = $q.defer();
                $http.post('/api/ownership', {
                        gymName: gymName
                    })
                    .then(function(response) {
                        console.log('---createGym---');
                        console.log(response.data);
                        console.log('---------------');

                        deferred.resolve({
                            success: true,
                            gym: response.data
                        });
                    }, function(error) {
                        console.log('---createGym---');
                        console.log(error);
                        console.log('---------------');
                        deferred.resolve({
                            success: false,
                            error: error.data.reason
                        });
                    });

                return deferred.promise;
            }
        };
    };

    angular.module('app').factory('ownershipService', ['$http', '$q', ownershipService]);
}());

angular.module("app").run(["$templateCache", function($templateCache) {$templateCache.put("app/account/loginTemplate.html","<div class=\"nav navbar-nav navbar-right\" ng-hide=vm.identity.isAuthenticated()><li><a href=/signup>Sign Up</a></li></div><div class=navbar-right><form class=navbar-form ng-hide=vm.identity.isAuthenticated()><div class=form-group><input class=form-control placeholder=Username ng-model=vm.username )=\"\"></div><div class=form-group><input class=form-control type=password placeholder=Password ng-model=vm.password></div><button class=\"btn btn-primary\" ng-click=\"vm.signin(vm.username, vm.password)\">Sign In</button></form><ul ng-show=vm.identity.isAuthenticated() class=\"nav navbar-nav navbar-right\"><li class=dropdown><a class=dropdown-toggle href data-toggle=dropdown>{{vm.identity.currentUser.firstName + \" \" + identity.currentUser.lastName}} <b class=caret></b></a><ul class=dropdown-menu><li><a href=/memberships>Memberships</a></li><li><a href=/employment>Employment</a></li><li><a href=/ownership>Ownership</a></li><li><a href ng-click=vm.signout()>Sign Out</a></li></ul></li></ul></div>");
$templateCache.put("app/account/signup.html","<div class=container><div class=\"well foo\"><form name=signupForm class=form-horizontal><fieldset><legend>New User Information</legend><div class=form-group><label for=username class=\"col-md-2 control-label\">Username</label><div class=col-md-10><input name=username type=text placeholder=Username ng-model=vm.username required class=form-control></div></div><div class=form-group><label for=password class=\"col-md-2 control-label\">Password</label><div class=col-md-10><input name=password type=password placeholder=Password ng-model=vm.password required class=form-control></div></div><div class=form-group><label for=firstName class=\"col-md-2 control-label\">First name</label><div class=col-md-10><input name=firstName type=text placeholder=\"First Name\" ng-model=vm.firstName required class=form-control></div></div><div class=form-group><label for=lastName class=\"col-md-2 control-label\">Last Name</label><div class=col-md-10><input name=lastName type=lastName placeholder=\"Last Name\" ng-model=vm.lastName required class=form-control></div></div><div class=form-group><div class=\"col-md-10 col-md-offset-2\"><div class=pull-right><button ng-click=vm.signup() ng-disabled=signupForm.$invalid class=\"btn btn-primary\">Submit</button> &nbsp;<a href=\"/\" class=\"btn btn-default\">Cancel</a></div></div></div></fieldset></form></div></div>");
$templateCache.put("app/dashboard/dashboard.html","<div>Hello From Dashboard Controller</div>");
$templateCache.put("app/employment/employment.html","<div>Hello From Employment Controller</div>");
$templateCache.put("app/gyms/gyms.html","<div>Hello From Gyms Controller</div>");
$templateCache.put("app/main/main.html","<h1>Now Displaying The Main Controller</h1><h2>{{ vm.myVar}}</h2>");
$templateCache.put("app/memberships/memberships.html","<div>Hello From Memberships Controller</div>");
$templateCache.put("app/ownership/ownership.html","<div ng-show=!vm.gym class=container>You do not currently own a gym.<div class=well><form name=createGymForm class=form-horizontal><legend>New Gym Information</legend><div class=form-group><label for=gymName class=\"col-md-2 control-label\">Gym Name</label><div class=col-md-10><input name=gymName type=text placeholder=\"Gym Name\" ng-model=vm.gymName required class=form-control></div></div><div class=form-group><div class=\"col-md-10 col-md-offset-2\"><div class=pull-right><button ng-click=vm.createGym() ng-disabled=createGymForm.$invalid class=\"btn btn-primary\">Create</button> &nbsp;<a href=\"/\" class=\"btn btn-default\">Cancel</a></div></div></div></form></div></div><div ng-show=vm.gym class=container>You currently own a gym: {{vm.gym}}</div>");
$templateCache.put("app/navbar/navbarTemplate.html","<div class=\"navbar navbar-inverse navbar-fixed-top\"><div class=container><div class=navbar-header><a class=navbar-brand href=\"/\">RecSpy</a></div><div class=\"navbar-collapse collapse\"><ul class=\"nav navbar-nav navbar-left\"><li><a href=\"/\">Home</a></li><li ng-show=identity.isAuthenticated()><a href=/dashboard>Dashboard</a></li><li><a href=/gyms>Gyms</a></li></ul><login-directive></login-directive></div></div></div>");}]);