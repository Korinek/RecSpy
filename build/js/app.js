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

    var generatePercentages = function() {
        var percentages = [];
        for (var i = 1; i <= 100; i++) {
            percentages.push(i);
        }
        return percentages;
    };

    var setupPopulationWatches = function(socket, gyms) {
        gyms.forEach(function(gym) {
            console.log('Setting up socket on: ' + gym.name);
            socket.on(gym.name, function(data) {
                console.log(gym.name + ' pop percent changed to ' + data.currentPopulationPercentage);
                gym.currentPopulationPercentage = data.currentPopulationPercentage;
            });
        });
    };

    var DashboardController = function(dashboardService, notifierService, requestErrorService) {
        var vm = this;
        vm.memberships = [];
        vm.percentages = generatePercentages();
        vm.currentPercentage = 0;
        vm.currentIndex = 0;

        var socket = io.connect('http://localhost:3030');

        vm.displayGymAtCurrentIndex = function() {
            vm.currentlyDisplayedGym = vm.memberships[vm.currentIndex];
            vm.currentPercentage = vm.currentlyDisplayedGym.currentPopulationPercentage;
            console.log('--currentlyDisplayedGym--');
            console.log(vm.currentlyDisplayedGym);
            console.log('-------------------------');
        };

        vm.moveLeft = function() {
            if (vm.currentIndex <= 0) {
                vm.currentIndex = vm.memberships.length - 1;
            } else {
                vm.currentIndex--;
            }

            vm.displayGymAtCurrentIndex();
        };

        vm.moveRight = function() {
            if (vm.currentIndex >= vm.memberships.length - 1) {
                vm.currentIndex = 0;
            } else {
                vm.currentIndex++;
            }

            vm.displayGymAtCurrentIndex();
        };

        dashboardService.getGymStatistics().then(function(response) {
            if (response.success) {
                vm.memberships = response.memberships;
                console.log(vm.memberships);
                setupPopulationWatches(socket, vm.memberships);

                if (vm.memberships.length > 0) {
                    vm.displayGymAtCurrentIndex();
                } else {
                    vm.currentlyDisplayedGym = null;
                }
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
                    console.log(response);
                    deferred.resolve({
                        success: true,
                        memberships: response.data.memberships
                    });
                }, function(error) {
                    console.log(error);
                    deferred.resolve({
                        success: false,
                        error: error.data.reason
                    });
                });
                return deferred.promise;
            }
        };
    };

    angular.module('app').factory('dashboardService', ['$http', '$q', dashboardService]);
}());

(function() {
    'use strict';

    var remove = function(collection, item) {
        var index = collection.indexOf(item);
        if (index >= 0) {
            collection.splice(index, 1);
        }
    };

    var EmploymentController = function(employmentService, identityService) {
        var vm = this;
        employmentService.searchEmployment().then(function(response) {
            if (response.success) {
                vm.employment = response.employment;
                vm.pendingEmployments = response.pendingEmployments;
                vm.possibleEmployments = response.possibleEmployments;
            } else {
                console.log(response.error);
            }
        });

        vm.requestEmployment = function(gym) {
            employmentService.requestEmployment(gym).then(function(response) {
                if (response.success) {
                    remove(vm.possibleEmployments, gym);
                    vm.pendingEmployments.push(gym);
                } else {
                    console.log(response.error);
                }
            });
        };

        vm.deleteEmployment = function(gym) {
            employmentService.deleteEmployment(identityService.currentUser, gym)
                .then(function(response) {
                    if (response.success) {
                        vm.employment = null;
                        remove(vm.pendingEmployments, gym);
                        vm.possibleEmployments.push(gym);
                    } else {
                        console.log(response.error);
                    }
                });
        };

        vm.checkInMember = function(member) {
            employmentService.checkInMember(vm.employment, member)
                .then(function(response) {
                    if (response.success) {
                        remove(vm.employment.checkedOutMembers, member);
                        vm.employment.checkedInMembers.push(member);
                    } else {
                        console.log(response.error);
                    }
                });
        };

        vm.checkOutMember = function(member) {
            employmentService.checkOutMember(vm.employment, member)
                .then(function(response) {
                    if (response.success) {
                        remove(vm.employment.checkedInMembers, member);
                        vm.employment.checkedOutMembers.push(member);
                    } else {
                        console.log(response.error);
                    }
                });
        };
    };

    EmploymentController.$inject = ['employmentService', 'identityService'];
    angular.module('app').controller('EmploymentController', EmploymentController);
}());

