'use strict';

/**
 * @ngdoc function
 * @name omdbApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the omdbApp
 */
angular.module('omdbApp')
  .controller('DetailsNameCtrl', function ($scope, $rootScope, $routeParams, $location, $http, $timeout, config, APIKey, APIURL) {

  	if(!$routeParams.id) {
  	  $location.path('');
    }

    $scope.backdropPath = config.getConfig().images.base_url+'original';
    $scope.posterPath = config.getConfig().images.base_url+'original';
    $scope.profilePath = config.getConfig().images.base_url+config.getConfig().images.profile_sizes[1];

  	$http({
  	  method: 'GET',
  	  url: APIURL+'person/'+$routeParams.id,
      params: {
        api_key: APIKey,
        append_to_response: 'combined_credits,images,tagged_images'
      }
    }).success(function (data) {

      console.log(data);
      $scope.details = data;
      $scope.images = data.images;

      $rootScope.query = data.name;

      $scope.backdrops = [];
      data.tagged_images.results.forEach (function (image) {
        if(image.image_type === 'backdrop') {
          $scope.backdrops.push(image);
        }
      });

      if($scope.backdrops.length !== 0) {
        $rootScope.translucentMenu = true;
      }

      $scope.backdropIndex = 0;
      $scope.changeBackdrop();

    }).error(function (data) {
      console.log(data);
    });

    $scope.showFullBio = false;
    $scope.toggleFullBio = function () {
      $scope.showFullBio = !$scope.showFullBio;
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
