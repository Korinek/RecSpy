'use strict';

console.log('making app');
angular.module('app', ['ngResource', 'ngRoute']);
console.log('making routes');
angular.module('app').config(function($routeProvider, $locationProvider) {
	$locationProvider.html5Mode = true;
	$routeProvider
      .when('/', 
      	{
					templateUrl: '/partials/main',
        	controller: 'mainController'
      	});
});

console.log('routes made');