'use strict';

/**
 * @ngdoc overview
 * @name omdbApp
 * @description
 * # omdbApp
 *
 * Main module of the application.
 */
angular
  .module('omdbApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      })
      .when('/search/:query', {
        templateUrl: 'views/search.html',
        controller: 'SearchCtrl'
      })
      .when('/title/:id/:type', {
        templateUrl: 'views/details-movie.html',
        controller: 'DetailsMovieCtrl'
      })
      .when('/name/:id', {
        templateUrl: 'views/details-person.html',
        controller: 'DetailsPersonCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .value('APIKey', '5d967417393b991110d125b2c51affe5')
  .value('APIURL', 'http://api.themoviedb.org/3/');
