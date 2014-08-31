'use strict';

angular.module('omdbApp')
  .factory('commandSearch', ['api', function commandSearchFactory(api) {

    /*
     * Array of all possible commands and extra info about them
     */
    var commands = [{
        // People starring in [movie]
        targetSentence: 'people starring in',
        itemType: 'people',
        subjectType: 'movies', // can be replaced with [tv]
        subjectIdentifier: 'title', // can be replaced with [name]
        functionOrder: [
          'getSubject',
          'getAItemCreditsCast',
        ]
      }, {
        // Cast of [movie]
        targetSentence: 'cast of',
        itemType: 'people',
        subjectType: 'movies',
        subjectIdentifier: 'title',
        functionOrder: [
          'getSubject',
          'getAItemCreditsCast',
        ]
      }, {
        // Episodes of [tv series]
        targetSentence: 'episodes of',
        itemType: 'episodes',
        subjectType: 'tv',
        subjectIdentifier: 'name',
        functionOrder: [
          'getSubjectObjectWith',
          'getObjectCreditsForSubject',
          'getCreditDetailsFromCreditID',
          'getEpisodesFromCreditDetails'
        ]
      }];

    [{ itemType: 'movies', itemString: 'movies' },{ itemType: 'tv', itemString: 'tv series' },{ itemType: 'tv', itemString: 'tv shows' }].forEach(function (o) {
      commands.push({
        // [movies/tv series/tv shows] with [person]
        targetSentence: o.itemString+' with',
        itemType: o.itemType,
        subjectType: 'people',
        subjectIdentifier: 'name',
        functionOrder: [
          'getSubject',
          'get'+o.itemType[0].toUpperCase()+o.itemType.substring(1)+'Credits',
          'mergeCredits'
        ]
      }, {
        // [movies/tv series/tv shows] starring [person]
        targetSentence: o.itemString+' starring',
        itemType: o.itemType,
        subjectType: 'people',
        subjectIdentifier: 'name',
        functionOrder: [
          'getSubject',
          'get'+o.itemType[0].toUpperCase()+o.itemType.substring(1)+'CreditsCast',
        ]
      }, {
        // [movies/tv series/tv shows] directed by [person]
        targetSentence: o.itemString+' directed by',
        itemType: o.itemType,
        subjectType: 'people',
        subjectIdentifier: 'name',
        functionOrder: [
          'getSubject',
          'get'+o.itemType[0].toUpperCase()+o.itemType.substr(1)+'CreditsCrew',
          'filterCreditsDirecting'
        ]
      }, {
        // [movies/tv series/tv shows] produced by [person]
        targetSentence: o.itemString+' produced by',
        itemType: o.itemType,
        subjectType: 'people',
        subjectIdentifier: 'name',
        functionOrder: [
          'getSubject',
          'get'+o.itemType[0].toUpperCase()+o.itemType.substring(1)+'CreditsCrew',
          'filterCreditsProduction'
        ]
      }, {
        // [movies/tv series/tv shows] written by [person]
        targetSentence: o.itemString+' written by',
        itemType: o.itemType,
        subjectType: 'people',
        subjectIdentifier: 'name',
        functionOrder: [
          'getSubject',
          'get'+o.itemType[0].toUpperCase()+o.itemType.substring(1)+'CreditsCrew',
          'filterCreditsWriting'
        ]
      });
    });

    /*
     * All functions that are accessable for commands
     */
    var commandFunctions = {
      // Get more info about the subject
      getSubject: function (command, callback) {
        api.multi.autocomplete(command.subject, function (data) {
          command.subjectObject = data.results[0];
          command.subject = data.results[0].name || data.results[0].title;
          switch(command.subjectObject.media_type) {
            case 'tv':
              command.subjectType = 'tv';
              command.subjectIdentifier = 'name';
              command.subjectTypeDetails = 'title';
              break;
            case 'movie':
              command.subjectType = 'movies';
              command.subjectIdentifier = 'title';
              command.subjectTypeDetails = 'title';
              break;
            case 'person':
              command.subjectType = 'people';
              command.subjectIdentifier = 'name';
              command.subjectTypeDetails = 'name';
              break;
          }
          callback(command);
        });
      },

      getSubjectObjectWith: function (command, callback) {
        var SubObj      = command.subject.split(' with ');
        command.subject = SubObj[0];
        command.object  = SubObj[1];

        console.log('Subject:'+command.subject+', object:'+command.object);

        api.multi.autocomplete(command.subject, function (data) {
          command.subjectObject = data.results[0];
          command.subject = data.results[0].name || data.results[0].title;
          switch(command.subjectObject.media_type) {
            case 'tv':
              command.subjectType = 'tv';
              command.subjectIdentifier = 'name';
              break;
            case 'movie':
              command.subjectType = 'movies';
              command.subjectIdentifier = 'title';
              break;
            case 'person':
              command.subjectType = 'people';
              command.subjectIdentifier = 'name';
              break;
          }
          api.multi.autocomplete(command.object, function (data) {
            command.objectObject = data.results[0];
            command.object = data.results[0].name || data.results[0].title;
            switch(command.objectObject.media_type) {
              case 'tv':
                command.objectType = 'tv';
                command.objectIdentifier = 'name';
                break;
              case 'movie':
                command.objectType = 'movies';
                command.objectIdentifier = 'title';
                break;
              case 'person':
                command.objectType = 'people';
                command.objectIdentifier = 'name';
                break;
            }
            console.log(command);
            callback(command);
          });
        });
      },

      /*
       * Credits functions
       */

      // Get credits for tv AND movies
      getCombinedCredits: function (command, callback) {
        api[command.subjectType].combined_credits(command.subjectObject.id, function (data) {
          command.results = data.combined_credits;
          callback(command);
        });
      },
      getObjectCreditsForSubject: function (command, callback) {
        api[command.objectType].combined_credits(command.objectObject.id, function (data) {
          command.results = [];
          data.combined_credits.cast.forEach(function (credit) {
            if(credit.title === command.subject || credit.name === command.subject) {
              command.results.push(credit);
            }
          });
          console.log(command.results);
          callback(command);
        });
      },
      // Get credits from a person for movies
      getMoviesCredits: function (command, callback) {
        api[command.subjectType].movie_credits(command.subjectObject.id, function (data) {
          command.results = data.movie_credits;
          callback(command);
        });
      },
      // Get credits from a person for movies and select cast
      getMoviesCreditsCast: function (command, callback) {
        api[command.subjectType].movie_credits(command.subjectObject.id, function (data) {
          command.results = data.movie_credits.cast;
          callback(command);
        });
      },
      // Get credits from a person for movies and select crew
      getMoviesCreditsCrew: function (command, callback) {
        api[command.subjectType].movie_credits(command.subjectObject.id, function (data) {
          command.results = data.movie_credits.crew;
          callback(command);
        });
      },
      // Get credits from a person for movies
      getTvCredits: function (command, callback) {
        api[command.subjectType].tv_credits(command.subjectObject.id, function (data) {
          command.results = data.tv_credits;
          callback(command);
        });
      },
      // Get credits from a person for movies and select cast
      getTvCreditsCast: function (command, callback) {
        api[command.subjectType].tv_credits(command.subjectObject.id, function (data) {
          command.results = data.tv_credits.cast;
          callback(command);
        });
      },
      // Get credits from a person for movies and select crew
      getTvCreditsCrew: function (command, callback) {
        api[command.subjectType].tv_credits(command.subjectObject.id, function (data) {
          command.results = data.tv_credits.crew;
          callback(command);
        });
      },

      // Get credits for a movie/tv show and select cast
      getAItemCreditsCast: function (command, callback) {
        console.log(command.subjectType);
        api[command.subjectType].credits(command.subjectObject.id, function (data) {
          command.results = data.credits.cast;
          callback(command);
        });
      },

      // Merge the credits for cast and crew
      mergeCredits: function (command, callback) {
        // command.results should be an object containing the contents of the *_credits object
        var endResults = command.results.cast;
        command.results.crew.forEach(function (credit) {
          endResults.push(credit);
        });
        command.results = endResults;
        callback(command);
      },
      filterCreditsDirecting: function (command, callback) { commandFunctions.filterCreditsCrew(command, callback, 'Directing'); },
      filterCreditsProduction: function (command, callback) { commandFunctions.filterCreditsCrew(command, callback, 'Production'); },
      filterCreditsWriting: function (command, callback) { commandFunctions.filterCreditsCrew(command, callback, 'Writing'); },
      filterCreditsEditing: function (command, callback) { commandFunctions.filterCreditsCrew(command, callback, 'Editing'); },

      filterObjectCreditsCastWithSubject: function (command, callback) {
        var endResults = [];
        command.object.credits.cast.forEach(function (credit) {
          if(credit.department === department) {
            endResults.push(movie);
          }
        });
        command.results = endResults;
        callback(command);
      },

      getCreditDetailsFromCreditID: function (command, callback) {
        api.credits.id(command.results[0].credit_id, function (data) {
          command.results = data;
          console.log(data);
          callback(command);
        });
      },

      getEpisodesFromCreditDetails: function (command, callback) {
        command.subjectType = 'episodes';
        command.results = command.results.media.episodes;
        callback(command);
      },

      /*
       * Shortcut functions
       */

      filterCreditsCrew: function (command, callback, department) {
        var endResults = [];
        command.results.forEach(function (movie) {
          if(movie.department === department) {
            endResults.push(movie);
          }
        });
        command.results = endResults;
        callback(command);
      },
    };

    /*
     * Matches commands in queries by using the targetSentences from the commands array
     */
    var matchTargetSentences = function (query) {
      var queryLowerCase = query.toLowerCase();
      // Iterate through possible graph search queries
      for(var i = 0;i<commands.length;i++) {
        // Check if the query contains this graph search query
        if(queryLowerCase.indexOf(commands[i].targetSentence) === 0) {
          commands[i].subject = queryLowerCase.replace(commands[i].targetSentence+' ', '');
          return commands[i];
          break;
        }
      };
      return false;
    };

    /*
     * Self looping function to execute command functions
     */
    function executeFunctionOrder(index, command, results) {
      index++;
      if(index < command.functionOrder.length) {
        console.log(command.functionOrder[index]);
        commandFunctions[command.functionOrder[index]](command, function (command, results) {
          console.log(command.functionOrder[index]+' executed');
          executeFunctionOrder(index, command, results);
        });
      }else{
        console.log('All executed');
        factory.commandExecuted(command);
      }
    }

    var factory = {

      command: null,
      callback: null,

      getAllCommands: function () {
        var result = [];
        commands.forEach(function (command) {
          result.push(command.targetSentence);
        });
        return result;
      },

      findCommand: function (query, callback) {
        console.log('Checking if '+query+' is a command.');
        var command = matchTargetSentences(query);

        // If no command matches, callback
        if(!command) {
          callback(false);
          return;
        }else{
          console.log('Yes it is');
          callback(command);
        }
      },

      // Public function that should be called to turn a query into a set of instructions
      findAndExecuteCommand: function (query, callback) {
        factory.callback = callback;
        // Find a matching command
        factory.command = matchTargetSentences(query);

        // If no command matches, callback
        if(!factory.command) {
          factory.callback(false);
          return;
        }

        executeFunctionOrder(-1, factory.command);

      },
      commandExecuted: function (command) {
        console.log(command);
        factory.callback({
          type: command.itemType,
          title: command.targetSentence+' '+command.subject,
          results: command.results,
          command: command
        });
      }
    };

    return factory;
  }]);