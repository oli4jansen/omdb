'use strict';

angular.module('omdbApp')
  .controller('SearchCtrl', function ($scope, $rootScope, $routeParams, $location, $http, config, api, commandSearch) {

  	if(!$routeParams.query) {
      // If there is no query, we can not search
  	  $location.path('');
  	}else{
      // Attach the query to the rootScope to make is accessable from everywhere
      $rootScope.query = $routeParams.query;
    }

    $scope.posterPath  = config.getImagePath('poster', 1);
    $scope.profilePath = config.getImagePath('profile', 1);

    // Start with empty search results
    $scope.movies  = [];
    $scope.tvShows = [];
    $scope.people  = [];

    $scope.results = [];

    // Search for movies
    api.multi.search($routeParams.query, function (data) {
      $scope.resultCount = data.total_results;
      for(var i = 0;i<data.results.length;i++) {
        switch(data.results[i].media_type) {
          case 'movie':
            data.results[i].typeDetails = 'title';
            data.results[i].typeMedia = 'movie';
            break;
          case 'tv':
            data.results[i].typeDetails = 'title';
            data.results[i].typeMedia = 'tv';
            break;
          case 'person':
            data.results[i].typeDetails = 'name';
            data.results[i].typeMedia = '';
            break;
        }
      }
      $scope.results = data.results;
    });

    commandSearch.findAndExecuteCommand($routeParams.query, function (data) {
      if(!data) return;

      if(data.results.length) {
        switch(data.type) {
          case 'tv':
            $scope.results = data.results;
            $scope.typeDetails = 'title';
            $scope.typeMedia = 'tv';
            break;
          case 'people':
            $scope.results = data.results;
            $scope.typeDetails = 'name';
            $scope.typeMedia = '';
            break;
          case 'movies':
          default:
            $scope.results = data.results;
            $scope.typeDetails = 'title';
            $scope.typeMedia = 'movie';
            break;
        };
      }

    });

  });
