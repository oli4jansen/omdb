'use strict';

/**
 * @ngdoc function
 * @name omdbApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the omdbApp
 */
angular.module('omdbApp')
  .controller('HomeCtrl', function ($scope, $rootScope, $http, $location, APIURL, APIKey) {

    $scope.posterPath = $rootScope.config.images.base_url+$rootScope.config.images.poster_sizes[2];

  	$http({
  	  method: 'GET',
  	  url: APIURL+'movie/popular',
      params: {
        api_key: APIKey,
      }
    }).success(function (data) {
      console.log(data);
      $scope.popular = data.results;
      $scope.popularCount = data.total_results;
    }).error(function (data) {
      console.log(data);
    });

  	$http({
  	  method: 'GET',
  	  url: APIURL+'movie/now_playing',
      params: {
        api_key: APIKey,
      }
    }).success(function (data) {
      console.log(data);
      $scope.playing = data.results;
      $scope.playingCount = data.total_results;
    }).error(function (data) {
      console.log(data);
    });

  });