(function() {
    'use strict';

    var resolveSuccess = function(deferred) {
        deferred.resolve({
            success: true
        });
    };

    var resolveError = function(deferred, error) {
        deferred.resolve({
            success: false,
            error: error.data.reason
        });
    };

    var employmentService = function($http, $q, membershipService) {
        return {
            acceptMembership: function(pendingMember, gym) {
                var deferred = $q.defer();
                $http.post('/api/acceptMembership', {
                    pendingMember: pendingMember,
                    gym: gym
                }).then(function(response) {
                    resolveSuccess(deferred);
                }, function(error) {
                    resolveError(deferred, error);
                });

                return deferred.promise;
            },
            deleteMembership: function(member, gym) {
                return membershipService.deleteMembership(member, gym);
            },
            searchEmployment: function() {
                var deferred = $q.defer();
                $http.get('/api/employment').then(function(response) {
                    deferred.resolve({
                        success: true,
                        employment: response.data.employment,
                        pendingEmployments: response.data.pendingEmployments,
                        possibleEmployments: response.data.possibleEmployments
                    });
                }, function(error) {
                    resolveError(deferred, error);
                });
                return deferred.promise;
            },
            requestEmployment: function(gym) {
                var deferred = $q.defer();
                $http.post('/api/requestEmployment', {
                    gym: gym
                }).then(function(response) {
                    resolveSuccess(deferred);
                }, function(error) {
                    resolveError(deferred, error);
                });
                return deferred.promise;
            },
            deleteEmployment: function(employee, gym) {
                var deferred = $q.defer();
                $http.post('/api/deleteEmployment', {
                    employee: employee,
                    gym: gym
                }).then(function(response) {
                    resolveSuccess(deferred);
                }, function(error) {
                    resolveError(deferred, error);
                });
                return deferred.promise;
            },
            checkInMember: function(gym, member) {
                var deferred = $q.defer();
                $http.post('api/checkInMember', {
                    gym: gym,
                    member: member
                }).then(function(response) {
                    resolveSuccess(deferred);
                }, function(error) {
                    resolveError(deferred, error);
                });
                return deferred.promise;
            },
            checkOutMember: function(gym, member) {
                var deferred = $q.defer();
                $http.post('api/checkOutMember', {
                    gym: gym,
                    member: member
                }).then(function(response) {
                    resolveSuccess(deferred);
                }, function(error) {
                    resolveError(deferred, error);
                });
                return deferred.promise;
            }
        };
    };

    angular.module('app')
        .factory('employmentService', ['$http', '$q', 'membershipService', employmentService]);
}());

(function() {
    'use strict';

    var gymService = function($http, $q) {
        return {
            search: function() {
                var deferred = $q.defer();
                $http.get('/api/gyms').then(function(response) {
                    deferred.resolve({
                        success: true,
                        gyms: response.data
                    });

                }, function(error) {
                    deferred.resolve({
                        success: false,
                        error: error.data.reason
                    });
                });
                return deferred.promise;
            }
        };
    };

    angular.module('app').factory('gymService', ['$http', '$q', gymService]);
}());

(function() {
    'use strict';

    var GymsController = function(gymService, identityService, membershipService) {
        var vm = this;

        vm.requestMembership = function(gym) {
            membershipService.requestMembership(gym).then(function(response) {
                if (response.success) {
                    gym.isCurrentUserPendingMember = true;
                } else {
                    console.log(response.error);
                }
            });
        };

        gymService.search().then(function(response) {
            if (response.success) {
                vm.gyms = response.gyms;
            } else {
                console.log(response.error);
            }
        });
    };

    GymsController.$inject = ['gymService', 'identityService', 'membershipService'];
    angular.module('app').controller('GymsController', GymsController);
}());

