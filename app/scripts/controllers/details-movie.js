'use strict';

/**
 * @ngdoc function
 * @name omdbApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the omdbApp
 */
angular.module('omdbApp')
  .controller('DetailsMovieCtrl', function ($scope, $rootScope, $routeParams, $location, $http, $timeout, $sce, APIKey, APIURL) {

  	if(!$routeParams.id) {
  	  $location.path('');
    }

    if(!$routeParams.type) {
      $scope.type = 'movie';
    }else{
      $scope.type = $routeParams.type;
    }

    $scope.backdropPath = $rootScope.config.images.base_url+'original';
    $scope.posterPath = $rootScope.config.images.base_url+'original';
    $scope.profilePath = $rootScope.config.images.base_url+$rootScope.config.images.profile_sizes[1];

  	$http({
  	  method: 'GET',
  	  url: APIURL+$scope.type+'/'+$routeParams.id,
      params: {
        api_key: APIKey,
        append_to_response: 'credits,images,similar,videos'
      }
    }).success(function (data) {

      console.log(data);
      $scope.details = data;
      $scope.images = data.images;

      $rootScope.query = data.title || data.name;

      $scope.backdrops = [];

      $scope.images.backdrops.forEach(function (backdrop) {
        if(backdrop.width > 1000) {
          $scope.backdrops.push(backdrop);
        }
      });

      if($scope.backdrops.length !== 0) {
        $rootScope.translucentMenu = true;
      }

      $scope.backdropIndex = 0;
      $scope.changeBackdrop();

      $scope.stars = [0,0,0,0,0,0,0,0,0,0];
      var vote_copy = $scope.details.vote_average;

      for(var i = 0;i<10;i++) {
        if(vote_copy >= 1) {
          $scope.stars[i] = 2;
        }else if(vote_copy > 0) {
          $scope.stars[i] = 1;
        }
        vote_copy--;
      }

      $scope.trailerYoutube = false;
      $scope.showTrailer = false;

      $scope.details.videos.results.forEach(function (video) {
        if(video.site === 'YouTube' && video.type === 'Trailer') {
          $scope.trailerYoutube = video;
        }
      });

    }).error(function (data) {
      console.log(data);
    });

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
