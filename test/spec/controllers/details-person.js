'use strict';

describe('Controller: DetailsPersonCtrl', function () {

  // load the controller's module
  beforeEach(module('omdbApp'));

  var DetailsPersonCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DetailsPersonCtrl = $controller('DetailsPersonCtrl', {
      $scope: scope
    });
  }));

});
