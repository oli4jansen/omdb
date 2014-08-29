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
        console.log('vote_copy is nu '+vote_copy);
        console.log('Math.round(vote_copy) is nu '+Math.round(vote_copy));
        if(vote_copy >= 1) {
          // If the rating is equal to or higher than 1, add one star to the 5-star-rating
          console.log('Give star #'+(i+1));
          $scope.stars[i] = 2;
        }else if(Math.round(vote_copy) === 1) {
          // If the rating is only equal to 1 when rounded, provide half a star
          $scope.stars[i] = 1;
          console.log('Give half star #'+(i+1));
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

      // Add details to the sidebar

      if($scope.details.release_date) {
        $scope.sidebarDetails.push({
          label: 'Release date',
          value: $scope.details.release_date
        });
      }

      if($scope.details.runtime) {
        $scope.sidebarDetails.push({
          label: 'Runtime',
          value: $scope.details.runtime+' minutes'
        });
      }

      if($scope.details.number_of_seasons) {
        $scope.sidebarDetails.push({
          label: 'Number of seasons',
          value: $scope.details.number_of_seasons
        });
      }

      if($scope.details.networks && $scope.details.networks.length > 0) {
        $scope.sidebarDetails.push({
          label: 'Networks',
          value: $scope.details.networks.map(function (elem) { return elem.name }).join('\n')
        });
      }

      if($scope.details.genres && $scope.details.genres.length > 0) {
        $scope.sidebarDetails.push({
          label: 'Genres',
          value: $scope.details.genres.map(function (elem) { return elem.name }).join(', ')
        });
      }

      if($scope.details.production_companies && $scope.details.production_companies.length > 0) {
        $scope.sidebarDetails.push({
          label: 'Production companies',
          value: $scope.details.production_companies.map(function (elem) { return elem.name }).join(', ')
        });
      }

      if($scope.details.production_countries && $scope.details.production_countries.length > 0) {
        $scope.sidebarDetails.push({
          label: 'Production countries',
          value: $scope.details.production_countries.map(function (elem) { return elem.name }).join(', ')
        });
      }

      if($scope.details.spoken_languages && $scope.details.spoken_languages.length > 0) {
        $scope.sidebarDetails.push({
          label: 'Spoken languages',
          value: $scope.details.spoken_languages.map(function (elem) { return elem.name }).join(', ')
        });
      }

      if($scope.details.budget) {
        $scope.sidebarDetails.push({
          label: 'Budget',
          value: '$'+$scope.details.budget.toString().replace(/(\d{1,3})(?=(?:\d{3})+$)/g,"$1,")
        });
      }

      if($scope.details.revenue) {
        $scope.sidebarDetails.push({
          label: 'Revenue',
          value: '$'+$scope.details.revenue.toString().replace(/(\d{1,3})(?=(?:\d{3})+$)/g,"$1,")
        });
      }

    });

    // Called when a external URL needs to be trusted
    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
    };

    // Show only the shortened overview (if shortened)
    $scope.showFullOverview = false;

    // Called when the full overview should be shown
    $scope.toggleFullOverview = function () {
      $scope.showFullOverview = !$scope.showFullOverview;
    };

    // Show only the shortened overview (if shortened)
    $scope.showFullOverview = false;
    // Called when the full overview should be shown
    $scope.toggleFullOverview = function () {
      $scope.showFullOverview = !$scope.showFullOverview;
    };

    // Emty array to be filled with details about the title
    $scope.sidebarDetails = [];

    // Show only a few sidebar details
    $scope.showFullDetailsSidebar = false;
    // Called when all sidebar details should be shown
    $scope.toggleFullDetailsSidebar = function () {
      $scope.showFullDetailsSidebar = !$scope.showFullDetailsSidebar;
    };

    // Looping function to show all backdrops
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

    // Show previous backdrop
    $scope.prevBackdrop = function () {
      if($scope.backdropIndex > 0) {
        $scope.backdropIndex--;
      }else{
        $scope.backdropIndex = $scope.backdrops.length-1;
      }
    };

    // Show next backdrop
    $scope.nextBackdrop = function () {
      if($scope.backdropIndex < $scope.backdrops.length-1) {
        $scope.backdropIndex++;
      }else{
        $scope.backdropIndex = 0;
      }
    };

    $scope.$on('$destroy', function () {
      // When scope gets destroyed, we should make the menu/header normal again and cancel all timers
      $rootScope.translucentMenu = false;
      $timeout.cancel();
    });

  });
