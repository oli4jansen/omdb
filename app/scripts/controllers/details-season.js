'use strict';

angular.module('omdbApp')
  .controller('DetailsSeasonCtrl', function ($scope, $rootScope, $routeParams, $location, $http, $timeout, $sce, config, api) {

    // We need an ID and season number, else gtfo
  	if(!$routeParams.id || !$routeParams.seasonNumber) $location.path('');

    $scope.tvShowID = $routeParams.id;
    $scope.seasonNumber = $routeParams.seasonNumber;

    // If no type is provided, default to movie
    $scope.type = $routeParams.type || 'movie';

    // Base path for displaying images returned by the API
    $scope.backdropPath = config.getImagePath('backdrop', 'original');
    $scope.posterPath   = config.getImagePath('poster', 3);
    $scope.profilePath  = config.getImagePath('profile', 3);

    // Request the title (movie or tv show) from the API
    api.tv.season($routeParams.id, $routeParams.seasonNumber, function (data) {

      // For dev purposes
      console.log(data);

      // Attach the data to the scope
      $scope.details = data;
      $scope.images = data.images;

    });
  });
