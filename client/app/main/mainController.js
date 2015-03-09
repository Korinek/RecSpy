(function () {
    'use strict';

    angular.module('app').controller('mainController', function () {
        console.log('Creating MainController');
        var vm = this;
        vm.myVar = 'Hello from main controller';
    });
}());
