'use strict';

angular.module('omdbApp')
  .controller('DetailsEpisodeCtrl', function ($scope, $rootScope, $routeParams, $location, $http, $timeout, $sce, config, api) {

    // We need an ID and season number, else gtfo
  	if(!$routeParams.id || !$routeParams.seasonNumber || !$routeParams.episodeNumber) $location.path('');

    $scope.tvShowID = $routeParams.id;
    $scope.seasonNumber = $routeParams.seasonNumber;
    $scope.episodeNumber = $routeParams.episodeNumber;

    // If no type is provided, default to movie
    $scope.type = $routeParams.type || 'movie';

    // Base path for displaying images returned by the API
    $scope.stillPath  = config.getImagePath('profile', 'original');
    $scope.profilePath  = config.getImagePath('profile', 2);

    // Request the title (movie or tv show) from the API
    api.tv.episode($routeParams.id, $routeParams.seasonNumber, $routeParams.episodeNumber, function (data) {

      // For dev purposes
      console.log(data);

      // Attach the data to the scope
      $scope.details = data;
      $scope.images = data.images;

      if(data.still_path) {
        $rootScope.translucentMenu = true;
      }

      // Add details to the sidebar

      if($scope.details.air_date) {
        $scope.sidebarDetails.push({
          label: 'Air date',
          value: $scope.details.air_date
        });
      }

      $scope.sidebarDetails.push({
        label: 'Season number',
        value: $scope.details.season_number
      });

      $scope.sidebarDetails.push({
        label: 'Episode number',
        value: $scope.details.episode_number
      });

    });

    // Emty array to be filled with details about the name
    $scope.sidebarDetails = [];

    $scope.$on('$destroy', function () {
      $rootScope.translucentMenu = false;
    });

  });