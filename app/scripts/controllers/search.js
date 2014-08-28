'use strict';

angular.module('omdbApp')
  .controller('SearchCtrl', function ($scope, $rootScope, $routeParams, $location, $http, config, api) {

  	if(!$routeParams.query) {
      // If there is no query, we can not search
  	  $location.path('');
  	}else{
      // Attach the query to the rootScope to make is accessable from everywhere
      $rootScope.query = $routeParams.query;
    }

    $scope.posterPath  = config.getImagePath('poster', 1);
    $scope.profilePath = config.getImagePath('profile', 1);

    // Start with empty search results
    $scope.movies  = [];
    $scope.tvShows = [];
    $scope.people  = [];

    // Search for movies
    api.movies.autocomplete($routeParams.query, function (data) {
      $scope.movies      = data.results;
      $scope.moviesCount = data.total_results;
    });

    // Search for tv shows
    api.tv.autocomplete($routeParams.query, function (data) {
      $scope.tvShows      = data.results;
      $scope.tvShowsCount = data.total_results;
    });

    // Search for people
    api.people.autocomplete($routeParams.query, function (data) {
      $scope.people      = data.results;
      $scope.peopleCount = data.total_results;
    });

  });
