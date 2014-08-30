'use strict';

angular.module('omdbApp')
  .controller('HomeCtrl', function ($scope, $rootScope, $http, $location, config, api) {

    // Base path for displaying images returned by the API
    $scope.posterPath  = config.getImagePath('poster', 2);
    $scope.profilePath = config.getImagePath('profile', 2);

    // Get all movies now playing in theaters
    api.movies.playing(function (data) {
      $scope.playing      = data.results;
      $scope.playingCount = data.total_results;
    });

    // Get all popular movies
    api.movies.popular(function (data) {
      $scope.popularMovies      = data.results;
      $scope.popularMoviesCount = data.total_results;
    });

    // Get all popular people
    api.people.popular(function (data) {
      $scope.popularPeople      = data.results;
      $scope.popularPeopleCount = data.total_results;
    });

//    $scope.commands = commandSearch.getAllCommands();

  });
