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

    $scope.results = [];

    // Search for movies
    api.movies.search($routeParams.query, function (data) {
      // Calculate combined popularity
      var moviesPopularity = 0;
      data.results.forEach(function (movie) {
        moviesPopularity = moviesPopularity + movie.popularity;
      }); 

      var movies = {
        results: data.results,
        title: 'Movies',
        typeDetails: 'title',
        typeMedia: 'movie',
        popularity: moviesPopularity
      };
      $scope.moviesCount = data.total_results;

      $scope.results.push(movies);

    });

    // Search for tv shows
    api.tv.search($routeParams.query, function (data) {
      // Calculate combined popularity
      var tvShowsPopularity = 0;
      data.results.forEach(function (tvShow) {
        tvShowsPopularity = tvShowsPopularity + tvShow.popularity;
      }); 

      var tvShows = {
        results: data.results,
        title: 'TV Shows',
        typeDetails: 'title',
        typeMedia: 'tv',
        popularity: tvShowsPopularity
      };
      $scope.tvShowsCount = data.total_results;

      $scope.results.push(tvShows);

    });

    // Search for people
    api.people.search($routeParams.query, function (data) {
      // Calculate combined popularity
      var peoplePopularity = 0;
      data.results.forEach(function (person) {
        peoplePopularity = peoplePopularity + person.popularity;
      }); 

      var people = {
        results: data.results,
        title: 'People',
        typeDetails: 'name',
        typeMedia: '',
        popularity: peoplePopularity
      };
      $scope.peopleCount = data.total_results;

      $scope.results.push(people);

    });

  });
