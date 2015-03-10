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
                vm.password = "";
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
