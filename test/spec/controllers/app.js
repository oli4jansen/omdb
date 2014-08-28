'use strict';

describe('Controller: AppCtrl', function () {

  // load the controller's module
  beforeEach(module('omdbApp'));

  var AppCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AppCtrl = $controller('AppCtrl', {
      $scope: scope
    });
  }));

  it('should attach a boolean called showAutocomplete to the scope', function () {
    expect(scope.showAutocomplete).toBe(false);
  });
});