(function() {
    'use strict';

    var MainController = function() {
        var vm = this;
    };

    MainController.$inject = [];
    angular.module('app').controller('MainController', MainController);
}());

(function() {
    'use strict';

    var membershipService = function($http, $q) {
        return {
            requestMembership: function(gym) {
                var deferred = $q.defer();
                $http.post('/api/requestMembership', {
                    gym: gym
                }).then(function(response) {
                    deferred.resolve({
                        success: true
                    });
                }, function(error) {
                    deferred.resolve({
                        success: false,
                        error: error.data.reason
                    });
                });
                return deferred.promise;
            },
            deleteMembership: function(member, gym) {
                var deferred = $q.defer();
                $http.post('/api/deleteMembership', {
                    member: member,
                    gym: gym
                }).then(function(response) {
                    deferred.resolve({
                        success: true
                    });
                }, function(error) {
                    deferred.resolve({
                        success: false,
                        error: error.data.reason
                    });
                });
                return deferred.promise;
            },
            searchMemberships: function() {
                var deferred = $q.defer();
                $http.get('/api/memberships').then(function(response) {
                    console.log('--searchMemberships--');
                    console.log(response);
                    console.log('---------------------');
                    deferred.resolve({
                        success: true,
                        pendingMemberships: response.data.pendingMemberships,
                        currentMemberships: response.data.currentMemberships
                    });
                }, function(error) {
                    deferred.resolve({
                        success: false,
                        error: error.data.reason
                    });
                });
                return deferred.promise;
            }
        };
    };

    angular.module('app').factory('membershipService', ['$http', '$q', membershipService]);
}());

(function() {
    'use strict';

    var remove = function(collection, item) {
        var index = collection.indexOf(item);
        if (index >= 0) {
            collection.splice(index, 1);
        }
    };

    var MembershipsController = function(identityService, membershipService) {
        var vm = this;

        vm.deleteMembership = function(gym) {
            membershipService.deleteMembership(identityService.currentUser, gym).then(function(response) {
                if (response.success) {
                    remove(vm.pendingMemberships, gym);
                    remove(vm.currentMemberships, gym);
                } else {
                    console.log(response.error);
                }
            });
        };

        membershipService.searchMemberships().then(function(response) {
            if (response.success) {
                vm.pendingMemberships = response.pendingMemberships;
                vm.currentMemberships = response.currentMemberships;
            } else {
                console.log(response.error);
            }
        });
    };

    MembershipsController.$inject = ['identityService', 'membershipService'];
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

    function remove(collection, item) {
        var index = collection.indexOf(item);
        if (index >= 0) {
            collection.splice(index, 1);
        }
    }

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
            ownershipService.createGym(vm.gymName, vm.gymMaxCapacity).then(function(response) {
                if (response.success) {
                    vm.gym = response.gym;
                } else {
                    notifierService.error(response.error);
                }
            });
        };

        vm.deleteMembership = function(member) {
            ownershipService.deleteMembership(member, vm.gym).then(function(response) {
                if (response.success) {
                    remove(vm.gym.members, member);
                    remove(vm.gym.pendingMembers, member);
                } else {
                    console.log(response.error);
                }
            });
        };

        vm.acceptMembership = function(pendingMember) {
            ownershipService.acceptMembership(pendingMember, vm.gym).then(function(response) {
                if (response.success) {
                    remove(vm.gym.pendingMembers, pendingMember);
                    vm.gym.members.push(pendingMember);
                } else {
                    console.log(response.error);
                }
            });
        };

        vm.deleteEmployment = function(employee) {
            ownershipService.deleteEmployment(employee, vm.gym).then(function(response) {
                if (response.success) {
                    remove(vm.gym.employees, employee);
                    remove(vm.gym.pendingEmployees, employee);
                } else {
                    console.log(response.error);
                }
            });
        };

        vm.acceptEmployment = function(pendingEmployee) {
            ownershipService.acceptEmployment(pendingEmployee, vm.gym).then(function(response) {
                if (response.success) {
                    remove(vm.gym.pendingEmployees, pendingEmployee);
                    vm.gym.employees.push(pendingEmployee);
                } else {
                    console.log(response.error);
                }
            });
        };
    };

    OwnershipController.$inject = ['ownershipService', 'requestErrorService', 'notifierService'];
    angular.module('app').controller('OwnershipController', OwnershipController);
}());

