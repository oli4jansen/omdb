'use strict';

angular.module('omdbApp')
  .factory('config', ['$http', 'APIURL', 'APIKey', function configFactory($http, APIURL, APIKey) {

  	// Old copy of config (dirty dirty dirty)
    var config = {'images':{'base_url':'http://image.tmdb.org/t/p/','secure_base_url':'https://image.tmdb.org/t/p/','backdrop_sizes':['w300','w780','w1280','original'],'logo_sizes':['w45','w92','w154','w185','w300','w500','original'],'poster_sizes':['w92','w154','w185','w342','w500','w780','original'],'profile_sizes':['w45','w185','h632','original'],'still_sizes':['w92','w185','w300','original']},'change_keys':['adult','also_known_as','alternative_titles','biography','birthday','budget','cast','character_names','crew','deathday','general','genres','homepage','images','imdb_id','name','original_title','overview','plot_keywords','production_companies','production_countries','releases','revenue','runtime','spoken_languages','status','tagline','title','trailers','translations']};

    var factory = {
      // Checks if a config object is stored in the localStorage and if not, gets one from the API and stores it
      loadConfig: function () {
      	console.log('Load config called');
	  	var tempConfig = localStorage.getItem('configuration');

	  	try {
	  	  tempConfig = JSON.parse(tempConfig);
	  	}catch (err) {
	  	  console.log(err);
	  	  tempConfig = null;
	  	  localStorage.setItem('configuration', null);
	  	}

	  	// Nieuwe config ophalen, als dat nodig is
	  	if(!tempConfig || tempConfig === undefined || tempConfig === null) {
		  $http({
		  	method: 'GET',
		    url: APIURL+'configuration',
	        params: {
		      api_key: APIKey,
		    }
		  }).success(function (data) {
		  	console.log('Got config from API and put in storage');
		    localStorage.setItem('configuration', JSON.stringify(data));
		    config = data;
		  }).error(function (data) {
		    console.log(data);
	      });
	    }else{
	      console.log('Got config from storage');
	      config = tempConfig;
	    }
      },

      // To be called from outside the service, making the config object publicly available
      getConfig: function () {
        return config;
      },

      // Composes a path that can be used to display the images returned by the API
      getImagePath: function (imageType, size) {
      	var imageTypePath = '';
      	if(size !== 'original') {
      	  imageTypePath = config.images[imageType+'_sizes'][size];
      	}else{
    	  imageTypePath = config.images[imageType+'_sizes']+'original';
      	}
      	return config.images.base_url+imageTypePath;
      }
    };

    factory.loadConfig();

	return factory;
  }]);