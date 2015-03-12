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
