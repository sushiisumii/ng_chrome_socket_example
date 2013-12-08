'use strict';

/*
require.config({ 
  baseUrl: 'bower_components',
  paths: {
    EventEmitter: 'eventEmitter/EventEmitter'
  }
});

require(['EventEmitter'], function(EventEmitter) {
  console.log('require loaded');       
});
*/

angular.module('gdlSocketsApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
