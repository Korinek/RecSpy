(function () {
    angular.module('app').controller('signupController',
        function (User, notifierService, $location, authService) {
            var vm = this;
            vm.signup = function () {
                var newUserData = {
                    username: vm.email,
                    password: vm.password,
                    firstName: vm.firstName,
                    lastName: vm.lastName
                };

                console.log(newUserData);

                authService.createUser(newUserData)
                    .then(function () {
                        notifierService.success('User account created!');
                        $location.path('/');
                    }, function (reason) {
                        notifierService.error(reason);
                    }); 
        }
    });
}());