(function() {
    'use strict';

    var ownershipService = function($http, $q, employmentService) {
        return {
            getOwnedGym: function() {
                var deferred = $q.defer();
                $http.get('/api/ownership').then(function(response) {
                    console.log(response);
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
            createGym: function(gymName, gymMaxCapacity) {
                var deferred = $q.defer();
                $http.post('/api/ownership', {
                        gymName: gymName,
                        maxCapacity: gymMaxCapacity
                    })
                    .then(function(response) {
                        deferred.resolve({
                            success: true,
                            gym: response.data
                        });
                    }, function(error) {
                        deferred.resolve({
                            success: false,
                            error: error.data.reason
                        });
                    });

                return deferred.promise;
            },
            acceptEmployment: function(pendingEmployee, gym) {
                var deferred = $q.defer();
                console.log('--sending acceptEmployment request--');
                $http.post('/api/acceptEmployment', {
                    pendingEmployee: pendingEmployee,
                    gym: gym
                }).then(function(response) {
                    console.log(response);
                    deferred.resolve({
                        success: true
                    });
                }, function(error) {
                    deferred.resolve({
                        success: false,
                        error: error.data.reason
                    });
                });

                return deferred.promise;
            },
            deleteEmployment: function(employee, gym) {
                return employmentService.deleteEmployment(employee, gym);
            },
            acceptMembership: function(pendingMember, gym) {
                return employmentService.acceptMembership(pendingMember, gym);
            },
            deleteMembership: function(member, gym) {
                return employmentService.deleteMembership(member, gym);
            }
        };
    };

    angular.module('app')
        .factory('ownershipService', ['$http', '$q', 'employmentService', ownershipService]);
}());

angular.module("app").run(["$templateCache", function($templateCache) {$templateCache.put("app/account/loginTemplate.html","<div class=\"nav navbar-nav navbar-right\" ng-hide=vm.identity.isAuthenticated()><li><a href=/signup>Sign Up</a></li></div><div class=navbar-right><form class=navbar-form ng-hide=vm.identity.isAuthenticated()><div class=form-group><input class=form-control placeholder=Username ng-model=vm.username )=\"\"></div><div class=form-group><input class=form-control type=password placeholder=Password ng-model=vm.password></div><button class=\"btn btn-primary\" ng-click=\"vm.signin(vm.username, vm.password)\">Sign In</button></form><ul ng-show=vm.identity.isAuthenticated() class=\"nav navbar-nav navbar-right\"><li class=dropdown><a class=dropdown-toggle href data-toggle=dropdown>{{vm.identity.currentUser.firstName + \" \" + identity.currentUser.lastName}} <b class=caret></b></a><ul class=dropdown-menu><li><a href=/memberships>Memberships</a></li><li><a href=/employment>Employment</a></li><li><a href=/ownership>Ownership</a></li><li><a href ng-click=vm.signout()>Sign Out</a></li></ul></li></ul></div>");
$templateCache.put("app/account/signup.html","<div class=container><div class=\"well foo\"><form name=signupForm class=form-horizontal><fieldset><legend>New User Information</legend><div class=form-group><label for=username class=\"col-md-2 control-label\">Username</label><div class=col-md-10><input name=username type=text placeholder=Username ng-model=vm.username required class=form-control></div></div><div class=form-group><label for=password class=\"col-md-2 control-label\">Password</label><div class=col-md-10><input name=password type=password placeholder=Password ng-model=vm.password required class=form-control></div></div><div class=form-group><label for=firstName class=\"col-md-2 control-label\">First name</label><div class=col-md-10><input name=firstName type=text placeholder=\"First Name\" ng-model=vm.firstName required class=form-control></div></div><div class=form-group><label for=lastName class=\"col-md-2 control-label\">Last Name</label><div class=col-md-10><input name=lastName type=lastName placeholder=\"Last Name\" ng-model=vm.lastName required class=form-control></div></div><div class=form-group><div class=\"col-md-10 col-md-offset-2\"><div class=pull-right><button ng-click=vm.signup() ng-disabled=signupForm.$invalid class=\"btn btn-primary\">Submit</button> &nbsp;<a href=\"/\" class=\"btn btn-default\">Cancel</a></div></div></div></fieldset></form></div></div>");
$templateCache.put("app/dashboard/dashboard.html","<div class=container><div ng-repeat=\"gym in vm.memberships\" ng-show=\"vm.currentlyDisplayedGym === gym\" class=col-centered><a href ng-click=vm.moveLeft() ng-show=\"vm.memberships.length > 1\" class=nav-arrow-left><img src=/client/images/left_arrow.png></a><h3 class=dashboard-gym-title>{{gym.name}}</h3><a href ng-click=vm.moveRight() ng-show=\"vm.memberships.length > 1\" class=nav-arrow-right><img src=/client/images/right_arrow.png></a><h4>Best Time To Go: 7:30 PM</h4><h4>Currently Full</h4><div class=\"progress dashboard-progress-bar\"><div ng-repeat=\"percentage in vm.percentages\" ng-class=\"{\'progress-bar\': true, \'dashboard-progress-level\': true, \'progress-bar-success\': vm.currentPercentage <= 50, \'progress-bar-warning\': vm.currentPercentage > 50 && vm.currentPercentage <= 80, \'progress-bar-danger\': vm.currentPercentage > 80}\" ng-show=\"percentage <= vm.currentPercentage\"></div></div></div></div>");
$templateCache.put("app/employment/employment.html","<div ng-show=!vm.employment class=container><div class=col-centered>You are not currently employed at any registered gym.</div><br><ul class=\"col-md-6 list-group\"><li class=\"list-group-item active\">Possible Employment</li><li ng-repeat=\"possibleEmployment in vm.possibleEmployments\" class=list-group-item>{{possibleEmployment.name}}<div class=user-action><a href ng-click=vm.requestEmployment(possibleEmployment)><img src=/client/images/add.png></a></div></li></ul><ul class=\"col-md-6 list-group\"><li class=\"list-group-item active\">Pending Employment</li><li ng-repeat=\"pendingEmployment in vm.pendingEmployments\" class=list-group-item>{{pendingEmployment.name}}<div class=user-action><a href ng-click=vm.deleteEmployment(pendingEmployment)><img src=/client/images/cross.png></a></div></li></ul></div><div ng-show=vm.employment class=container><h3 class=col-centered>{{vm.employment.name}}</h3><br><ul class=\"col-md-6 list-group\"><li class=\"list-group-item active\">Checked In</li><li ng-repeat=\"checkedInMember in vm.employment.checkedInMembers\" class=list-group-item>{{checkedInMember.firstName + \' \' + checkedInMember.lastName}}<div class=pull-right><a href ng-click=vm.checkOutMember(checkedInMember)><img src=/client/images/right_arrow.png></a></div></li></ul><ul class=\"col-md-6 list-group\"><li class=\"list-group-item active\">Checked Out</li><li ng-repeat=\"checkedOutMember in vm.employment.checkedOutMembers\" class=list-group-item><div class=pull-left><a href ng-click=vm.checkInMember(checkedOutMember)><img src=/client/images/left_arrow.png></a></div>{{checkedOutMember.firstName + \' \' + checkedOutMember.lastName}}</li></ul></div>");
$templateCache.put("app/gyms/gyms.html","<div class=container><ul class=\"list-group col-centered col-md-6\"><li class=\"list-group-item active\">Gyms</li><li ng-repeat=\"gym in vm.gyms\" class=list-group-item>{{gym.name}}<div class=pull-right><a href ng-show=\"!gym.isCurrentUserMember && !gym.isCurrentUserPendingMember\" ng-click=vm.requestMembership(gym)><img src=/client/images/add.png></a> <a href=/memberships ng-show=gym.isCurrentUserPendingMember><img src=/client/images/question.png></a> <a href=/memberships ng-show=gym.isCurrentUserMember><img src=/client/images/check.png></a></div></li></ul></div>");
$templateCache.put("app/main/main.html","");
$templateCache.put("app/memberships/memberships.html","<div class=container><ul class=\"col-md-6 list-group\"><li class=\"list-group-item active\">Pending Memberships</li><li ng-repeat=\"pendingMembership in vm.pendingMemberships\" class=list-group-item>{{pendingMembership.name}} <a href ng-click=vm.deleteMembership(pendingMembership) class=pull-right><img src=/client/images/cross.png></a></li></ul><ul class=\"col-md-6 list-group\"><li class=\"list-group-item active\">Current Memberships</li><li ng-repeat=\"currentMembership in vm.currentMemberships\" class=list-group-item>{{currentMembership.name}} <a href ng-click=vm.deleteMembership(currentMembership) class=pull-right><img src=/client/images/cross.png></a></li></ul></div>");
$templateCache.put("app/navbar/navbarTemplate.html","<div class=\"navbar navbar-inverse navbar-fixed-top\"><div class=container><div class=navbar-header><a class=navbar-brand href=\"/\">RecSpy</a></div><div class=\"navbar-collapse collapse\"><ul class=\"nav navbar-nav navbar-left\"><li ng-show=identity.isAuthenticated()><a href=/dashboard>Dashboard</a></li><li ng-show=identity.isAuthenticated()><a href=/gyms>Gyms</a></li></ul><login-directive></login-directive></div></div></div>");
$templateCache.put("app/ownership/ownership.html","<div ng-show=!vm.gym class=container>You do not currently own a gym.<div class=well><form name=createGymForm class=form-horizontal><legend>New Gym Information</legend><div class=form-group><label for=gymName class=\"col-md-2 control-label\">Gym Name</label><div class=col-md-10><input name=gymName type=text placeholder=\"Gym Name\" ng-model=vm.gymName required class=form-control></div></div><div class=form-group><label for=gymMaxCapacity class=\"col-md-2 control-label\">Max Capacity</label><div class=col-md-10><input name=gymMaxCapacity type=text placeholder=\"Max Capacity\" ng-model=vm.gymMaxCapacity required class=form-control></div></div><div class=form-group><div class=\"col-md-10 col-md-offset-2\"><div class=pull-right><button ng-click=vm.createGym() ng-disabled=createGymForm.$invalid class=\"btn btn-primary\">Create</button> &nbsp;<a href=\"/\" class=\"btn btn-default\">Cancel</a></div></div></div></form></div></div><div ng-show=vm.gym class=container><h3 class=col-centered>{{vm.gym.name}}</h3><br><ul class=\"col-md-6 list-group\"><li class=\"list-group-item active\">Members</li><li ng-repeat=\"pendingMember in vm.gym.pendingMembers\" class=list-group-item>{{pendingMember.firstName + \' \' + pendingMember.lastName}} (pending)<div class=pull-right><a href ng-click=vm.deleteMembership(pendingMember)><img src=/client/images/cross.png></a> <a href ng-click=vm.acceptMembership(pendingMember)><img src=/client/images/add.png></a></div></li><li ng-repeat=\"member in vm.gym.members\" class=list-group-item>{{member.firstName + \' \' + member.lastName}} <a href ng-click=vm.deleteMembership(member) class=pull-right><img src=/client/images/cross.png></a></li></ul><ul class=\"col-md-6 list-group\"><li class=\"list-group-item active\">Employees</li><li ng-repeat=\"pendingEmployee in vm.gym.pendingEmployees\" class=list-group-item>{{pendingEmployee.firstName + \' \' + pendingEmployee.lastName}} (pending)<div class=pull-right><a href ng-click=vm.deleteEmployment(pendingEmployee)><img src=/client/images/cross.png></a> <a href ng-click=vm.acceptEmployment(pendingEmployee)><img src=/client/images/add.png></a></div></li><li ng-repeat=\"employee in vm.gym.employees\" class=list-group-item>{{employee.firstName + \' \' + employee.lastName}} <a href ng-click=vm.deleteEmployment(employee) class=pull-right><img src=/client/images/cross.png></a></li></ul></div>");}]);