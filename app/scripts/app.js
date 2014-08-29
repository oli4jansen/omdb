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
    'ngResource',
    'ngRoute'
  ]).config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      })
      .when('/search/:query', {
        templateUrl: 'views/search.html',
        controller: 'SearchCtrl'
      })
      .when('/title/:id/:type?', {
        templateUrl: 'views/details-title.html',
        controller: 'DetailsTitleCtrl'
      })
      .when('/title/:id/tv/season/:seasonNumber', {
        templateUrl: 'views/details-season.html',
        controller: 'DetailsSeasonCtrl'
      })
      .when('/title/:id/tv/season/:seasonNumber/episode/:episodeNumber', {
        templateUrl: 'views/details-episode.html',
        controller: 'DetailsEpisodeCtrl'
      })
      .when('/name/:id/:type?', {
        templateUrl: 'views/details-name.html',
        controller: 'DetailsNameCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .value('APIKey', '5d967417393b991110d125b2c51affe5')
  .value('APIURL', 'http://api.themoviedb.org/3/');
