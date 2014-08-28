'use strict';

angular.module('omdbApp')
  .controller('DetailsTitleCtrl', function ($scope, $rootScope, $routeParams, $location, $http, $timeout, $sce, config, api) {

    // We need an ID, else gtfo
  	if(!$routeParams.id) $location.path('');

    // If no type is provided, default to movie
    $scope.type = $routeParams.type || 'movie';

    // Base path for displaying images returned by the API
    $scope.backdropPath = config.getImagePath('backdrop', 'original');
    $scope.posterPath   = config.getImagePath('poster', 3);
    $scope.profilePath  = config.getImagePath('profile', 3);

    // Get the 'plural' form of the type, for accessing the API service
    switch($scope.type) {
      case 'tv':
        var typePlural = 'tv';
        break;
      default:
        var typePlural = 'movies';
        break;
    }

    // Request the title (movie or tv show) from the API
    api[typePlural].id($routeParams.id, function (data) {

      // For dev purposes
      console.log(data);

      // Attach the data to the scope
      $scope.details = data;
      $scope.images = data.images;

      // Put the title or name in the search box
      $rootScope.query = data.title || data.name;

      // Start with an empty backdrop list
      $scope.backdrops = [];

      // Iterate through backdrops
      $scope.images.backdrops.forEach(function (backdrop) {
        if(backdrop.width > 1000) {
          // Save all backdrops that are wide enough for full screen displayal
          $scope.backdrops.push(backdrop);
        }
      });

      if($scope.backdrops.length !== 0) {
        // If there are backdrops found, make the menu/header translucent
        $rootScope.translucentMenu = true;
      }

      // Start the backdrop slideshow at the beginning
      $scope.backdropIndex = 0;
      // And start the looping slideshow function
      $scope.changeBackdrop();

      // Array representing the star rating
      $scope.stars = [0,0,0,0,0];

      // Steps to produce 5-star-rating from a out-of-10-rating:

      // Devide the out-of-10-rating by 2
      var vote_copy = $scope.details.vote_average / 2;

      // Repeat the following 5 time:
      for(var i = 0;i<5;i++) {
        if(vote_copy >= 1) {
          // If the rating is equal to or higher than 1, add one star to the 5-star-rating
          $scope.stars[i] = 2;
        }else if(Math.round(vote_copy) === 0) {
          // If the rating is only equal to 1 when rounded, provide half a star
          $scope.stars[i] = 1;
        }
        // Subtract 1 from the rating before repeating
        vote_copy--;
      }

      // Don't show the trailer by default
      $scope.trailerYoutube = false;
      $scope.showTrailer = false;

      // Search for a trailer that's hosted on YouTube
      $scope.details.videos.results.forEach(function (video) {
        if(video.site === 'YouTube' && video.type === 'Trailer') {
          $scope.trailerYoutube = video;
        }
      });
    });

    // Called when a external URL needs to be trusted
    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
    };

    $scope.showFullOverview = false;
    $scope.toggleFullOverview = function () {
      $scope.showFullOverview = !$scope.showFullOverview;
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
