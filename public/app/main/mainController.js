(function () {
    'use strict';

    angular.module('app').controller('mainController', function () {
        var vm = this;
        vm.myVar = "Hello from main controller";
    });
}());