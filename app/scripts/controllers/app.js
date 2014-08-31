'use strict';

angular.module('omdbApp')
  .controller('AppCtrl', function ($scope, $rootScope, $location, $http, $timeout, $window, config, api, commandSearch) {

    // Base path for displaying images returned by the API in autocomplete
    $scope.posterPath = config.getImagePath('poster', 0);
    $scope.profilePath = config.getImagePath('profile', 0);

    // Dont show autocomplete by default
    $scope.showAutocomplete = false;

    $scope.searchDisabled = false;

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
            commandSearch.findCommand($scope.query, function (command) {
              if(command) {
                // Clear the 'normal' suggestions
                $scope.autocompleteResults = [];

                var subjectType = command.subjectType;
                if(command.subjectType === 'episodes') subjectType = 'tv';

                // Search for subject suggestions of the current command
                api[subjectType].autocomplete(command.subject, function (data) {
                  $scope.command = command;
                  $scope.command.title = command.targetSentence[0].toUpperCase()+command.targetSentence.substr(1);
                  $scope.command.results = data.results.splice(0,6);
                });
              }else{
                // This aint no command
                $scope.command = false;

                // Search for suggestions based on the query
                api.multi.autocomplete($scope.query, function (data) {
                  $scope.autocompleteResults = data.results.splice(0,5);
                  for(var i = 0;i<$scope.autocompleteResults.length;i++) {
                    switch($scope.autocompleteResults[i].media_type) {
                      case 'movie':
                        $scope.autocompleteResults[i].typeDetails = 'title';
                        $scope.autocompleteResults[i].typeMedia = 'movie';
                        break;
                      case 'person':
                        $scope.autocompleteResults[i].typeDetails = 'name';
                        $scope.autocompleteResults[i].typeMedia = '';
                        break;
                      case 'tv':
                        $scope.autocompleteResults[i].typeDetails = 'title';
                        $scope.autocompleteResults[i].typeMedia = 'tv';
                        break;
                    };
                  }                });

              }
            });
            $scope.selected = -1;
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
      }, 500);
    };

    $scope.commandClick = function (command) {
      $scope.query = command;
      $scope.search();
    };

    $scope.selected = -1;

    $scope.arrowUp = function () {
      if($scope.selected > 0) {
        $scope.selected--;
      }else if($scope.selected < 0) {
        $scope.selected = $scope.autocompleteMovies.length + $scope.autocompleteTvShows.length + $scope.autocompletePeople.length -1;
      }else if($scope.selected === 0) {
        $scope.selected = -1;
      }
    };

    $scope.arrowDown = function () {
      if($scope.selected !== $scope.autocompleteMovies.length + $scope.autocompleteTvShows.length + $scope.autocompletePeople.length -1) {
        $scope.selected++;
      }else{
        $scope.selected = 0;
      }
    };

    $scope.resetSelector = function () {
      $scope.selected = -1;
    };

    $scope.enter = function () {
      // Disable the input field for 50 ms to blur it
      $scope.searchDisabled = true;
      $timeout(function () {
        $scope.searchDisabled = false;
      }, 50);

      if($scope.selected === -1) {
        // No autosuggest item is selected, just go to the search page
        $scope.search();
      }else{
        // An autosuggest item is selected, find it and navigate there
        for(var i = 0;i<$scope.autocompleteMovies.length;i++) {
          if(i === $scope.selected) {
            $location.path('title/'+$scope.autocompleteMovies[i].id+'/movie');
          }
        }
        $scope.selected = $scope.selected - $scope.autocompleteMovies.length;

        for(var i = 0;i<$scope.autocompletePeople.length;i++) {
          if(i === $scope.selected) {
            $location.path('name/'+$scope.autocompletePeople[i].id);
          }
        }
        $scope.selected = $scope.selected - $scope.autocompletePeople.length;

        for(var i = 0;i<$scope.autocompleteTvShows.length;i++) {
          if(i === $scope.selected) {
            $location.path('title/'+$scope.autocompleteTvShows[i].id+'/tv');
          }
        }
        $scope.selected = $scope.selected - $scope.autocompleteTvShows.length;
      }
    };

    // Called when form is submitted
    $scope.search = function () {
      $location.path('search/'+$scope.query);
    };


  	$rootScope.$watch('query', function () {
      // Mirror query to the rootScope so everyone can reach it
  		$scope.query = $rootScope.query;
  	});

  });
