(function() {
    'use strict';

    var LoginController = function(identityService, notifierService, authService, $location) {
        var vm = this;
        vm.identity = identityService;
        vm.signin = function(username, password) {
            authService.authenticateUser(username, password).then(function(success) {
                if (success) {
                    notifierService.success('You have successfully signed in!');
                } else {
                    notifierService.failure('Username/Password combination incorrect');
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
