'use strict';

angular.module('omdbApp')
  .factory('api', ['$http', 'APIURL', 'APIKey', function apiFactory($http, APIURL, APIKey) {

    var factory = {

      /*
       * Reusable API shizzle
       */

      simpleRequest: function (endpoint, callback, params) {
        if(params !== null && typeof params === 'object') {
          // If params are passed, add the API key and leave it the way it was
          params.api_key = APIKey;
        }else{
          // The API key is always needed
          params = { api_key: APIKey };
        }

        $http({
          method: 'GET',
          url: APIURL+endpoint,
          params: params
        }).success(function (data) {
          callback(data);
        }).error(function (data) {
          factory.error(data);
        });

      },

      /*
       * Nonreuseable API shizzle
       * This should all be pretty self-explanatory
       */

      movies: {
        id: function (id, callback) {
          factory.simpleRequest('movie/'+id, callback, {
            append_to_response: 'credits,images,similar,videos'
          });
        },
        credits: function (id, callback) {
          factory.simpleRequest('movie/'+id, callback, {
            append_to_response: 'credits'
          });
        },

      	playing: function (callback) {
          factory.simpleRequest('movie/now_playing', callback);
      	},
        popular: function (callback) {
          factory.simpleRequest('movie/popular', callback);
        },
        discover: function (callback) {
          factory.simpleRequest('discover/movie', callback);
        },

        search: function (query, callback) {
          factory.simpleRequest('search/movie', callback, {
            query: query
          });
        },
        autocomplete: function (query, callback) {
          factory.simpleRequest('search/movie', callback, {
            query: query,
            search_type: 'ngram'
          });
        }
      },

      tv: {
        id: function (id, callback) {
          factory.simpleRequest('tv/'+id, callback, {
            append_to_response: 'credits,images,similar,videos'
          });
        },
        season: function (id, seasonNumber, callback) {
          factory.simpleRequest('tv/'+id+'/season/'+seasonNumber, callback, {
            append_to_response: 'images,videos'
          });
        },
        episode: function (id, seasonNumber, episodeNumber, callback) {
          factory.simpleRequest('tv/'+id+'/season/'+seasonNumber+'/episode/'+episodeNumber, callback, {
            append_to_response: 'images,credits'
          });
        },

        popular: function (callback) {
          factory.simpleRequest('tv/popular', callback);
        },
        airingToday: function (callback) {
          factory.simpleRequest('tv/airing_today', callback);
        },
        topRated: function (callback) {
          factory.simpleRequest('tv/top_rated', callback);
        },

        search: function (query, callback) {
          factory.simpleRequest('search/tv', callback, {
            query: query
          });
        },
        autocomplete: function (query, callback) {
          factory.simpleRequest('search/tv', callback, {
            query: query,
            search_type: 'ngram'
          });
        }
      },

      people: {
        id: function (id, callback) {
          factory.simpleRequest('person/'+id, callback, {
            append_to_response: 'combined_credits,images,tagged_images'
          });
        },
        combined_credits: function (id, callback) {
          factory.simpleRequest('person/'+id, callback, {
            append_to_response: 'combined_credits'
          });
        },
        movie_credits: function (id, callback) {
          factory.simpleRequest('person/'+id, callback, {
            append_to_response: 'movie_credits'
          });
        },
        tv_credits: function (id, callback) {
          factory.simpleRequest('person/'+id, callback, {
            append_to_response: 'tv_credits'
          });
        },

        popular: function (callback) {
          factory.simpleRequest('person/popular', callback);
        },

        search: function (query, callback) {
          factory.simpleRequest('search/person', callback, {
            query: query
          });
        },
        autocomplete: function (query, callback) {
          factory.simpleRequest('search/person', callback, {
            query: query,
            search_type: 'ngram'
          });
        }
      },

      multi: {
        search: function (query, callback) {
          factory.simpleRequest('search/multi', callback, {
            query: query
          });
        },
        autocomplete: function (query, callback) {
          factory.simpleRequest('search/multi', callback, {
            query: query,
            search_type: 'ngram'
          });
        }        
      },

      error: function (data) {
        console.log('error');
        console.log(data);
      }
    };

	  return factory;
  }]);