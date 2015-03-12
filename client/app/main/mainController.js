(function() {
    'use strict';

    var MainController = function() {
        var vm = this;
        vm.myVar = 'Hello From Main Controller';
    };

    MainController.$inject = [];
    angular.module('app').controller('MainController', MainController);
}());
