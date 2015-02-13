'use strict';

console.log('making controller');

angular.module('app').controller('mainController', function($scope) {
	$scope.myVar = "Hello from Main controller";
	console.log('making the controller');
});

console.log('controller made');