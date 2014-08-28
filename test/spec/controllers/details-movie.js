'use strict';

describe('Controller: DetailsMovieCtrl', function () {

  // load the controller's module
  beforeEach(module('omdbApp'));

  var DetailsMovieCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DetailsMovieCtrl = $controller('DetailsMovieCtrl', {
      $scope: scope
    });
  }));

});
