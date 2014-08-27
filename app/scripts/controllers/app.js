'use strict';

/**
 * @ngdoc function
 * @name omdbApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the omdbApp
 */
angular.module('omdbApp')
  .controller('AppCtrl', function ($scope, $rootScope, $location, $http, $timeout, $window, APIURL, APIKey) {

  	/*
     * Configuratie ophalen uit localstorage
     */
  	// TODO: checken of de cache vernieuwd moet worden
  	$rootScope.config = localStorage.getItem('configuration');
  	try {
  		$rootScope.config = JSON.parse($rootScope.config);
      console.log($rootScope.config);
  	}catch (err) {
  		console.log(err);
  	}

  	// Nieuwe config ophalen, als dat nodig is
  	if(!$rootScope.config || $rootScope.config === undefined || $rootScope.config === null) {
	  	$http({
	  	  method: 'GET',
	  	  url: APIURL+'configuration',
	      params: {
	        api_key: APIKey,
	      }
	    }).success(function (data) {
	      localStorage.setItem('configuration', JSON.stringify(data));
	      $rootScope.config = data;
        $window.location.reload();
	    }).error(function (data) {
	      console.log(data);
	      alert('error getting config');
	    });
  	}else{
      $scope.posterPath = $rootScope.config.images.base_url+$rootScope.config.images.poster_sizes[0];
      $scope.profilePath = $rootScope.config.images.base_url+$rootScope.config.images.profile_sizes[0];
    }

    /*
     * Autocomplete shizzle
     */

    $scope.showAutocomplete = false;

    $scope.autocompleteMovies = [];
    $scope.autocompleteTvShows = [];
    $scope.autocompletePeople = [];

  	$scope.search = function () {
  	  $location.path('search/'+$scope.query);
      $scope.hideAutocomplete();
  	};

    $scope.hideAutocomplete = function () {
      $timeout(function () {
        $scope.showAutocomplete = false;
      }, 150);
    };

    $scope.activateAutocomplete = function () {
      console.log('Autocomplete activated');
      $scope.showAutocomplete = true;
      autocomplete();
    };

    var oldQuery = $scope.query;
    var autocomplete = function() {
      $timeout(function () {
        if(oldQuery !== $scope.query) {
          oldQuery = $scope.query;

          if($scope.query.length > 2) {

            $http({
              method: 'GET',
              url: APIURL+'search/movie',
              params: {
                api_key: APIKey,
                query: $scope.query,
                search_type: 'ngram'
              }
            }).success(function (data) {
              $scope.autocompleteMovies = data.results.splice(0,3);
            }).error(function (data) { $scope.autocompleteMovies = [] });

            $http({
              method: 'GET',
              url: APIURL+'search/person',
              params: {
                api_key: APIKey,
                query: $scope.query,
                search_type: 'ngram'
              }
            }).success(function (data) {
              $scope.autocompletePeople = data.results.splice(0,3);
            }).error(function (data) { $scope.autocompletePeople = [] });

            $http({
              method: 'GET',
              url: APIURL+'search/tv',
              params: {
                api_key: APIKey,
                query: $scope.query,
                search_type: 'ngram'
              }
            }).success(function (data) {
              $scope.autocompleteTvShows = data.results.splice(0,3);
            }).error(function (data) { $scope.autocompleteTvShows = [] });

          }else{

            $scope.autocompleteMovies  = [];
            $scope.autocompleteTvShows = [];
            $scope.autocompletePeople  = [];

          }
        }
        if($scope.showAutocomplete) {
          autocomplete();
        }else{
          console.log('Autocomplete disabled');
        }
      }, 1000);
    }

  	$rootScope.$watch('query', function () {
  		$scope.query = $rootScope.query;
  	});

  });
