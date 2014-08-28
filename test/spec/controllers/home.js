'use strict';

describe('Controller: HomeCtrl', function () {

  // load the controller's module
  beforeEach(module('omdbApp'));

  var HomeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    HomeCtrl = $controller('HomeCtrl', {
      $scope: scope
    });
  }));

/*  it('should attach a URL called posterPath to the scope', function () {
    expect(scope.posterPath.length).toBeGreaterThan(0);
  });*/

});
