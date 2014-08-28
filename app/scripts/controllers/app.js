'use strict';

angular.module('omdbApp')
  .controller('AppCtrl', function ($scope, $rootScope, $location, $http, $timeout, $window, config, api) {

    // Base path for displaying images returned by the API in autocomplete
    $scope.posterPath = config.getImagePath('poster', 0);
    $scope.profilePath = config.getImagePath('profile', 0);

    // Dont show autocomplete by default
    $scope.showAutocomplete = false;

    // Autocomplete starts empty
    $scope.autocompleteMovies = [];
    $scope.autocompleteTvShows = [];
    $scope.autocompletePeople = [];

    // Activate autocomplete
    $scope.activateAutocomplete = function () {
      $scope.showAutocomplete = true;
      autocomplete();
    };

    // Give the user some time to click on a link (between blur and click-end)
    $scope.hideAutocomplete = function () {
      $timeout(function () {
        $scope.showAutocomplete = false;
      }, 150);
    };

    // Save the previous query for comparison purposes 
    var oldQuery = $scope.query;

    // Autocomplete function
    // This function will execute once every second to lower the amount of API requests (little bit dirty, I know, some kind of caching would be 100x better)
    var autocomplete = function() {
      $timeout(function () {
        // Compare the current query with the query from one second ago
        if(oldQuery !== $scope.query) {
          // Update the 'old query' with the current value for use in the future (1 sec from now)
          oldQuery = $scope.query;
          // Don't respond to short queries
          if($scope.query.length > 2) {
            // Search for movie suggestions
            api.movies.autocomplete($scope.query, function (data) {
              $scope.autocompleteMovies = data.results.splice(0,3);
            });
            // Search for person suggestions
            api.people.autocomplete($scope.query, function (data) {
              $scope.autocompletePeople = data.results.splice(0,3);
            });
            // Search for tv show suggestions
            api.tv.autocomplete($scope.query, function (data) {
              $scope.autocompleteTvShows = data.results.splice(0,3);
            });
          }else{
            // Short queries shall not be answered
            $scope.autocompleteMovies  = [];
            $scope.autocompleteTvShows = [];
            $scope.autocompletePeople  = [];
          }
        }

        // If the autocomplete is still visible...
        if($scope.showAutocomplete) {
          // ..we should still watch the querie variable
          autocomplete();
        }
      }, 1000);
    };

    // Called when form is submitted
    $scope.search = function () {
      $location.path('search/'+$scope.query);
      $scope.hideAutocomplete();
    };


  	$rootScope.$watch('query', function () {
      // Mirror query to the rootScope so everyone can reach it
  		$scope.query = $rootScope.query;
  	});

  });
