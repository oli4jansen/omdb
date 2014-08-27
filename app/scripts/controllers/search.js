'use strict';

/**
 * @ngdoc function
 * @name omdbApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the omdbApp
 */
angular.module('omdbApp')
  .controller('SearchCtrl', function ($scope, $rootScope, $routeParams, $location, $http, $anchorScroll, APIKey, APIURL) {

  	if(!$routeParams.query) {
  	  $location.path('');
  	}else{
      $rootScope.query = $routeParams.query;
    }

    console.log($rootScope.config);

    $scope.posterPath = $rootScope.config.images.base_url+$rootScope.config.images.poster_sizes[1];
    $scope.profilePath = $rootScope.config.images.base_url+$rootScope.config.images.profile_sizes[1];

    $scope.movies = [];
    $scope.people = [];

    $http({
      method: 'GET',
      url: APIURL+'search/movie',
      params: {
        api_key: APIKey,
        query: $routeParams.query
      }
    }).success(function (data) {
      console.log(data);
      $scope.movies = data.results;
      $scope.moviesCount = data.total_results;
    }).error(function (data) {
      console.log(data);
    });

    $http({
      method: 'GET',
      url: APIURL+'search/tv',
      params: {
        api_key: APIKey,
        query: $routeParams.query
      }
    }).success(function (data) {
      console.log(data);
      $scope.tvShows = data.results;
      $scope.tvShowsCount = data.total_results;
    }).error(function (data) {
      console.log(data);
    });

    $http({
      method: 'GET',
      url: APIURL+'search/person',
      params: {
        api_key: APIKey,
        query: $routeParams.query
      }
    }).success(function (data) {
      console.log(data);
      $scope.people = data.results;
      $scope.peopleCount = data.total_results;
    }).error(function (data) {
      console.log(data);
    });

    $scope.details = function (itemType, movie, contentType) { $location.path(itemType+'/'+movie.id+'/'+contentType); };
    $scope.scrollTo = function (hash) { $location.hash(hash); $anchorScroll(); };

  });
