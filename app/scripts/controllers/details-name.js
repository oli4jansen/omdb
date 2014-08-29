'use strict';

angular.module('omdbApp')
  .controller('DetailsNameCtrl', function ($scope, $rootScope, $routeParams, $location, $http, $timeout, config, api) {

    // We need an ID, else gtfo
    if(!$routeParams.id) $location.path('');
    if(!$routeParams.type) {
      $scope.type = 'person';
    }else{
      $scope.type = $routeParams.type;
    }

    // Base path for displaying images returned by the API
    $scope.backdropPath = config.getImagePath('backdrop', 'original');
    $scope.posterPath   = config.getImagePath('poster', 3);
    $scope.profilePath  = config.getImagePath('profile', 3);

    // Request the person data from the API
    api.people.id($routeParams.id, function (data) {

      // Log for debugging purposes
      console.log(data);

      // Attach data to the scope
      $scope.details = data;
      $scope.images = data.images;

      // Put the persons name in the search input
      $rootScope.query = data.name;

      // Start with an empty array of backdrops
      $scope.backdrops = [];

      // Filter backdrops from tagged_images
      data.tagged_images.results.forEach (function (image) {
        if(image.image_type === 'backdrop') {
          $scope.backdrops.push(image);
        }
      });

      // If there are backdrops to be shown, make the menu/header translucent
      if($scope.backdrops.length !== 0) {
        $rootScope.translucentMenu = true;
      }

      // Start at zero
      $scope.backdropIndex = 0;
      $scope.changeBackdrop();

      // Add details to the sidebar

      if($scope.details.birthday) {
        $scope.sidebarDetails.push({
          label: 'Born',
          value: $scope.details.birthday
        });
      }

      if($scope.details.deathday) {
        $scope.sidebarDetails.push({
          label: 'Died',
          value: $scope.details.deathday
        });
      }

      if($scope.details.place_of_birth) {
        $scope.sidebarDetails.push({
          label: 'Place of birth',
          value: $scope.details.place_of_birth
        });
      }

    });


    // Show only the shortened bio (if shortened)
    $scope.showFullBio = false;
    $scope.toggleFullBio = function () {
      $scope.showFullBio = !$scope.showFullBio;
    };

    // Emty array to be filled with details about the name
    $scope.sidebarDetails = [];

    // Show only a few sidebar details
    $scope.showFullDetailsSidebar = false;
    // Called when all sidebar details should be shown
    $scope.toggleFullDetailsSidebar = function () {
      $scope.showFullDetailsSidebar = !$scope.showFullDetailsSidebar;
    };

    $scope.changeBackdrop = function () {
      $timeout(function () {
        if($scope.backdropIndex < $scope.backdrops.length-1) {
          $scope.backdropIndex++;
        }else{
          $scope.backdropIndex = 0;
        }
        $scope.changeBackdrop();
      }, 12000);
    };

    $scope.prevBackdrop = function () {
      if($scope.backdropIndex > 0) {
        $scope.backdropIndex--;
      }else{
        $scope.backdropIndex = $scope.backdrops.length-1;
      }
    };

    $scope.nextBackdrop = function () {
      if($scope.backdropIndex < $scope.backdrops.length-1) {
        $scope.backdropIndex++;
      }else{
        $scope.backdropIndex = 0;
      }
    };

    $scope.$on('$destroy', function () {
      $rootScope.translucentMenu = false;
      $timeout.cancel();
    });

  });
