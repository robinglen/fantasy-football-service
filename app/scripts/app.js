'use strict';

angular.module('fantasyFootballFrontendApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/views/main.html',
        controller: 'MainCtrl'
      })   
      
      .when('/manager/:id/:type', {
        templateUrl: '/views/manager.html',
        controller: 'ManagerCtrl'
      })

      .when('/league/:id/', {
        templateUrl: '/views/league.html',
        controller: 'LeagueCtrl'
      })          
      .otherwise({
        redirectTo: '/'
      });
  });
